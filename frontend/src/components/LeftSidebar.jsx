import React from 'react';
import { Home, GraduationCap, Calendar, FileText, Bed, ShieldCheck } from 'lucide-react';
import { GlowingBook } from './illustrations';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, query: 'Summarize university policy overview' },
  { id: 'academic', label: 'Academic Rules', icon: GraduationCap, query: 'Tell me about academic programmes and curriculum' },
  { id: 'attendance', label: 'Attendance', icon: Calendar, query: 'Tell me about attendance policy' },
  { id: 'exam', label: 'Exam Guidelines', icon: FileText, query: 'Tell me about examination and evaluation guidelines' },
  { id: 'hostel', label: 'Hostel Rules', icon: Bed, query: 'What are the hostel rules and regulations?' },
  { id: 'anti-ragging', label: 'Anti-Ragging Policy', icon: ShieldCheck, query: 'What is the anti-ragging policy at SKU?' },
];

export default function LeftSidebar({ activeTab, setActiveTab, onSelectQuery }) {
  const handleClick = (item) => {
    setActiveTab(item.id);
    if (onSelectQuery) {
      onSelectQuery(item.query);
    }
  };

  return (
    <aside className="relative flex flex-col justify-between w-64 md:w-68 min-h-[720px] h-full bg-[#181F54] text-white rounded-3xl p-5 shadow-2xl overflow-hidden select-none border border-indigo-900/40">
      {/* Background soft wavy gradient layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />

      {/* Nav List */}
      <div className="relative z-10 space-y-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/90 to-indigo-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/10'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
              </div>
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Glowing Book & Motivational Quote */}
      <div className="relative z-10 flex flex-col items-center text-center pt-6 pb-2">
        <GlowingBook className="w-36 h-28 filter drop-shadow-[0_8px_16px_rgba(234,179,8,0.25)]" />
        <p className="mt-2 text-xs font-serif italic text-amber-200/90 tracking-wide font-light max-w-[190px]">
          &ldquo;Knowledge Today,<br />A Brighter Tomorrow&rdquo;
        </p>

        {/* Decorative Wave SVGs at the very bottom */}
        <div className="w-full h-8 mt-2 opacity-30">
          <svg viewBox="0 0 200 40" fill="none" className="w-full h-full">
            <path d="M0 25C50 10 100 35 150 20C175 12 190 28 200 25V40H0V25Z" fill="#818CF8" />
            <path d="M0 32C60 20 120 38 180 28C190 26 195 30 200 32V40H0V32Z" fill="#C084FC" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
