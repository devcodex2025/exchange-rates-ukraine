import React from 'react';
import { Info, Target, Zap, Server } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-100 dark:shadow-none">
            <Info size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Про Проект</h1>
        </div>

        <div className="space-y-10 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          <p className="text-lg text-slate-700 dark:text-slate-300">
            <strong className="text-indigo-600 dark:text-indigo-400">Курс Валют Україна</strong> — це сучасний незалежний сервіс для моніторингу банківських курсів валют у реальному часі. 
            Ми створили цей інструмент, щоб ви могли за секунди знайти найвигідніший курс без необхідності переглядати сайти десятки банків.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Target size={24} className="text-indigo-500 mb-3" />
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-2">Наша Місія</h3>
              <p className="text-xs leading-5">Забезпечити прозорість валютного ринку України та надати користувачам найзручніший інструмент для фінансових розрахунків.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Server size={24} className="text-emerald-500 mb-3" />
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-2">Технології</h3>
              <p className="text-xs leading-5">Ми використовуємо пряму інтеграцію з API банків (NBU, PrivatBank, Monobank) для гарантії 100% точності даних.</p>
            </div>
          </div>

          <div className="bg-indigo-600 dark:bg-indigo-900/50 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={24} className="text-amber-400" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Чому обирають нас?</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm opacity-90 font-bold">
              <li>Оновлення кожні 15 хвилин</li>
              <li>Розумний калькулятор найкращого курсу</li>
              <li>Темна тема для комфортного перегляду вночі</li>
              <li>Відсутність зайвої реклами та реєстрацій</li>
            </ul>
          </div>

          <p className="text-sm text-center italic opacity-60">
            Дякуємо, що користуєтесь нашим сервісом. Разом ми робимо фінанси простішими.
          </p>
        </div>
      </div>
    </div>
  );
};
