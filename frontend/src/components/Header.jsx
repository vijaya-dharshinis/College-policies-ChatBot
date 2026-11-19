import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, X, ChevronRight, BookOpen, Settings } from 'lucide-react';
import { SkuCrest, CampusHeaderArt } from './illustrations';

export default function Header({ onSelectPolicy, darkMode, setDarkMode, onOpenSettings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/search/?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item) => {
    setShowResults(false);
    setSearchQuery('');
    if (onSelectPolicy) {
      onSelectPolicy(`Tell me about ${item.section}`);
    }
  };

  return (
    <header className="relative w-full bg-white dark:bg-slate-900 shadow-sm border-b border-indigo-50 dark:border-slate-800 px-6 py-3 transition-colors duration-200">
      {/* Background Campus Art Layer in right half */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 hidden md:block">
        <CampusHeaderArt className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-[1520px] mx-auto flex items-center justify-between gap-4">
        {/* Left: University Crest & Name */}
        <div className="flex items-center gap-3.5 flex-shrink-0 cursor-pointer" onClick={() => onSelectPolicy && onSelectPolicy("Tell me about university overview")}>
          <SkuCrest className="w-11 h-11 filter drop-shadow-sm" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-[#1E255E] dark:text-white tracking-tight leading-tight">
              Sri Krishna University
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider">
              Learn &bull; Grow &bull; Excel
            </p>
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete Dropdown */}
        <div className="relative flex-1 max-w-xl mx-2 md:mx-6" ref={searchRef}>
          <div className="relative flex items-center bg-[#F3F4FB] dark:bg-slate-800/90 rounded-full px-4 py-2.5 shadow-inner border border-indigo-100/60 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-indigo-400/40 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
            <Search className="w-4 h-4 text-indigo-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
              placeholder="Search for policies, rules or any information..."
              className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-indigo-100 dark:border-slate-700 py-2 z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="px-4 py-3 text-xs text-slate-400">Searching SKU Policy Handbook...</div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                    Matching Policies
                  </div>
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50/80 dark:hover:bg-slate-700/60 flex items-start gap-2.5 transition-colors group"
                    >
                      <BookOpen className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {item.section}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.snippet}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 mt-1" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                  No policy found matching "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Settings, Notifications & Dark Mode Toggle */}
        <div className="flex items-center gap-2.5 flex-shrink-0 relative">
          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
            title="Gemini Model & API Settings"
          >
            <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {/* Notifications Popup */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-700 p-4 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Campus Circulars</h3>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">3 New</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2 rounded-xl bg-indigo-50/60 dark:bg-slate-700/50 hover:bg-indigo-50 cursor-pointer" onClick={() => onSelectPolicy("Tell me about attendance policy")}>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">End-Sem Attendance Notice</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">75% mandatory attendance cutoff is active.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-indigo-50 cursor-pointer" onClick={() => onSelectPolicy("What is the anti-ragging policy?")}>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Anti-Ragging Squad Patrols</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">24/7 campus helpline active: 0000-000-0000.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-indigo-50 cursor-pointer" onClick={() => onSelectPolicy("Tell me about examination evaluation")}>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Continuous Assessment (40%)</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Internal test scores published on student portal.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1E255E]" />}
          </button>
        </div>
      </div>
    </header>
  );
}
