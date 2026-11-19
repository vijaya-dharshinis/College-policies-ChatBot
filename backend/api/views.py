import os
import uuid
import zipfile
import xml.etree.ElementTree as ET
from django.http import HttpResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pypdf

from .models import Document, DocumentChunk, ChatSession, ChatMessage, Feedback
from .serializers import DocumentSerializer, ChatMessageSerializer, FeedbackSerializer
from .rag_engine import RAGEngine
from .pdf_generator import generate_simple_pdf

class DocumentListView(APIView):
    def get(self, request):
        RAGEngine.initialize_default_handbook()
        docs = Document.objects.all().order_by('-is_default', '-uploaded_at')
        serializer = DocumentSerializer(docs, many=True)
        return Response(serializer.data)

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Enforce size limit (default 20MB per SRS FR-1.3)
        if file_obj.size > 20 * 1024 * 1024:
            return Response({"error": "File size exceeds the 20MB limit."}, status=status.HTTP_400_BAD_REQUEST)

        filename = file_obj.name
        ext = os.path.splitext(filename)[1].lower().replace('.', '')
        if ext not in ['pdf', 'txt', 'md', 'docx']:
            return Response({"error": "Unsupported file format. Please upload PDF, DOCX, TXT or Markdown."}, status=status.HTTP_400_BAD_REQUEST)

        doc = Document.objects.create(
            name=filename,
            file=file_obj,
            file_type=ext,
            size_bytes=file_obj.size,
            status='processing'
        )

        extracted_text = ""
        page_count = 1

        try:
            if ext == 'pdf':
                reader = pypdf.PdfReader(doc.file.path)
                page_count = len(reader.pages)
                pages_text = []
                for p_idx, page in enumerate(reader.pages):
                    t = page.extract_text() or ""
                    pages_text.append(f"--- Page {p_idx+1} ---\n{t}")
                extracted_text = "\n".join(pages_text)
            elif ext in ['txt', 'md']:
                with open(doc.file.path, 'rb') as f:
                    content_bytes = f.read()
                    try:
                        extracted_text = content_bytes.decode('utf-8')
                    except UnicodeDecodeError:
                        extracted_text = content_bytes.decode('latin-1', errors='replace')
                page_count = max(1, len(extracted_text) // 1800)
            elif ext == 'docx':
                with zipfile.ZipFile(doc.file.path) as z:
                    xml_content = z.read('word/document.xml')
                    tree = ET.fromstring(xml_content)
                    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                    texts = [node.text for node in tree.iter(f"{{{ns['w']}}}t") if node.text]
                    extracted_text = " ".join(texts)
                page_count = max(1, len(extracted_text) // 1800)

            if not extracted_text.strip():
                doc.status = 'error'
                doc.save()
                return Response({"error": "Could not extract readable text from document."}, status=status.HTTP_400_BAD_REQUEST)

            doc.content_text = extracted_text
            doc.page_count = page_count
            doc.status = 'ready'
            doc.save()

            # Chunk and index
            RAGEngine.chunk_and_index_text(doc, extracted_text)

            serializer = DocumentSerializer(doc)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            doc.status = 'error'
            doc.save()
            return Response({"error": f"Failed to process document: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentDetailView(APIView):
    def delete(self, request, pk):
        try:
            doc = Document.objects.get(pk=pk)
            if doc.is_default:
                return Response({"error": "The primary University Policy Handbook cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)
            if doc.file:
                try:
                    if os.path.exists(doc.file.path):
                        os.remove(doc.file.path)
                except Exception:
                    pass
            doc.delete()
            return Response({"message": "Document removed successfully."}, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)


class ChatView(APIView):
    def get(self, request):
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response({"messages": []})
        try:
            session = ChatSession.objects.get(session_id=session_id)
            messages = session.messages.all().order_by('timestamp')
            serializer = ChatMessageSerializer(messages, many=True)
            return Response({"session_id": session_id, "messages": serializer.data})
        except ChatSession.DoesNotExist:
            return Response({"session_id": session_id, "messages": []})

    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            session_id = str(uuid.uuid4())

        query = request.data.get('message', '').strip()
        if not query:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Enforce question length limit (default 2,000 characters per SRS FR-2.4)
        if len(query) > 2000:
            query = query[:2000]

        session, _ = ChatSession.objects.get_or_create(session_id=session_id)

        # Save user message
        user_msg = ChatMessage.objects.create(
            session=session,
            role='user',
            content=query
        )

        doc_ids = request.data.get('document_ids')

        # Run RAG Engine with SRS System Prompt and Grounding
        rag_result = RAGEngine.generate_response(query=query, conversation_history=None, document_ids=doc_ids)

        # Save assistant message
        assistant_msg = ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=rag_result.get('message', ''),
            card_data=rag_result.get('card_data') or {},
            references=rag_result.get('references') or [],
            citations=rag_result.get('citations') or []
        )

        serializer = ChatMessageSerializer(assistant_msg)
        return Response({
            "session_id": session_id,
            "message": serializer.data
        }, status=status.HTTP_200_OK)


class ChatClearView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        if session_id:
            try:
                session = ChatSession.objects.get(session_id=session_id)
                session.messages.all().delete()
            except ChatSession.DoesNotExist:
                pass
        return Response({"message": "Chat history cleared."})


class FeedbackView(APIView):
    def post(self, request):
        msg_id = request.data.get('message_id')
        rating = request.data.get('rating') # 'up' or 'down'
        comment = request.data.get('comment', '')

        msg = None
        if msg_id:
            try:
                msg = ChatMessage.objects.get(id=msg_id)
            except ChatMessage.DoesNotExist:
                pass

        feedback = Feedback.objects.create(
            message=msg,
            rating=rating if rating in ['up', 'down'] else 'up',
            comment=comment
        )
        return Response({"message": "Thank you for your feedback!", "id": feedback.id})


class SearchView(APIView):
    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if not q or len(q) < 2:
            return Response([])

        RAGEngine.initialize_default_handbook()
        chunks, _ = RAGEngine.retrieve(q, top_k=6)
        results = []
        for c in chunks:
            results.append({
                "section": c.section_title,
                "document": c.document.name,
                "page": c.page_number,
                "snippet": c.content[:140] + "..."
            })
        return Response(results)


class DownloadCircularView(APIView):
    def get(self, request, slug):
        slug = slug.lower().strip()
        
        if slug in ['handbook', 'sku-handbook', 'full-handbook']:
            pdf_path = os.path.join(os.path.dirname(__file__), 'data', 'Sri_Krishna_University_Policy_Handbook.pdf')
            if os.path.exists(pdf_path):
                return FileResponse(open(pdf_path, 'rb'), as_attachment=True, filename='Sri_Krishna_University_Policy_Handbook.pdf')

        # Generate on-the-fly official circular PDF
        circular_titles = {
            'attendance': ("ATTENDANCE POLICY CIRCULAR", "Sri Krishna University Academic Regulation 2026", [
                ("Mandatory 75% Requirement", "Students must maintain a minimum of 75% attendance in theory, laboratory, and tutorial sessions separately to qualify for end-semester examinations."),
                ("Condonation Clause (65% to 74%)", "Attendance between 65% and 74% may be condoned by the Dean on valid medical grounds or university-sanctioned On-Duty representation, upon payment of prescribed condonation fee."),
                ("Severe Shortage (<65%)", "Students with attendance below 65% are strictly ineligible for condonation and must repeat the course when next offered. Hall tickets will be withheld."),
                ("Medical Leave Submission", "Medical certificates must be submitted to the Head of Department within 7 days of returning to campus.")
            ]),
            'anti-ragging': ("ANTI-RAGGING CIRCULAR & DIRECTIVES", "Supreme Court & UGC Regulations Compliance", [
                ("Zero Tolerance", "Sri Krishna University strictly enforces zero-tolerance against any physical, verbal, or emotional harassment or ragging."),
                ("Anti-Ragging Committee & Squad", "Vigilance squads patrol campus, hostels, bus stops, and canteens 24/7."),
                ("Helplines", "24-Hour University Helpline: 0000-000-0000. National UGC Anti-Ragging Portal is active."),
                ("Statutory Penalties", "Cancellation of admission, debarment from exams, suspension, expulsion, and lodging of police FIR.")
            ]),
            'hostel': ("HOSTEL RULES & WELFARE REGULATIONS", "Student Residence Handbook", [
                ("Hostel Allotment", "Separate hostels for men and women equipped with Wi-Fi, laundry, gym, and 24/7 security. Priority given to outstation students."),
                ("Curfew & Timings", "Students must adhere to evening check-in hours. Equal safety-oriented closing timings apply across all hostels. Late passes require warden approval."),
                ("Prohibited Articles", "Electrical cooking appliances, alcohol, smoking, narcotics, and unauthorized visitors are strictly forbidden."),
                ("Mess & Hygiene", "Monthly student mess committee meets to review nutrition, variety, and FSSAI hygiene standards.")
            ]),
            'examination': ("EXAMINATION & EVALUATION GUIDELINES", "Office of Controller of Examinations", [
                ("40:60 Assessment Ratio", "Courses carry 40% Continuous Internal Assessment and 60% End-Semester Examination."),
                ("Passing Standard", "Minimum 40% in end-semester exam and 50% composite aggregate required to pass."),
                ("Revaluation Window", "Apply for answer script copy and revaluation within 10 days of result publication."),
                ("Malpractice Committee", "Any cheating or phone possession in exam hall leads to paper cancellation or debarment.")
            ]),
            'code-of-conduct': ("STUDENT CODE OF CONDUCT & DISCIPLINE", "Office of the Proctor & Dean of Student Affairs", [
                ("Campus Identification", "Identity card must be visibly worn at all times within campus grounds and university transport."),
                ("Integrity & Decorum", "Professional decorum, respect for faculty and peers, and adherence to clean campus rules."),
                ("Misconduct & Sanctions", "Disruption, vandalism, substance abuse, and cyberbullying lead to disciplinary inquiry and penalties."),
                ("Appeals Procedure", "Students may appeal disciplinary decisions to the Vice-Chancellor within 15 days.")
            ])
        }

        info = circular_titles.get(slug, ("OFFICIAL UNIVERSITY POLICY CIRCULAR", "Sri Krishna University Administrative Notice", [
            ("Policy Overview", "Please refer to the full University Policy Handbook for complete academic, residential, and operational policies."),
            ("Contact Office", "Office of the Registrar, Sri Krishna University. Email: registrar@srikrishna-university.example")
        ]))

        title, subtitle, sections = info
        pdf_bytes = generate_simple_pdf(title, subtitle, sections)
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="SKU_{slug.replace("-", "_").upper()}_CIRCULAR.pdf"'
        return response


class FAQListView(APIView):
    def get(self, request):
        faqs = [
            {
                "question": "What is the minimum attendance required to appear for exams?",
                "answer": "A minimum of 75% attendance is required separately in theory, lab, and tutorial classes. Condonation is permitted between 65% and 74% on valid medical or On-Duty grounds.",
                "category": "Attendance"
            },
            {
                "question": "What is the passing criteria for end-semester examinations?",
                "answer": "A student must secure at least 40% in the end-semester examination and at least 50% overall (including internal assessment) to pass the course.",
                "category": "Examinations"
            },
            {
                "question": "What is the policy regarding ragging on campus?",
                "answer": "Sri Krishna University enforces a strict zero-tolerance anti-ragging policy under UGC regulations. Punishments include immediate suspension, expulsion, and filing a police FIR.",
                "category": "Anti-Ragging"
            },
            {
                "question": "What are the hostel closing timings and visitor rules?",
                "answer": "Students must be inside by the night closing time. Equal safety timings apply to all hostels. Visitors are only permitted in the designated visitor lounge during visiting hours.",
                "category": "Hostel"
            },
            {
                "question": "How does the grading and CGPA promotion work?",
                "answer": "The university uses a 10-point absolute grading scale (O: 10, A+: 9, A: 8, B+: 7, B: 6, C: 5, F: 0). Promotion requires passing at least two-thirds of previous year credits.",
                "category": "Academics"
            },
            {
                "question": "What is the procedure for grievance redressal?",
                "answer": "First raise issues with the faculty mentor or HoD within 7 days. If unresolved, approach the Grievance Redressal Committee (30-day resolution window), with escalation to the University Ombudsperson.",
                "category": "Student Welfare"
            }
        ]
        return Response(faqs)


class SettingsView(APIView):
    def get(self, request):
        settings_data = RAGEngine.get_settings()
        return Response(settings_data)

    def post(self, request):
        updated = RAGEngine.save_settings(request.data)
        return Response({"message": "Settings updated successfully", "settings": updated})


class TestConnectionView(APIView):
    def post(self, request):
        api_key = request.data.get('api_key', '')
        model_name = request.data.get('model_name', 'gemini-2.5-flash')
        result = RAGEngine.test_api_connection(api_key, model_name)
        return Response(result)

