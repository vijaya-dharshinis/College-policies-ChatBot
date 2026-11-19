import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, ThumbsUp, ThumbsDown, Download, CheckCircle2, FileUp, Sparkles, User, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';
import { RobotMascot, CalendarIllustration, GraduationCapDeco } from './illustrations';

export default function ChatArea({
  messages,
  onSendMessage,
  isLoading,
  onOpenUpload,
  onOpenCitation,
  activeDocumentCount = 1,
  onReferenceClick
}) {
  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleFeedback = async (msgId, rating) => {
    setFeedbackGiven(prev => ({ ...prev, [msgId]: rating }));
    try {
      await fetch('http://127.0.0.1:8000/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: msgId, rating })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadCircular = (slug = 'attendance') => {
    window.open(`http://127.0.0.1:8000/api/download-circular/${slug}/`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6FC] dark:bg-slate-950/80 rounded-3xl p-4 md:p-6 shadow-sm border border-indigo-50 dark:border-slate-800 transition-colors relative overflow-hidden">
      {/* Top SKU Policy Assistant Mascot Banner */}
      <div className="flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl p-3 md:p-4 mb-4 shadow-sm border border-indigo-50 dark:border-slate-800">
        <RobotMascot className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-[#1E255E] dark:text-white tracking-tight">
              SKU Policy Assistant
            </h2>
            <span className="text-amber-400">✨</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your AI helper for college policies and guidelines!
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Active RAG Engine</span>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-5 select-text">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            return (
              <div key={index} className="flex justify-end items-start gap-2.5">
                <div className="bg-[#E4E9FA] dark:bg-indigo-950/70 text-slate-800 dark:text-slate-100 text-sm font-medium px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm max-w-lg border border-indigo-100/60 dark:border-indigo-900/50">
                  {msg.content}
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-indigo-700 dark:text-indigo-300">
                  <User className="w-4 h-4" />
                </div>
              </div>
            );
          }

          // Bot Message
          const cardData = msg.card_data || {};
          const keyPoints = cardData.key_points || [];
          const circularSlug = cardData.circular_slug || 'attendance';

          return (
            <div key={index} className="flex items-start gap-3">
              {/* Bot Mascot Small Avatar */}
              <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-indigo-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <RobotMascot className="w-9 h-9" />
              </div>

              {/* Bot Message Bubble & Rich Card */}
              <div className="flex-1 max-w-2xl space-y-3">
                {/* Intro bubble */}
                <div className="inline-block bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-sm border border-indigo-50 dark:border-slate-800">
                  {msg.content}
                </div>

                {/* Visual Rich Policy Card (if card_data present) */}
                {keyPoints.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-indigo-50 dark:border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Left: Illustration */}
                      <div className="flex-shrink-0">
                        <CalendarIllustration className="w-28 h-28" />
                      </div>

                      {/* Right: Key Points list */}
                      <div className="flex-1 space-y-2.5 w-full">
                        {/* Key Points Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E255E] text-white text-xs font-semibold shadow-sm">
                          <span className="text-amber-400">★</span>
                          <span>Key Points</span>
                        </div>

                        {/* List of Key Points with Checkmarks */}
                        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {keyPoints.map((kp, kIdx) => (
                            <div key={kIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-amber-500 fill-amber-100 dark:fill-amber-950 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong className="text-slate-900 dark:text-white font-semibold">{kp.title}: </strong>
                                <span>{kp.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Download Circular Button */}
                        <button
                          onClick={() => handleDownloadCircular(circularSlug)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#1E255E] hover:bg-[#161B48] text-white text-xs font-semibold shadow transition-all duration-150 group"
                        >
                          <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                          <span>Download Official Circular PDF</span>
                          <span className="text-indigo-300 ml-0.5">&gt;</span>
                        </button>
                      </div>
                    </div>

                    {/* Related Handbook References Pills */}
                    {msg.references && msg.references.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Related Handbook References:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.references.map((refItem, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => onReferenceClick && onReferenceClick(refItem)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0FF] dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-700 text-xs font-medium transition-all group border border-indigo-100/60 dark:border-slate-700"
                            >
                              <span>{refItem}</span>
                              <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">&gt;</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Citations / Grounding Source Link */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                        <button
                          onClick={() => onOpenCitation(msg.citations)}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Grounded Source Passage ({msg.citations.length} cited)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer with Timestamp & Feedback */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  
                  {/* Thumbs up / down feedback (SRS FR-7.5) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition ${
                        feedbackGiven[msg.id] === 'up' ? 'text-emerald-500 font-bold' : 'text-slate-400'
                      }`}
                      title="Helpful answer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition ${
                        feedbackGiven[msg.id] === 'down' ? 'text-rose-500 font-bold' : 'text-slate-400'
                      }`}
                      title="Unhelpful answer"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-indigo-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0">
              <RobotMascot className="w-9 h-9 animate-bounce" />
            </div>
            <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-sm border border-indigo-50 dark:border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Retrieving policy handbook passages & verifying grounding...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Floating Decorative Graduation Cap */}
      <div className="absolute right-5 bottom-20 pointer-events-none opacity-80 hidden lg:block">
        <GraduationCapDeco className="w-20 h-20" />
      </div>

      {/* Bottom Chat Input Bar */}
      <div className="relative mt-4 flex flex-col sm:flex-row items-center gap-3">
        {/* Upload PDF Pill Button */}
        <button
          onClick={onOpenUpload}
          className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 rounded-full bg-[#E5E9FA] dark:bg-slate-800/90 hover:bg-indigo-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm border border-indigo-200/50 dark:border-slate-700 transition-all flex-shrink-0"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <FileUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="leading-tight">Upload PDF</div>
            <div className="text-[10px] text-slate-400 leading-tight">Add your documents</div>
          </div>
        </button>

        {/* Input Field Pill with Paperclip & Send */}
        <form onSubmit={handleSubmit} className="flex-1 w-full flex items-center bg-white dark:bg-slate-900 rounded-full px-4 py-2 shadow-md border border-indigo-100 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-400/40 transition-all">
          <button
            type="button"
            onClick={onOpenUpload}
            className="text-slate-400 hover:text-indigo-600 mr-2.5 transition-colors"
            title="Attach documents"
          >
            <Paperclip className="w-4 h-4 transform rotate-45" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about college policies..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? 'bg-[#1E255E] hover:bg-[#161B48] text-white shadow-md scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 transform translate-x-0.5 -translate-y-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
