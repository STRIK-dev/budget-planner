"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { dayRows, summarize } from "@/lib/budget";
import { fmtDay } from "@/lib/dates";
import { money } from "@/lib/format";

// Увесь період: минулі дні (факт), сьогодні, майбутні (прогноз)
export function DaysScreen() {
  const { data, today } = useBudget();
  const { openSheet } = useUi();
  const rows = dayRows(data, today);
  const { daily } = summarize(data, today);

  useEffect(() => {
    document.getElementById("today")?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="relative z-0 -mx-5 -mt-4 min-h-[calc(100dvh-3rem)] bg-[#f1f1f1] px-4 pb-8 pt-4 text-[#252525] before:fixed before:inset-0 before:-z-10 before:bg-[#f1f1f1] before:content-['']">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#666]">‹ <span>Головна</span></Link>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">По днях</h1>
          <p className="mt-1 text-xs text-[#888]">Натисни на день, щоб побачити деталі</p>
        </div>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#555] shadow-sm">{money(daily)} {data.cur} / день</span>
      </div>
      <div className="space-y-2">
        {rows.map((r) => {
          const isToday = r.date === today;
          const future = r.date > today;
          const spentPct = r.available > 0 ? Math.min(100, (r.spent / r.available) * 100) : r.spent > 0 ? 100 : 0;
          return (
            <button
              key={r.date}
              id={isToday ? "today" : undefined}
              onClick={() => openSheet({ type: "day", date: r.date })}
              className={`w-full rounded-[24px] border px-4 py-3.5 text-left shadow-sm shadow-black/5 transition active:scale-[.99] ${isToday ? "border-[#242426] bg-[#242426] text-white" : "border-black/5 bg-white text-[#252525]"} ${future ? "opacity-65" : ""}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span>
                  <b className="block font-semibold">{fmtDay(r.date, { weekday: "short", day: "numeric", month: "short" })}{isToday && <span className="ml-1.5 text-[10px] uppercase tracking-wide text-[#c5c5c5]">Сьогодні</span>}</b>
                  <span className={`mt-0.5 block text-xs ${isToday ? "text-white/55" : "text-[#888]"}`}>
                    Витрачено {money(r.spent)} з {money(r.available)}
                  </span>
                </span>
                <span className="text-right">
                  <b className={`block tabular-nums ${r.balance < 0 ? "text-[#d76b6b]" : isToday ? "text-[#8be0ad]" : "text-[#478b62]"}`}>{r.balance >= 0 ? "+" : ""}{money(r.balance)}</b>
                  <span className={`text-[11px] ${isToday ? "text-white/45" : "text-[#999]"}`}>{future ? "прогноз" : "залишок"}</span>
                </span>
              </span>
              <span className={`mt-3 block h-1.5 overflow-hidden rounded-full ${isToday ? "bg-white/10" : "bg-[#ededee]"}`}><span className={`block h-full rounded-full ${r.spent > r.available ? "bg-[#e57373]" : isToday ? "bg-[#8be0ad]" : "bg-[#4b9b71]"}`} style={{ width: `${spentPct}%` }} /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
