import React from "react";
import { BookOpen, CheckCircle, HelpCircle, Lightbulb, ShieldCheck } from "lucide-react";
import { Locale } from "../constants";

interface EditorialContentProps {
  topic?: "general" | "usd" | "eur" | "pln" | "gbp" | "nbu" | "converter" | "privat" | "mono";
  locale: Locale;
}

export const EditorialContent: React.FC<EditorialContentProps> = ({ topic = "general", locale }) => {
  const isEnglish = locale === "en";

  if (topic === "usd") {
    return (
      <section className="t-reveal my-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1F1F1F] md:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-[#313131]">
          <div className="rounded-xl bg-brand-600/10 p-2.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
              {isEnglish ? "Complete Guide: How to Exchange USD in Ukraine" : "Повний гід: Як вигідно обміняти долар в Україні"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
              {isEnglish ? "Key factors, banking spreads and safety recommendations" : "Ключові фактори формування курсу, банківський спред та поради безпеки"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 text-sm leading-7 text-slate-600 dark:text-slate-300 md:grid-cols-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEnglish ? "1. What shapes the cash USD rate?" : "1. Що формує готівковий курс долара?"}
            </h3>
            <p className="mt-2">
              {isEnglish
                ? "The cash exchange rate of the US dollar in Ukraine is determined by interbank market supply and demand, NBU interventions, logistics costs of cash delivery, and commercial bank risk premiums. Unlike fixed pegs, banks adapt rates dynamically throughout the business day."
                : "Готівковий курс долара в Україні визначається балансом попиту та пропозиції на міжбанківському ринку, інтервенціями НБУ, витратами банків на логістику готівкової валюти та конкуренцією між фінансовими установами. Банки мають право змінювати котирування протягом робочого дня залежно від активності клієнтів."}
            </p>

            <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
              {isEnglish ? "2. Buy vs Sell: How to read quotes" : "2. Купівля та продаж: як не помилитися"}
            </h3>
            <p className="mt-2">
              {isEnglish
                ? "Always view rates from the bank's perspective. When you want to purchase USD, you need the 'Sell' column (what the bank sells to you). When you have USD cash to convert into hryvnia, look for the highest rate in the 'Buy' column (what the bank pays you)."
                : "Котирування завжди вказуються з точки зору банку. Якщо ви хочете купити долари — дивіться на колонку «Продаж» (банк продає валюту вам). Якщо ви здаєте готівковий долар і хочете отримати гривні — обирайте найвище число в колонці «Купівля»."}
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEnglish ? "3. How to minimize exchange losses" : "3. Як мінімізувати втрати на обміні"}
            </h3>
            <p className="mt-2">
              {isEnglish
                ? "Check the spread — the difference between the buying and selling price. Tight spreads (0.20-0.40 UAH) indicate liquid, competitive conditions. Additionally, avoid exchanging small amounts at transport hubs where commission spreads are widest."
                : "Звертайте увагу на спред — різницю між купівлею та продажем. Вузький спред (20–40 копійок) свідчить про високу ліквідність та чесні ринкові умови. На великих сумах (від $1,000) різниця в курсі навіть у 15 копійок заощаджує суттєву суму."}
            </p>

            <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/50 p-4 dark:border-brand-950/40 dark:bg-brand-950/20">
              <div className="flex items-center gap-2 font-bold text-brand-800 dark:text-brand-300">
                <Lightbulb size={18} />
                <span>{isEnglish ? "Pro tip" : "Порада від UAH.today"}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                {isEnglish
                  ? "Use the 'Best Rate Finder' above before visiting a branch. Online banking applications often offer 0.10-0.20 UAH better rates than physical counters."
                  : "Перевіряйте блок «Кращий курс» перед візитом до відділення. У мобільних застосунках банків (monobank, Приват24) безготівковий курс часто вигідніший за курс у касі."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (topic === "eur") {
    return (
      <section className="t-reveal my-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1F1F1F] md:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-[#313131]">
          <div className="rounded-xl bg-blue-600/10 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
              {isEnglish ? "EUR to UAH Exchange Guide" : "Особливості курсу євро до гривні в Україні"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
              {isEnglish ? "EUR/USD cross-rate impacts, NBU policies, and European travel prep" : "Вплив крос-курсу EUR/USD, політика НБУ та поради мандрівникам"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 text-sm leading-7 text-slate-600 dark:text-slate-300 md:grid-cols-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEnglish ? "How is EUR/UAH calculated?" : "Як розраховується курс EUR/UAH?"}
            </h3>
            <p className="mt-2">
              {isEnglish
                ? "The official and commercial rate of the Euro in Ukraine is directly derived from two components: the USD/UAH rate and the global EUR/USD cross-currency exchange rate on international Forex markets. Any movement in global markets immediately affects quotes in Kyiv."
                : "Курс євро в Україні має подвійну залежність: він базується на курсі гривні до долара та світовому крос-курсі EUR/USD на міжнародному ринку Forex. Будь-які рішення ЄЦБ або ФРС США миттєво відображаються на вартості готівкового євро в українських банках."}
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEnglish ? "Tips for purchasing Euros" : "Поради при купівлі євро"}
            </h3>
            <p className="mt-2">
              {isEnglish
                ? "Banks in Ukraine typically enforce strict physical banknote condition checks for Euros. Ensure banknotes are free from heavy stamps or tears to avoid extra commission when exchanging abroad."
                : "Українські банки ретельно перевіряють зношеність купюр євро. Перевіряйте банкноти на відсутність штампів та пошкоджень під час отримання в касі, щоб не мати труднощів під час розрахунків у країнах ЄС."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // General default content
  return (
    <section className="t-reveal my-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#313131] dark:bg-[#1F1F1F] md:p-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-[#313131]">
        <div className="rounded-xl bg-slate-950/10 p-2.5 text-slate-900 dark:bg-white/10 dark:text-white">
          <BookOpen size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
            {isEnglish ? "Currency Market Knowledge & FAQ" : "Як працює валютний ринок України: База знань"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
            {isEnglish ? "Understand how banks set rates and how you can save on exchange" : "Чому курси в банках різні та як заощаджувати на обміні"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 text-sm leading-7 text-slate-600 dark:text-slate-300 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-[#313131] dark:bg-[#0A0A0A]">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
            <CheckCircle size={18} className="text-emerald-700 dark:text-emerald-400" />
            <span>{isEnglish ? "NBU vs Commercial" : "НБУ проти банків"}</span>
          </div>
          <p className="mt-2 text-xs leading-6">
            {isEnglish
              ? "The NBU rate is a single benchmark for accounting. Commercial banks set retail buy and sell rates independently to cover costs and earn an operating spread."
              : "Курс НБУ є єдиним офіційним орієнтиром для бухгалтерії та розмитнення. Комерційні банки самостійно встановлюють курси купівлі та продажу, закладаючи власну маржу."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-[#313131] dark:bg-[#0A0A0A]">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
            <CheckCircle size={18} className="text-brand-700 dark:text-brand-400" />
            <span>{isEnglish ? "Why Spreads Differ" : "Чому спред різний"}</span>
          </div>
          <p className="mt-2 text-xs leading-6">
            {isEnglish
              ? "Large digital banks (PrivatBank, monobank) usually offer narrower spreads due to higher turnover. Smaller physical exchange desks may widen spreads during volatile hours."
              : "Великі банки з високим цифровим оборотом (ПриватБанк, monobank) зазвичай тримають менший спред. Невеликі установи розширюють спред у періоди підвищеної волатильності."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-[#313131] dark:bg-[#0A0A0A]">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
            <CheckCircle size={18} className="text-blue-600 dark:text-blue-400" />
            <span>{isEnglish ? "Data Transparency" : "Прозорість даних"}</span>
          </div>
          <p className="mt-2 text-xs leading-6">
            {isEnglish
              ? "UAH.today never fabricates rates. If a bank's feed or API is unresponsive, that institution is shown as temporarily unavailable rather than displaying misleading zeros."
              : "UAH.today не вигадує штучних значень. Якщо API або фід банку тимчасово недоступний, ми чесно позначаємо статус джерела, захищаючи користувача від неточних розрахунків."}
          </p>
        </div>
      </div>
    </section>
  );
};
