import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  RefreshCw, 
  Navigation,
  Wallet,
  Calendar,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
  Banknote
} from "lucide-react";
import { SmartCalculator } from "../components/SmartCalculator";
import { FullFAQ } from "../components/FullFAQ";
import { CurrencyCard } from "../components/CurrencyCard";
import { AdPlaceholder } from "../components/AdPlaceholder";
import { CURRENCY_MAP } from "../constants";

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

interface DashboardProps {
  data: BankRates | null;
  loading: boolean;
  error: string | null;
  fetchData: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  loading, 
  error, 
  fetchData, 
  darkMode, 
  setDarkMode 
}) => {
  const sortRates = (rates: Rate[]) => {
    const order = ["USD", "EUR", "PLN"];
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
      .filter((r: any) => ["USD", "EUR", "PLN"].includes(r.cc))
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
    <>
      <header className="flex flex-col gap-8 mb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Zap className="text-amber-500 fill-amber-500" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Система оновлення активована</span>
            </div>
            <h1 className="text-3xl font-black tracking-tightest text-indigo-700 dark:text-indigo-400 uppercase">
              Курс Долара та Євро в Банках України <span className="text-slate-400 dark:text-slate-600 font-medium text-xl ml-2 tracking-widest uppercase">Сьогодні</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Актуальний курс валют в Україні та обмін валют у реальному часі на {today}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right border-r pr-6 border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-widest mb-1">Офіційний НБУ</span>
              <span className="font-mono font-black text-slate-800 dark:text-slate-200 text-lg">
                $ {data?.nbu?.find(r => r.cc === "USD")?.rate?.toFixed(2) || "—"} / € {data?.nbu?.find(r => r.cc === "EUR")?.rate?.toFixed(2) || "—"}
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

        <SmartCalculator data={data} />
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CurrencyCard 
          bank="ПриватБанк" 
          rates={getPrivatRates()} 
          icon={Navigation} 
          accentColor="bg-emerald-600"
          className="lg:col-span-2"
          badge="Найкращий курс на сьогодні"
          bankKey="privat"
        />

        <CurrencyCard 
          bank="monobank" 
          rates={getMonoRates()} 
          icon={Wallet} 
          accentColor="bg-slate-900 dark:bg-slate-950"
          className="lg:col-span-1"
          bankKey="mono"
        />

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

        <AdPlaceholder 
          label="Google AdSense Sidebar" 
          className="lg:col-span-1 !bg-indigo-50/30 dark:!bg-indigo-900/10 !border-indigo-100 dark:!border-indigo-900/30"
        />
      </main>

      <FullFAQ />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-4">
        <div className="bg-white/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-200 mb-2 uppercase">Надійність Даних</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
            Ми отримуємо актуальний курс долара сьогодні безпосередньо з банківських API. Оновлення кожні 15 хвилин для вашої зручності.
          </p>
        </div>
        <div className="bg-white/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-indigo-400 dark:text-indigo-500" />
            <span className="text-[10px] font-black uppercase text-indigo-400 dark:text-indigo-500 tracking-widest">Оновлено</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase leading-4">
            Курс Доллара США • Курс Євро • ПриватБанк • Монобанк • Ощадбанк • ПУМБ • Райффайзен • НБУ • Обмін Валют Україна
          </p>
        </div>
      </section>
    </>
  );
};
