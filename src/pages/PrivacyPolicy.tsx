import React from "react";
import { Cookie, Eye, Lock, Mail, Shield, ShieldCheck } from "lucide-react";
import { Locale } from "../constants";

interface PrivacyPolicyProps {
  locale?: Locale;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#2E2E2E]">
          <div className="rounded-xl bg-slate-950 p-2.5 text-white dark:bg-white dark:text-slate-950">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              {isEnglish ? "Privacy Policy" : "Політика конфіденційності"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
              {isEnglish ? "Last updated: November 9, 2026" : "Останнє оновлення: 9 листопада 2026 року"} · UAH.today
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-7 text-slate-600 dark:text-[#ADB7BE]">
          {/* Section 1: Intro */}
          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Eye size={18} className="text-brand-700" />
              {isEnglish ? "1. General Information & Scope" : "1. Загальні положення та сфера дії"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "This Privacy Policy describes how UAH.today (referred to as 'we', 'our', or 'the Platform') collects, uses, and safeguards information when you visit https://exchange-rates-ukraine.vercel.app/ and related subpages. We are committed to ensuring transparency and protecting user privacy in compliance with applicable European and Ukrainian data protection legislation."
                : "Ця Політика конфіденційності регулює порядок збору, обробки, використання та захисту інформації користувачів веб-сайту UAH.today (https://exchange-rates-ukraine.vercel.app/). Ми дотримуємося вимог Закону України «Про захист персональних даних», Загального регламенту захисту даних ЄС (GDPR) та стандартів конфіденційності цифрових видавців."}
            </p>
          </section>

          {/* Section 2: Server Logs */}
          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <ShieldCheck size={18} className="text-brand-700" />
              {isEnglish ? "2. Server Logs and Technical Information" : "2. Серверні логи та технічні дані"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "When you browse the platform, our hosting servers (Vercel) automatically record standard protocol telemetry. This may include your IP address, browser type and version, operating system, referring URL, time and date of requests, and pages visited. This information is strictly used for network security, DDoS prevention, rate-limit enforcement, and platform performance diagnostics."
                : "Під час перегляду сторінок платформи сервери автоматично фіксують технічну інформацію в системних журналах (логах): IP-адресу, тип і версію браузера, операційну систему, дату й точний час запиту, переглянуті URL. Ці дані є знеособленими та використовуються виключно для забезпечення стабільності серверної інфраструктури, діагностики збоїв та захисту від зловмисних атак (DDoS)."}
            </p>
          </section>

          {/* Section 3: Cookies & Storage */}
          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Cookie size={18} className="text-brand-700" />
              {isEnglish ? "3. Cookies and Local Browser Storage" : "3. Файли cookie та локальне сховище"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "We use browser local storage (localStorage) to store non-identifying user preferences, specifically your preferred visual theme (dark or light mode) and your cookie consent preference. Cookies are small text files stored on your terminal device that enable platform functionality and analytical assessment."
                : "Ми використовуємо локальне сховище вашого браузера (localStorage) для збереження користувацьких налаштувань: обраної теми оформлення (світла/темна) та статусу надання згоди на обробку файлів cookie. Ці параметри зберігаються безпосередньо на вашому пристрої і не передаються стороннім особам."}
            </p>
          </section>

          {/* Section 4: Google AdSense and Third-Party Advertising */}
          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Lock size={18} className="text-brand-700" />
              {isEnglish ? "4. Google AdSense & Third-Party Advertising Vendors" : "4. Google AdSense та реклама сторонніх постачальників"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "This website partners with Google and third-party advertising networks to display ads. Google, as a third-party vendor, uses cookies (including DoubleClick and personalized advertising identifiers) to serve ads based on prior visits to our site and other destinations across the Internet."
                : "Веб-сайт використовує технології показу реклами, зокрема мережу Google AdSense. Google як сторонній постачальник використовує файли cookie (включаючи файли cookie DoubleClick) для показу релевантних рекламних оголошень користувачам на основі їхніх попередніх відвідувань нашого або інших веб-ресурсів."}
            </p>
            <p className="mt-2">
              {isEnglish
                ? "Third-party vendors, including Google, may use cookies, web beacons, IP addresses, and mobile device identifiers to measure ad campaign effectiveness and serve personalized advertising. Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or through the Network Advertising Initiative opt-out portal (https://optout.networkadvertising.org)."
                : "Сторонні постачальники та рекламні мережі, включаючи Google, можуть використовувати файли cookie, веб-маяки та ідентифікатори пристроїв для вимірювання ефективності оголошень. Ви маєте право відмовитися від персоналізованої реклами в налаштуваннях облікового запису Google (https://adssettings.google.com) або скориставшись сервісом www.aboutads.info."}
            </p>
          </section>

          {/* Section 5: User Rights */}
          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Shield size={18} className="text-brand-700" />
              {isEnglish ? "5. Your Rights as a Data Subject" : "5. Права користувачів"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "Under applicable privacy regulations (such as GDPR), you have the right to access, rectify, or request deletion of any personal data we might hold, as well as the right to restrict or object to certain processing activities. Since UAH.today does not mandate account registration, we do not store names, phone numbers, or passwords."
                : "Відповідно до законодавства, ви маєте право на доступ до інформації, що вас стосується, її виправлення або видалення, а також право відкликати раніше надану згоду на використання cookie. Оскільки UAH.today не вимагає реєстрації та введення персональних даних, ми не збираємо та не зберігаємо ваші ПІБ, паролі чи номери телефонів."}
            </p>
          </section>

          {/* Section 6: Contacts */}
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2E2E2E] dark:bg-[#121212]">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Mail size={18} className="text-brand-700" />
              {isEnglish ? "6. Privacy Inquiries and Contact" : "6. Контактна інформація з питань конфіденційності"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "If you have questions regarding this Privacy Policy or wish to exercise your data protection rights, please contact our privacy representative at: privacy@uah.today or visit our Contact page."
                : "Якщо у вас виникли запитання щодо цієї Політики конфіденційності або ви бажаєте надіслати запит щодо обробки даних, звертайтеся на електронну пошту: privacy@uah.today або через сторінку контактів."}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
};
