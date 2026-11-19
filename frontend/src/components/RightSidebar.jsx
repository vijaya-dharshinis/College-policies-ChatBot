import React from 'react';
import { Download, HelpCircle, Headphones, CalendarDays, ShieldAlert, Bed, FileText, Scale, ChevronRight, Megaphone, Star } from 'lucide-react';

export default function RightSidebar({ onOpenModal, onSelectPolicy }) {
  const popularPolicies = [
    { title: 'Anti-Ragging Policy', icon: ShieldAlert, color: 'text-indigo-600', query: 'What is the anti-ragging policy at SKU?' },
    { title: 'Hostel Rules', icon: Bed, color: 'text-purple-600', query: 'What are the hostel rules and closing hours?' },
    { title: 'Exam Guidelines', icon: FileText, color: 'text-blue-600', query: 'What is the examination and evaluation policy?' },
    { title: 'Code of Conduct', icon: Scale, color: 'text-slate-700', query: 'Tell me about the student code of conduct and discipline' },
  ];

  return (
    <aside className="w-72 md:w-80 flex flex-col gap-5 select-none">
      {/* Quick Access Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-indigo-50 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-rose-500 transform -rotate-12" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Quick Access</h2>
          <span className="text-amber-400 text-sm">✨</span>
        </div>

        {/* 2x2 Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Download PDFs */}
          <button
            onClick={() => onOpenModal('download')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#EEF2FF] dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-slate-700 text-center transition-all group border border-indigo-100/40 dark:border-slate-700"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              Download<br />PDFs
            </span>
          </button>

          {/* 2. FAQs */}
          <button
            onClick={() => onOpenModal('faqs')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#F5F3FF] dark:bg-slate-800/80 hover:bg-purple-100 dark:hover:bg-slate-700 text-center transition-all group border border-purple-100/40 dark:border-slate-700"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              FAQs
            </span>
          </button>

          {/* 3. Contact Support */}
          <button
            onClick={() => onOpenModal('support')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800/80 hover:bg-blue-100 dark:hover:bg-slate-700 text-center transition-all group border border-blue-100/40 dark:border-slate-700"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              Contact<br />Support
            </span>
          </button>

          {/* 4. Academic Calendar */}
          <button
            onClick={() => onOpenModal('calendar')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#F3E8FF] dark:bg-slate-800/80 hover:bg-fuchsia-100 dark:hover:bg-slate-700 text-center transition-all group border border-fuchsia-100/40 dark:border-slate-700"
          >
            <div className="w-10 h-10 rounded-xl bg-fuchsia-600 flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              Academic<br />Calendar
            </span>
          </button>
        </div>
      </div>

      {/* Popular Policies List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-indigo-50 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 mb-3.5">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Popular Policies</h2>
        </div>

        <div className="space-y-2">
          {popularPolicies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPolicy(p.query)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50/80 dark:hover:bg-slate-700 text-left transition-all duration-150 group border border-slate-100 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {p.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
