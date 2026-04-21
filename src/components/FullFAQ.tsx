import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group transition-all"
      >
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {question}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FullFAQ: React.FC = () => {
  const faqData = [
    {
      question: "Який курс долара сьогодні в банках України?",
      answer: "Актуальний курс долара в українських банках постійно змінюється протягом дня. На нашому сервісі ви можете миттєво порівняти котирування ПриватБанку, Монобанку, Ощадбанку та офіційний курс НБУ."
    },
    {
      question: "Де найкращий курс євро в Україні?",
      answer: "Найвигідніший курс зазвичай пропонують комерційні банки (Монобанк, ПУМБ) або спеціалізовані відділення у великих містах. Рекомендуємо звертати увагу на різницю (спред) між купівлею та продажем."
    },
    {
      question: "Чому курс у касі банку відрізняється від курсу в додатку?",
      answer: "Банки часто встановлюють окремі курси: 'касовий' (для готівки у відділенні) та 'картковий' (для операцій у смартфоні). Картковий курс зазвичай вигідніший для оплати в інтернеті."
    },
    {
      question: "Як часто оновлюється інформація на сайті?",
      answer: "Ми оновлюємо дані кожні 15 хвилин, синхронізуючи їх безпосередньо з офіційними банківськими джерелами. Це дозволяє бачити реальні зміни котирувань у режимі Live."
    },
    {
      question: "Що таке офіційний курс НБУ?",
      answer: "Це курс, встановлений Національним банком України на поточний день. Він використовується для бухгалтерського обліку та митних платежів, але зазвичай відрізняється від комерційного курсу в банках."
    },
    {
      question: "Чи потрібен паспорт для обміну валюти?",
      answer: "Згідно з правилами НБУ, для обміну валюти на суму до 400 000 грн (в еквіваленті) документи зазвичай не потрібні. Для більших сум обов'язкова ідентифікація особи."
    }
  ];

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
          <HelpCircle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-slate-100">
            Повний FAQ — Питання та Відповіді
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
};
