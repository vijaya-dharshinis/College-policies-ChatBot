# Sri Krishna University (SKU) Policy Assistant — DocuChat Web Application

An AI-powered, document-grounded chatbot web application for **Sri Krishna University (SKU)** policies, regulations, and student guidelines, developed strictly in accordance with the **Software Requirements Specification (SRS)** and the **Sri Krishna University Policy Handbook**.

Built with **Django (REST Framework)** and **React (Vite, Tailwind CSS, Lucide Icons)**.

---

## 🌟 Key Capabilities & Requirements Implemented

1. **RAG (Retrieval-Augmented Generation) on College Policy Handbook**:
   - The entire Sri Krishna University Policy Handbook (Part I to Part VI, Sections 1 to 38) is indexed into structured document chunks with section titles, page references, and inverted term-frequency indices.
   - Grounded hybrid retrieval (BM25/TF-IDF + semantic title boosting) fetches exact policy passages.
   - Grounded citations (`[Sri Krishna University Policy Handbook, Section X, Page Y]`) accompany every answer.
   - Users can upload additional PDF, DOCX, TXT, or Markdown documents (up to 20MB) to dynamically index into the RAG vector store.

2. **System Prompt Compliance (SRS Section 5)**:
   - Implements the complete **SRS Section 5.1 Recommended System Prompt**:
     - Strict in-document grounding rule (never hallucinating or using ungrounded internet knowledge).
     - Strict refusal for out-of-domain queries (SRS FR-5.3, FR-5.4).
     - Strict defense against prompt injection attempts (SRS FR-5.8).
     - Preserves original quotations verbatim when asked (SRS FR-4.2).

3. **Pixel-Accurate UI Matching the Design**:
   - **Header**: Sri Krishna University crest and typography ("Learn • Grow • Excel"), interactive real-time policy search bar with autocomplete suggestions, neoclassical campus building banner artwork, notification drawer with active circulars, and dark/light mode toggle.
   - **Left Sidebar**: Deep navy curved card with active navigation pills (Home, Academic Rules, Attendance, Exam Guidelines, Hostel Rules, Anti-Ragging Policy), glowing open book illustration, and inspirational quote *"Knowledge Today, A Brighter Tomorrow"*.
   - **Central Chat Canvas**:
     - 3D graduate robot mascot banner ("SKU Policy Assistant ✨ - Your AI helper for college policies and guidelines!").
     - Alternating user and bot chat bubbles.
     - Visual Rich Policy Cards with cute illustrated calendar/clock, "⭐ Key Points" pill badge, structured checkmarked bullet points, and "📥 Download Official Circular PDF >" button.
     - Interactive "📖 Related Handbook References" pills.
     - Grounded citation inspector modal to view the exact text excerpts.
     - Thumbs up/down quality feedback buttons (SRS FR-7.5).
     - Bottom chat bar with "Upload PDF / Add your documents" pill, attachment clip, and paper airplane send button.
   - **Right Sidebar**:
     - "📣 Quick Access ✨" 2x2 grid: Download PDFs, FAQs, Contact Support, Academic Calendar.
     - "⭐ Popular Policies" quick-trigger list with chevrons.

---

## 🚀 How to Run the Application

### Option A: Run Unified via Django (Single Port: 8000)
The React frontend has been built into `frontend/dist/` and is served directly by Django:

```powershell
# In terminal:
cd "d:\exp 4\backend"
python manage.py runserver 127.0.0.1:8000
```
Open your browser at: **`http://127.0.0.1:8000/`**

---

### Option B: Run Frontend & Backend Concurrently (Development Mode with HMR)

#### 1. Start the Django Backend:
```powershell
cd "d:\exp 4\backend"
python manage.py runserver 127.0.0.1:8000
```

#### 2. In a second terminal, start the React Vite Server:
```powershell
cd "d:\exp 4\frontend"
npm run dev
```
Open your browser at: **`http://localhost:5173/`**

---

## 🧪 Automated Test Suite
To run the automated test suite verifying RAG retrieval, citations, out-of-domain refusals, PDF downloads, and document uploading:

```powershell
cd "d:\exp 4\backend"
python manage.py test api
```

---

## 📁 Project Directory Structure
```
d:\exp 4\
├── backend/
│   ├── api/
│   │   ├── data/
│   │   │   ├── sku_policy_handbook.txt              # Complete SKU Handbook (38 sections)
│   │   │   └── Sri_Krishna_University_Policy_Handbook.pdf # Generated Official PDF
│   │   ├── models.py                                # Document, DocumentChunk, ChatSession, ChatMessage, Feedback
│   │   ├── rag_engine.py                            # RAG pipeline with SRS System Prompt, BM25 & Grounding
│   │   ├── pdf_generator.py                         # Generates official circular and handbook PDFs
│   │   ├── serializers.py                           # REST Framework serializers
│   │   ├── views.py                                 # Chat, Documents, Search, Circulars, FAQs
│   │   ├── urls.py                                  # API routing
│   │   └── tests.py                                 # Automated test suite (10/10 tests passing)
│   ├── skuchat_backend/
│   │   ├── settings.py                              # Django configuration (CORS, REST, static, templates)
│   │   └── urls.py                                  # Main URL router
│   ├── manage.py
│   └── db.sqlite3
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                           # Top university branding, search bar, circulars, dark toggle
│   │   │   ├── LeftSidebar.jsx                      # Navy sidebar, nav pills, glowing book quote
│   │   │   ├── RightSidebar.jsx                     # Quick Access 2x2 grid & Popular Policies
│   │   │   ├── ChatArea.jsx                         # 3D mascot banner, rich cards, key points, input bar
│   │   │   ├── Modals.jsx                           # Upload PDF modal, Citations viewer, FAQs, Contacts, Calendar
│   │   │   └── illustrations.jsx                    # Vector SVGs (SKU Crest, Robot, Calendar/Clock, Glowing Book)
│   │   ├── App.jsx                                  # Main application controller
│   │   └── index.css                                # Tailwind CSS & scrollbar styling
│   ├── dist/                                        # Production-built bundle served by Django
│   ├── package.json
│   └── vite.config.js
└── README.md
```
