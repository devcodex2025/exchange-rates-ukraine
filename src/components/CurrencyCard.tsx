import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BANK_LOGOS } from '../constants';

interface Rate {
  code: string;
  buy?: number;
  sale?: number;
  rate?: number;
  name?: string;
}

interface CurrencyCardProps {
  bank: string;
  rates: Rate[];
  icon: any;
  accentColor: string;
  className?: string;
  badge?: string | null;
  bankKey?: string;
}

export const CurrencyCard: React.FC<CurrencyCardProps> = ({ 
  bank, 
  rates, 
  icon: Icon, 
  accentColor, 
  className = "",
  badge = null,
  bankKey = ""
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
