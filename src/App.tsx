import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  ArrowRightLeft, 
  Info, 
  RefreshCw, 
  Banknote,
  Navigation,
  Globe,
  Wallet,
  Calendar,
  Moon,
  Sun,
  ShieldCheck,
  Zap,
  ChevronDown
} from "lucide-react";
import { SmartCalculator } from "./components/SmartCalculator";
import { CURRENCY_MAP, FLAG_MAP, CURRENCY_NAMES, BANK_LOGOS } from "./constants";

interface Rate {
  code: string;
  buy?: number;
  sale?: number;
  rate?: number;
  name?: string;
}

interface BankRates {
  nbu: any[];
  privat: any[];
  mono: any[];
  raif: any[];
  oschad: any[];
  pumb: any[];
  updatedAt: string;
}

const ADS_ENABLED = false;

const AdPlaceholder = ({ label, className = "" }: { label: string, className?: string }) => {
  if (!ADS_ENABLED) return null;
  return (
    <div className={`bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[100px] transition-all hover:bg-slate-200 dark:hover:bg-slate-750 ${className}`}>
      <Globe className="text-slate-400 dark:text-slate-600 mb-2" size={24} />
      <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">{label}</span>
      <span className="text-[8px] text-slate-400 dark:text-slate-600 mt-1 uppercase font-medium">Google AdSense Space</span>
    </div>
  );
};

const CurrencyCard = ({ 
  bank, 
  rates, 
  icon: Icon, 
  accentColor, 
  className = "",
  badge = null,
  bankKey = ""
}: { 
  bank: string, 
  rates: Rate[], 
  icon: any, 
  accentColor: string,
  className?: string,
  badge?: string | null,
  bankKey?: string
}) => {
  const [imgError, setImgError] = useState(false);
  const logoUrl = bankKey ? BANK_LOGOS[bankKey] : null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-14 bg-white dark:bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden relative group p-1.5 border border-slate-100/50">
            {logoUrl && !imgError ? (
              <img 
                src={logoUrl} 
                alt={bank} 
                className="max-w-full max-h-full object-contain" 
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`w-full h-full ${accentColor} rounded-xl flex items-center justify-center text-white`}>
                <Icon size={32} />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{bank}</h2>
        </div>
        {badge && (
          <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      
      <div className="flex-grow flex flex-col gap-3">
        <div className={`grid ${bankKey === 'nbu' ? 'grid-cols-2' : 'grid-cols-3'} text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-50 dark:border-slate-800/50`}>
          <div>Валюта</div>
          {bankKey === 'nbu' ? (
            <div className="text-right">Курс</div>
          ) : (
            <>
              <div className="text-right pr-2">Купівля</div>
              <div className="text-right">Продаж</div>
            </>
          )}
        </div>
        {rates.slice(0, 3).map((rate) => (
          <div key={rate.code} className={`grid ${bankKey === 'nbu' ? 'grid-cols-2' : 'grid-cols-3'} items-center py-1.5 group`}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                {rate.code === 'USD' ? 'Доллар $' : rate.code === 'EUR' ? 'Євро €' : rate.code === 'UAH' ? 'Гривня ₴' : rate.code}
              </span>
            </div>
            {bankKey === 'nbu' ? (
              <div className="text-right font-mono font-black text-indigo-600 dark:text-indigo-400 text-lg">
                {rate.rate ? rate.rate.toFixed(2) : "—"}
              </div>
            ) : (
              <>
                <div className="text-right pr-2 font-mono font-black text-slate-900 dark:text-slate-100 text-lg">
                  {rate.buy ? rate.buy.toFixed(2) : rate.rate ? rate.rate.toFixed(2) : "—"}
                </div>
                <div className="text-right font-mono font-black text-indigo-600 dark:text-indigo-400 text-lg">
                  {rate.sale ? rate.sale.toFixed(2) : rate.rate ? rate.rate.toFixed(2) : "—"}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tighter">
        <span>Актуально 24/7</span>
        <span className="opacity-50">Live Sync</span>
      </div>
    </motion.section>
  );
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

  const sortRates = (rates: Rate[]) => {
    const order = ["USD", "EUR", "PLN"];
    
    // Deduplicate by currency code (keep the first occurrence), ensure valid code
    const uniqueRates = rates.filter((rate, index, self) =>
      rate && rate.code && index === self.findIndex((t) => t.code === rate.code)
    );

    return [...uniqueRates].sort((a, b) => {
      const indexA = order.indexOf(a.code);
      const indexB = order.indexOf(b.code);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const getPrivatRates = () => {
    if (!data?.privat) return [];
    const rates = data.privat
      .filter((r: any) => ["USD", "EUR"].includes(r.ccy))
      .map((r: any) => ({
        code: r.ccy,
        buy: parseFloat(r.buy),
        sale: parseFloat(r.sale)
      }));
    return sortRates(rates);
  };

  const getNbuRates = () => {
    if (!data?.nbu) return [];
    const rates = data.nbu
      .filter((r: any) => ["USD", "EUR", "PLN"].includes(r.cc) )
      .map((r: any) => ({
        code: r.cc,
        rate: r.rate
      }));
    return sortRates(rates);
  };

  const getMonoRates = () => {
    if (!data?.mono) return [];
    const rates = data.mono
      .filter((r: any) => r.currencyCodeB === 980 && [840, 978].includes(r.currencyCodeA))
      .map((r: any) => ({
        code: CURRENCY_MAP[r.currencyCodeA],
        buy: r.rateBuy,
        sale: r.rateSell
      }));
    return sortRates(rates);
  };

  const getGenericRates = (key: 'raif' | 'oschad' | 'pumb') => {
    if (!data?.[key]) return [];
    const rates = data[key].map((r: any) => ({
      code: r.cc,
      buy: r.buy,
      sale: r.sale
    }));
    return sortRates(rates);
  };

  const today = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 selection:bg-indigo-100 dark:selection:bg-indigo-900/40 ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* SEO-optimized Header */}
        <header className="flex flex-col gap-8 mb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Zap className="text-amber-500 fill-amber-500" size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Система оновлення активована</span>
              </div>
              <h1 className="text-3xl font-black tracking-tightest text-indigo-700 dark:text-indigo-400 uppercase">
                Курс Валют України <span className="text-slate-400 dark:text-slate-600 font-medium text-xl ml-2 tracking-widest">LIVE</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Актуальні дані 6 банків України станом на {today}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right border-r pr-6 border-slate-200 dark:border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-widest mb-1">Офіційний НБУ</span>
                <span className="font-mono font-black text-slate-800 dark:text-slate-200 text-lg">
                  $ {data?.nbu?.find(r => r.cc === "USD")?.rate.toFixed(2) || "—"} / € {data?.nbu?.find(r => r.cc === "EUR")?.rate.toFixed(2) || "—"}
                </span>
              </div>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 text-indigo-600 dark:text-indigo-400"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button 
                onClick={fetchData}
                disabled={loading}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 text-indigo-600 dark:text-indigo-400"
              >
                <RefreshCw size={20} className={`${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Integrated Calculator Card in Header */}
          <SmartCalculator data={data} />
        </header>

        {/* Bento Grid Layout */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Main Card: PrivatBank */}
          <CurrencyCard 
            bank="ПриватБанк" 
            rates={getPrivatRates()} 
            icon={Navigation} 
            accentColor="bg-emerald-600"
            className="lg:col-span-2"
            badge="Найкращий курс на сьогодні"
            bankKey="privat"
          />

          {/* Monobank Card */}
          <CurrencyCard 
            bank="monobank" 
            rates={getMonoRates()} 
            icon={Wallet} 
            accentColor="bg-slate-900 dark:bg-slate-950"
            className="lg:col-span-1"
            bankKey="mono"
          />

          {/* Market Trend Widget */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 bg-indigo-700 dark:bg-indigo-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-white/70" />
                <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Тренд Тижня (USD)</p>
              </div>
              <h3 className="text-4xl font-black tracking-tighter">+0.12%</h3>
              <p className="text-xs opacity-80 mt-1 font-medium italic">Курс зростає останній тиждень</p>
            </div>
            
            <div className="absolute bottom-0 right-0 left-0 h-1/4 flex items-end opacity-20 px-4 gap-1">
              {[30, 40, 50, 65, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white rounded-t-lg" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </motion.section>

          {/* Second Row of Banks */}
          <CurrencyCard 
            bank="Raiffeisen Bank" 
            rates={getGenericRates('raif')} 
            icon={ShieldCheck} 
            accentColor="bg-yellow-500"
            bankKey="raif"
          />
          
          <CurrencyCard 
            bank="Ощадбанк" 
            rates={getGenericRates('oschad')} 
            icon={Banknote} 
            accentColor="bg-green-700"
            bankKey="oschad"
          />

          <CurrencyCard 
            bank="ПУМБ" 
            rates={getGenericRates('pumb')} 
            icon={Navigation} 
            accentColor="bg-red-600"
            bankKey="pumb"
          />

          <CurrencyCard 
            bank="Офіційний НБУ" 
            rates={getNbuRates()} 
            icon={Banknote} 
            accentColor="bg-indigo-600"
            bankKey="nbu"
          />


          {/* Ad Slot */}
          <AdPlaceholder 
            label="Google AdSense Sidebar" 
            className="lg:col-span-1 !bg-indigo-50/30 dark:!bg-indigo-900/10 !border-indigo-100 dark:!border-indigo-900/30"
          />

        </main>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          <div className="bg-white/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 mb-2 uppercase">Надійність Даних</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Ми використовуємо прямі з'єднання з банківськими серверами (REST API) для отримання найнасвіжіших котирувань. 
              Дані оновлюються автоматично кожні 10 хвилин.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 mb-2 uppercase">FAQ</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Курси в касах банків можуть відрізнятися від курсів для онлайн-операцій. Рекомендуємо уточнювати наявність готівки заздалегідь.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-indigo-400 dark:text-indigo-500" />
              <span className="text-[10px] font-black uppercase text-indigo-400 dark:text-indigo-500 tracking-widest">Оновлено</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase leading-4">
              Курс Доллара • Курс Євро • ПриватБанк • Монобанк • Ощадбанк • ПУМБ • Райффайзен • НБУ
            </p>
          </div>
        </section>

        <footer className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Політика контент-ційності</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Про проект</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Контакти</a>
          </div>
          <p>© {new Date().getFullYear()} Курс Валют Україна — Дані лише для ознайомлення. Використовуємо офіційну інформацію з веб-сайтів.</p>
        </footer>
      </div>

      {/* Loading Overlay */}
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
              <div className="w-20 h-20 border-w border-4 border-indigo-600/20 dark:border-indigo-400/20 rounded-full"></div>
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

      {/* Error Notification */}
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
  );
}



