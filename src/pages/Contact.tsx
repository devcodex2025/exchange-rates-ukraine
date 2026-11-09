import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Clock } from "lucide-react";
import { Locale } from "../constants";

interface ContactProps {
  locale?: Locale;
}

export const Contact: React.FC<ContactProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="rounded-xl bg-cyan-600/10 p-2.5 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              {isEnglish ? "Contact & Editorial Office" : "Контакти та редакція UAH.today"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {isEnglish
                ? "Reach out for technical questions, data verification, or editorial proposals"
                : "Зв'язок із командою з технічних питань, уточнення даних або співпраці"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Contact Details */}
          <div className="flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <h2 className="text-base font-black text-slate-950 dark:text-white">
                {isEnglish ? "Direct Inquiries" : "Електронна пошта"}
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                {isEnglish
                  ? "We respond to user inquiries and bank API updates within 24 hours."
                  : "Ми розглядаємо запити користувачів та звернення представників банків протягом робочого дня."}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href="mailto:support@uah.today"
                  className="font-mono font-bold text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  support@uah.today
                </a>
                <a
                  href="mailto:editorial@uah.today"
                  className="font-mono font-bold text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  editorial@uah.today
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <MapPin size={18} className="text-cyan-700" />
                <span>{isEnglish ? "Location" : "Місцезнаходження"}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Kyiv, Ukraine (Digital Editorial Office)
              </p>

              <div className="mt-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Clock size={18} className="text-cyan-700" />
                <span>{isEnglish ? "Monitoring Hours" : "Графік моніторингу"}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isEnglish
                  ? "Automatic 24/7 rate sync. Editorial team available Monday–Friday, 09:00–18:00 (Kyiv time)."
                  : "Автоматична синхронізація курсів 24/7. Редакційна підтримка: Пн–Пт, 09:00–18:00."}
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">
                  {isEnglish ? "Message Sent" : "Повідомлення надіслано"}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {isEnglish
                    ? "Thank you for contacting us. We will get back to you shortly."
                    : "Дякуємо за звернення. Ми зв'яжемося з вами найближчим часом."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-black text-slate-950 dark:text-white">
                  {isEnglish ? "Send a Message" : "Надіслати звернення"}
                </h3>

                <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{isEnglish ? "Name" : "Ваше ім'я"}</span>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-900"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-900"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{isEnglish ? "Message / Feedback" : "Повідомлення / Відгук"}</span>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-900"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  <Send size={14} />
                  {isEnglish ? "Send Message" : "Надіслати"}
                </button>
              </form>
            )}
          </div>
        </div>
      </article>
    </main>
  );
};
