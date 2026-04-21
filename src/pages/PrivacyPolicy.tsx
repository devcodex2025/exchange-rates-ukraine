import React from 'react';
import { Shield, Lock, Eye, AlertCircle } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <Shield size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Політика Конфіденційності</h1>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={18} className="text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">1. Які дані ми збираємо</h2>
            </div>
            <p className="text-sm">
              Наш сервіс є анонімним. Ми не збираємо personal data (ім'я, email, телефон), якщо ви не надаєте їх добровільно. 
              Для покращення роботи сайту ми використовуємо анонімні технічні дані: тип браузера, мову та час відвідування.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock size={18} className="text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">2. Використання файлів Cookie</h2>
            </div>
            <p className="text-sm">
              Ми використовуємо Cookie лише для запам'ятовування ваших налаштувань, наприклад, обраної теми (темна/світла). 
              Це допомагає зробити користування сервісом зручнішим.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} className="text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">3. Сторонні сервіси</h2>
            </div>
            <p className="text-sm">
              На нашому сайті можуть відображатися рекламні блоки Google AdSense. Google може використовувати cookie для показу реклами 
              на основі ваших попередніх відвідувань цього або інших сайтів.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs italic opacity-70 uppercase tracking-widest font-black">
              Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
