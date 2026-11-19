import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ChatArea from './components/ChatArea';
import { UploadModal, CitationModal, FAQModal, ContactSupportModal, CalendarModal, SettingsModal } from './components/Modals';

// Initial state replicating the user's uploaded screenshot perfectly!
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'user',
    content: 'Tell me about attendance policy',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    role: 'assistant',
    content: "Here's a quick summary of the Attendance Policy at Sri Krishna University:",
    card_data: {
      icon_type: 'calendar',
      badge: 'Key Points',
      key_points: [
        { title: 'Minimum Attendance', detail: '75% is mandatory for all courses.' },
        { title: 'Leave & Absence', detail: 'Inform the concerned authority in advance.' },
        { title: 'Medical Leave', detail: 'Submit medical certificate within 3 days.' },
        { title: 'Shortage of Attendance', detail: 'May lead to withholding of hall ticket.' }
      ],
      circular_button: 'Download Official Circular PDF',
      circular_slug: 'attendance'
    },
    references: ['Academic Handbook', 'Attendance Rules', 'Examination Guidelines'],
    citations: [
      {
        document: 'Sri Krishna University Policy Handbook',
        section: 'Section 5: Attendance Policy',
        page: 2,
        quote: 'A student must attend at least 75 percent of the classes held in every course, counting theory, laboratory and tutorial sessions separately, in order to be allowed to write the end-semester examination.'
      },
      {
        document: 'Sri Krishna University Policy Handbook',
        section: 'Section 23: Student Leave Policy',
        page: 4,
        quote: 'A student who needs to be away from classes must apply in advance, through the mentor and the Head of Department. Medical leave requires a certificate from a registered medical practitioner.'
      }
    ],
    timestamp: new Date().toISOString()
  }
];

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeTab, setActiveTab] = useState('attendance');
  const [darkMode, setDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'upload', 'citation', 'faqs', 'support', 'calendar'
  const [selectedCitations, setSelectedCitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate or load session id
    let sid = localStorage.getItem('sku_docuchat_session');
    if (!sid) {
      sid = 'session-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('sku_docuchat_session', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = data.message;
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Fallback message
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: "I couldn't process this request right now. Please try again or rephrase your question about Sri Krishna University policies.",
            card_data: {},
            references: ['Attendance Rules', 'Exam Guidelines', 'Hostel Rules'],
            citations: [],
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "Network error communicating with the policy server. Please ensure the backend is running.",
          card_data: {},
          references: [],
          citations: [],
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceClick = (refTitle) => {
    handleSendMessage(`Tell me more about ${refTitle}`);
  };

  const handleOpenCitation = (citations) => {
    setSelectedCitations(citations);
    setActiveModal('citation');
  };

  return (
    <div className="min-h-screen bg-[#F0F2FA] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        onSelectPolicy={handleSendMessage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSettings={() => setActiveModal('settings')}
      />

      {/* Main 3-Column Layout matching the UI */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-5 items-stretch">
        {/* Left Sidebar */}
        <div className="hidden md:block flex-shrink-0">
          <LeftSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectQuery={handleSendMessage}
          />
        </div>

        {/* Center Chat Canvas */}
        <div className="flex-1 min-w-0 flex flex-col min-h-[720px]">
          <ChatArea
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onOpenUpload={() => setActiveModal('upload')}
            onOpenCitation={handleOpenCitation}
            onReferenceClick={handleReferenceClick}
          />
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block flex-shrink-0">
          <RightSidebar
            onOpenModal={(modalName) => setActiveModal(modalName)}
            onSelectPolicy={handleSendMessage}
          />
        </div>
      </main>

      {/* Interactive Modals */}
      <UploadModal
        isOpen={activeModal === 'upload'}
        onClose={() => setActiveModal(null)}
        onDocumentsUpdated={() => {}}
      />

      <CitationModal
        isOpen={activeModal === 'citation'}
        onClose={() => setActiveModal(null)}
        citations={selectedCitations}
      />

      <FAQModal
        isOpen={activeModal === 'faqs'}
        onClose={() => setActiveModal(null)}
        onSelectQuestion={handleSendMessage}
      />

      <ContactSupportModal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
      />

      <CalendarModal
        isOpen={activeModal === 'calendar'}
        onClose={() => setActiveModal(null)}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
