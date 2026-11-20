"use client";
import Link from "next/link";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { summarize } from "@/lib/budget";
import { allTransactions } from "@/lib/transactions";
import { fmtDay } from "@/lib/dates";
import { money } from "@/lib/format";
import { TransactionRow } from "../TransactionRow";

export function HomeScreen() {
  const { data, today } = useBudget();
  const { openSheet } = useUi();
  const s = summarize(data, today);
  const dailyStatus = !s.inPeriod
    ? today < data.start ? "Період бюджету ще не почався" : "Період бюджету завершився"
    : s.remaining < 0
      ? `Ти сьогодні в мінусі на: −${money(-s.remaining)} ${data.cur}`
      : `Можна витратити сьогодні: ${money(s.remaining)} ${data.cur}`;
  const dailyCardValue = s.inPeriod ? s.remaining : 0;
  const h = new Date().getHours();
  const hello = h < 12 ? "Доброго ранку" : h < 18 ? "Доброго дня" : "Доброго вечора";
  const prompts = [
    "Я сьогодні купив СУШИ. ЦЕ БОМБА! :)",
    "Що плануєш купити сьогодні?",
    "Яка покупка сьогодні найважливіша?",
    "Що сьогодні буде в кошику?",
    "Купуй і не жалкуй...",
    "Порадуй свого друга Іллю — купи йому мочу.",
    "А я сьогодні купив СУШІІІ, ЦЕ БОМБА!",
    "Що сьогодні хочеться придбати?",
    "На що сьогодні спрямуємо бюджет?",
    "Яку покупку давно відкладав?",

  ];
  const dayNumber = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86_400_000);
  const dailyPrompt = prompts[((dayNumber % prompts.length) + prompts.length) % prompts.length];
  const recent = allTransactions(data).slice(0, 5);
  return (
    <div className="relative z-0 -mx-5 -mt-4 min-h-[calc(100dvh-3rem)] bg-[#f1f1f1] px-4 pb-8 pt-4 text-[#252525] before:fixed before:inset-0 before:-z-10 before:bg-[#f1f1f1] before:content-['']">
      <section className="rounded-[38px] bg-[#242426] px-5 pb-6 pt-5 text-white shadow-xl shadow-black/15">
        <header className="flex items-center gap-3.5">
          <div className="relative grid size-12 shrink-0 place-items-center rounded-full border border-white/10 bg-[#3b3b3e] text-white shadow-inner shadow-white/5">
            {data.name.trim() ? <span className="text-lg font-semibold">{data.name.trim()[0].toUpperCase()}</span> : <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18M7 6V4h10v2" /><path d="M16 15h2" /></svg>}
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#242426] bg-[#8be0ad]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold tracking-tight">{hello}{data.name && `, ${data.name}`}!</p>
            <p className="mt-0.5 truncate text-xs font-medium text-white/75">{dailyPrompt}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
              <span className="truncate">{fmtDay(data.start)} – {fmtDay(data.end)}</span>
            </p>
          </div>
        </header>

        <div className="pb-1 pt-8 text-center">
          <p className="text-sm font-medium text-white/45">Залишок бюджету</p>
          <p className={`mt-1 text-5xl font-bold tracking-tight tabular-nums ${s.remainingTotal < 0 ? "text-bad" : ""}`}>{money(s.remainingTotal)} <span className="text-2xl text-white/45">{data.cur}</span></p>
          <p className={`mt-1 text-xs ${s.inPeriod && s.remaining < 0 ? "text-[#f08a8a]" : "text-white/45"}`}>{dailyStatus}</p>
        </div>

        <div className="my-6 flex justify-center gap-8">
          <button onClick={() => openSheet({ type: "expense" })} className="flex w-14 flex-col items-center gap-2 text-xs text-white/75"><span className="grid size-14 place-items-center rounded-full bg-[#38383b] text-3xl font-light">＋</span>Витрата</button>
          <button onClick={() => openSheet({ type: "topup" })} className="flex w-14 flex-col items-center gap-2 text-xs text-white/75"><span className="grid size-14 place-items-center rounded-full bg-white text-2xl text-[#242426]">↗</span>Бюджет</button>
          <Link href="/days/" className="flex w-14 flex-col items-center gap-2 text-xs text-white/75"><span className="grid size-14 place-items-center rounded-full bg-[#38383b] text-2xl">···</span>По днях</Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[26px] bg-[#303033] p-4">
            <p className="text-xs text-white/55">Доступно на сьогодні</p>
            <p className={`mt-6 truncate text-xl font-semibold tabular-nums ${dailyCardValue < 0 ? "text-[#f08a8a]" : ""}`}>{dailyCardValue < 0 ? "−" : ""}{money(Math.abs(dailyCardValue))} <span className="text-sm text-white/50">{data.cur}</span></p>
          </div>
          <div className="rounded-[26px] bg-[#303033] p-4">
            <p className="text-xs text-white/55">Витрачено</p>
            <p className="mt-6 truncate text-xl font-semibold tabular-nums">{money(s.spent)} <span className="text-sm text-white/50">{data.cur}</span></p>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold">Історія витрат</h2>
          <Link href="/history/" className="text-sm font-semibold text-[#252525]">Усі</Link>
        </div>
        <div>
          {recent.length ? recent.map((t) => <TransactionRow key={t.kind + t.id} tx={t} variant="light" />) : <p className="py-6 text-center text-sm text-[#777]">Поки що порожньо. Додай першу витрату.</p>}
        </div>
      </section>
    </div>
  );
}
