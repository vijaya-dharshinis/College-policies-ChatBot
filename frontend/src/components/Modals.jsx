import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, FileText, CheckCircle, AlertCircle, Phone, Mail, Calendar, HelpCircle, Download, Settings, Key, Cpu, Eye, EyeOff, Save, RefreshCw, Check } from 'lucide-react';

export const UploadModal = ({ isOpen, onClose, onDocumentsUpdated }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/documents/');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMsg('');
    setUploading(true);
    setUploadProgress(25);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(60);
      const res = await fetch('http://127.0.0.1:8000/api/documents/', {
        method: 'POST',
        body: formData,
      });
      setUploadProgress(90);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to upload document.');
      } else {
        setUploadProgress(100);
        await fetchDocuments();
        if (onDocumentsUpdated) onDocumentsUpdated();
      }
    } catch (err) {
      setErrorMsg('Network error while uploading.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDelete = async (docId, isDefault) => {
    if (isDefault) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/documents/${docId}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchDocuments();
        if (onDocumentsUpdated) onDocumentsUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Document Management</h3>
            <p className="text-xs text-slate-400">Upload policies or documents to index into RAG vector store</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 transition-colors">
          <Upload className="w-8 h-8 text-indigo-500 mb-2" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Click to choose or drag & drop</span>
          <span className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT or Markdown (max 20MB)</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.md"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </label>

        {uploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <span>Extracting text & creating chunks...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loaded Documents in RAG</h4>
          <div className="max-h-56 overflow-y-auto space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {doc.chunk_count} Chunks &bull; {doc.page_count} Pages &bull; {doc.status.toUpperCase()}
                      {doc.is_default && ' (System Core)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold">
                    Ready
                  </span>
                  {!doc.is_default && (
                    <button
                      onClick={() => handleDelete(doc.id, doc.is_default)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1E255E] text-white text-xs font-semibold hover:bg-[#161B48] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export const CitationModal = ({ isOpen, onClose, citations }) => {
  if (!isOpen || !citations || citations.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Grounded Source Citations</h3>
            <p className="text-xs text-slate-400">Exact passages retrieved from Sri Krishna University Policy Handbook</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {citations.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-800/80 border border-indigo-100/60 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E255E] dark:text-indigo-300">
                <span>{c.section}</span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                  Page {c.page}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-serif">
                "{c.quote}"
              </p>
              <div className="text-[10px] text-slate-400">
                Document: <span className="font-semibold">{c.document}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1E255E] text-white text-xs font-semibold hover:bg-[#161B48] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const FAQModal = ({ isOpen, onClose, onSelectQuestion }) => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('http://127.0.0.1:8000/api/faqs/')
        .then(res => res.json())
        .then(data => setFaqs(data))
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Frequently Asked Policy Questions</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              onClick={() => { onSelectQuestion(f.question); onClose(); }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-800 cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  {f.category}
                </span>
                <span className="text-xs text-indigo-500 group-hover:translate-x-1 transition-transform">&rarr; Ask</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {f.question}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ContactSupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-sky-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Campus Support & Helplines</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
            <p className="font-bold text-red-700 dark:text-red-400">24/7 Anti-Ragging Helpline</p>
            <p className="text-slate-600 dark:text-slate-300">Toll Free: 0000-000-0000 | antiragging@srikrishna-university.example</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700">
            <p className="font-bold text-indigo-800 dark:text-indigo-300">Internal Complaints Committee (ICC)</p>
            <p className="text-slate-600 dark:text-slate-300">Presiding Officer, ICC | icc@srikrishna-university.example</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <p className="font-bold text-slate-800 dark:text-slate-200">Student Grievance Redressal Committee</p>
            <p className="text-slate-600 dark:text-slate-300">Dean of Student Affairs | grievance@srikrishna-university.example</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <p className="font-bold text-slate-800 dark:text-slate-200">Campus Health & Counselling Centre</p>
            <p className="text-slate-600 dark:text-slate-300">24-hr Emergency Medical Ambulance on Call</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-full bg-[#1E255E] text-white text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CalendarModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-fuchsia-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Academic Calendar Overview</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/30 border border-fuchsia-100 dark:border-fuchsia-900">
            <p className="font-bold text-fuchsia-900 dark:text-fuchsia-300">Semester Structure (NEP 2020 CBCS)</p>
            <p className="text-slate-600 dark:text-slate-400">Two semesters of at least 90 instructional working days each, plus optional summer term.</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Internal Tests (CIE):</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Periodic assessment tests conducted in months 2 &amp; 4.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Attendance Cutoff:</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Calculated 10 days before end-semester exams (75% mandatory).</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200">End-Sem Exams:</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">60% weightage theory &amp; lab exams scheduled at end of semester.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Revaluation Window:</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Open for 10 days after result announcement.</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-full bg-[#1E255E] text-white text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.2);
  const [topK, setTopK] = useState(4);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTestResult(null);
      setSaveSuccess(false);
      fetch('http://127.0.0.1:8000/api/settings/')
        .then(res => res.json())
        .then(data => {
          if (data.api_key) setApiKey(data.api_key);
          if (data.model_name) setModelName(data.model_name);
          if (data.temperature !== undefined) setTemperature(data.temperature);
          if (data.top_k !== undefined) setTopK(data.top_k);
          if (data.system_prompt) setSystemPrompt(data.system_prompt);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/test/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, model_name: modelName })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ status: 'offline', message: 'Unable to reach backend API.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/settings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          model_name: modelName,
          temperature: parseFloat(temperature),
          top_k: parseInt(topK, 10)
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Gemini Model &amp; API Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Settings saved successfully! Active for all chat sessions.</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            <span>Google Gemini API Key</span>
          </label>
          <div className="relative flex items-center">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key (AQ...)"
              className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-20 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 px-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs flex items-center gap-1"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{showKey ? "Hide" : "Show"}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Default key is configured securely on the server.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            <span>Gemini Model Family</span>
          </label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="gemini-2.5-flash">models/gemini-2.5-flash (Standard &amp; Balanced)</option>
            <option value="gemini-1.5-flash">models/gemini-1.5-flash (Fast &amp; Efficient)</option>
            <option value="gemini-1.5-pro">models/gemini-1.5-pro (Deep Reasoning)</option>
            <option value="gemini-2.0-flash">models/gemini-2.0-flash (Next-Gen Flash)</option>
            <option value="gemini-3.8-flash">models/gemini-3.8-flash (Latest Model Release)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span>Temperature: {temperature}</span>
              <span className="text-[10px] text-slate-400 font-normal">(0.0 - 1.0)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-[10px] text-slate-400">Recommended 0.2 for strict factual grounding (SRS Section 5.2).</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span>RAG Chunks (Top-K): {topK}</span>
              <span className="text-[10px] text-slate-400 font-normal">(2 - 8)</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600"
            />
            <p className="text-[10px] text-slate-400">Number of policy handbook chunks retrieved per question.</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">API Connectivity Check:</span>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? "Testing..." : "Test Connection"}</span>
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl text-xs border ${
              testResult.status === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : testResult.status === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-indigo-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-indigo-100 dark:border-slate-700'
            }`}>
              <div className="font-semibold">{testResult.message}</div>
              {testResult.code === 403 && (
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Note: The app is equipped with an integrated Grounded Policy Synthesizer that seamlessly answers all university policy questions with exact citations even when Gemini free tier billing is inactive!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowPrompt(!showPrompt)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 py-1"
          >
            <span>SRS Section 5.1 System Prompt (Active)</span>
            <span className="text-[11px] text-indigo-500">{showPrompt ? "Hide ▲" : "View ▼"}</span>
          </button>
          {showPrompt && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700">
              {systemPrompt}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1E255E] hover:bg-[#161B48] text-white text-xs font-semibold shadow transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
