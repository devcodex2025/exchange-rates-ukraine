import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRightLeft, Sparkles, RefreshCw, ChevronDown, Check } from 'lucide-react';

interface Rate {
  code: string;
  buy: number;
  sale: number;
  rate?: number;
}

interface SmartCalculatorProps {
  data: {
    privat?: any[];
    mono?: any[];
    nbu?: any[];
    raif?: any[];
    oschad?: any[];
    pumb?: any[];
  } | null;
}

export const SmartCalculator: React.FC<SmartCalculatorProps> = ({ data }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState('UAH');
  const [toCurrency, setToCurrency] = useState('USD');
  const [selectedBank, setSelectedBank] = useState('best');
  const [result, setResult] = useState<number | null>(null);
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [bestBankName, setBestBankName] = useState<string>('');

  const banks = [
    { id: 'best', name: 'Найкращий курс на сьогодні' },
    { id: 'privat', name: 'ПриватБанк' },
    { id: 'mono', name: 'monobank' },
    { id: 'oschad', name: 'Ощадбанк' },
    { id: 'pumb', name: 'ПУМБ' },
    { id: 'raif', name: 'Raiffeisen' },
    { id: 'nbu', name: 'Офіційний НБУ' },
  ];

  const calculate = () => {
    if (!data) return;

    let targetRate = 0;
    let bankName = '';

    const getSymbol = (code: string) => {
      if (code === 'UAH') return '₴';
      if (code === 'USD') return '$';
      if (code === 'EUR') return '€';
      return '';
    };

    const getRate = (bankId: string, from: string, to: string) => {
      const bankData = data[bankId as keyof typeof data];
      if (!bankData || !Array.isArray(bankData)) return null;

      const targetCurrency = from === 'UAH' ? to : from;

      if (bankId === 'nbu') {
        const rateObj = bankData.find((r: any) => r.cc === targetCurrency);
        if (rateObj) {
          return from === 'UAH' ? 1 / rateObj.rate : rateObj.rate;
        }
      } else if (bankId === 'privat') {
        const rateObj = bankData.find((r: any) => r.ccy === targetCurrency);
        if (rateObj) {
          const buy = parseFloat(rateObj.buy);
          const sale = parseFloat(rateObj.sale);
          return from === 'UAH' ? 1 / sale : buy;
        }
      } else if (bankId === 'mono') {
        const codes: { [key: string]: number } = { 'USD': 840, 'EUR': 978, 'UAH': 980 };
        const fCode = codes[from];
        const tCode = codes[to];
        const rateObj = bankData.find((r: any) => 
          (r.currencyCodeA === fCode && r.currencyCodeB === tCode) ||
          (r.currencyCodeA === tCode && r.currencyCodeB === fCode)
        );
        if (rateObj) {
          const buy = rateObj.rateBuy || rateObj.rateCross;
          const sale = rateObj.rateSell || rateObj.rateCross;
          return from === 'UAH' ? 1 / sale : buy;
        }
      } else {
        const rateObj = bankData.find((r: any) => (r.cc || r.ccy || r.code) === targetCurrency);
        if (rateObj) {
          const buy = typeof rateObj.buy === 'string' ? parseFloat(rateObj.buy) : rateObj.buy || rateObj.rate;
          const sale = typeof rateObj.sale === 'string' ? parseFloat(rateObj.sale) : rateObj.sale || rateObj.rate;
          return from === 'UAH' ? 1 / sale : buy;
        }
      }
      return null;
    };

    if (selectedBank === 'best') {
      let bestRate = fromCurrency === 'UAH' ? 0 : Infinity;
      Object.keys(data).forEach(bankId => {
        if (bankId === 'updatedAt' || bankId === 'nbu') return;
        const rate = getRate(bankId, fromCurrency, toCurrency);
        if (rate) {
          if (fromCurrency === 'UAH') {
            if (rate > bestRate) {
              bestRate = rate;
              bankName = banks.find(b => b.id === bankId)?.name || '';
            }
          } else {
            if (rate > bestRate || bestRate === Infinity) {
              bestRate = rate;
              bankName = banks.find(b => b.id === bankId)?.name || '';
            }
          }
        }
      });
      targetRate = bestRate === Infinity ? 0 : bestRate;
      setBestBankName(bankName);
    } else {
      targetRate = getRate(selectedBank, fromCurrency, toCurrency) || 0;
      setBestBankName('');
    }

    setResult(amount * targetRate);
    setCurrentRate(targetRate);
  };

  useEffect(() => {
    calculate();
  }, [amount, fromCurrency, toCurrency, selectedBank, data]);

  return (
    <section className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-10">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <ArrowRightLeft size={22} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Валютний Калькулятор</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">Multi-bank Conversion</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
            Швидкий розрахунок за курсами провідних українських банків. 
            Система автоматично підбирає найвигідніший курс продажу або купівлі валюти серед усіх доступних пропозицій на ринку.
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Порада
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Ви можете змінити банк у налаштуваннях праворуч, щоб порівняти вигоду від різних пропозицій вручну.
            </p>
          </div>
        </div>

        {/* Right: Controls & Result */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800/50">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1 tracking-widest">Сума</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-mono font-black text-xl text-slate-800 dark:text-slate-100 focus:outline-none ring-offset-0 focus:ring-2 ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1 tracking-widest">Банк</label>
              <div className="relative">
                <select 
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 ring-indigo-500/20 pr-10"
                >
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {['UAH', 'USD', 'EUR'].map(curr => (
              <button 
                key={curr}
                onClick={() => setFromCurrency(curr)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${fromCurrency === curr ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-600 hover:text-slate-100'}`}
              >
                {curr}
              </button>
            ))}
            <div className="text-slate-300 dark:text-slate-700 mx-1">
              <ArrowRightLeft size={12} />
            </div>
            {['UAH', 'USD', 'EUR'].map(curr => (
              <button 
                key={curr}
                onClick={() => setToCurrency(curr)}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${toCurrency === curr ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 dark:text-slate-600 hover:text-slate-100'}`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex flex-col mb-4 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2 rounded-xl border border-indigo-100/30 dark:border-indigo-900/10">
              <span className="text-[9px] font-black text-indigo-400 dark:text-indigo-600 uppercase tracking-widest mb-0.5">Курс розрахунку</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-sm">
                {fromCurrency === 'UAH' ? (
                  `1 ${toCurrency} = ${currentRate ? (1 / currentRate).toFixed(2) : '—'} ${fromCurrency}`
                ) : (
                  `1 ${fromCurrency} = ${currentRate ? currentRate.toFixed(2) : '—'} ${toCurrency}`
                )}
              </span>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[10px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.2em] mb-1">
                  Результат ({toCurrency})
                </span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={result}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black font-mono text-indigo-700 dark:text-indigo-400 tracking-tighter"
                  >
                    {result ? (
                      <>
                        {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-xl ml-2 opacity-60">
                          {toCurrency === 'UAH' ? '₴' : toCurrency === 'USD' ? '$' : '€'} ({toCurrency})
                        </span>
                      </>
                    ) : '—'}
                  </motion.span>
                </AnimatePresence>
              </div>
              {selectedBank === 'best' && bestBankName && (
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                    <Check size={10} /> Найкраща пропозиція
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{bestBankName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
