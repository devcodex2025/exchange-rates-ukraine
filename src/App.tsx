import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { 
  RefreshCw, 
  Info,
  ChevronDown
} from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";

interface BankRates {
  nbu: any[];
  privat: any[];
  mono: any[];
  raif: any[];
  oschad: any[];
  pumb: any[];
  updatedAt: string;
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [data, setData] = useState<BankRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rates");
      if (!res.ok) throw new Error("Помилка завантаження даних");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <ScrollToTop />
      <div className={`min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40 ${darkMode ? 'dark' : ''}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
          
          <Routes>
            <Route path="/" element={
              <Dashboard 
                data={data} 
                loading={loading} 
                error={error} 
                fetchData={fetchData} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
              />
            } />
            <Route path="/about" element={
              <About />
            } />
            <Route path="/privacy" element={
              <PrivacyPolicy />
            } />
          </Routes>

          <footer className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Політика конфіденційності</Link>
              <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Про проект</Link>
              <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Головна</Link>
            </div>
            <p>© {new Date().getFullYear()} Курс Валют Україна — Дані лише для ознайомлення. Використовуємо офіційну інформацію з веб-сайтів.</p>
          </footer>
        </div>

        {/* Global Loading Overlay */}
        <AnimatePresence>
          {loading && !data && (
            <motion.div 
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-50 dark:bg-[#020617] scale-110 blur-xl opacity-80 z-[100]"
            />
          )}
          {loading && !data && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[101] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-indigo-600/20 dark:border-indigo-400/20 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-slate-100 mb-2">Завантаження Мережі</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">Аналізуємо дані 6 банків України</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Notification */}
        {error && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[110]"
          >
            <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center">
              <Info size={14} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
            <button onClick={() => setError(null)} className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors">✕</button>
          </motion.div>
        )}
      </div>
    </Router>
  );
}



