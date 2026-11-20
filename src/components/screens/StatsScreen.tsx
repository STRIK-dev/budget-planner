"use client";
import Link from "next/link";
import { useBudget } from "@/store/BudgetProvider";
import { byCategory, dayRows, summarize } from "@/lib/budget";
import { fmtDay } from "@/lib/dates";
import { money } from "@/lib/format";
import { BarChart } from "../BarChart";

export function StatsScreen() {
  const { data, today } = useBudget();
  const s = summarize(data, today);
  const days = dayRows(data, today);
  const n = days.length;
  const values = days.map((day) => day.spent);
  const labels = days.map((day) => fmtDay(day.date, { day: "numeric", month: "short" }));
  const cats = byCategory(data);
  const top = cats[0]?.[1] ?? 1;
  const planned = s.daily * (s.idx + 1);
  const delta = planned - s.spent;
  const icon = (c: string) => data.cats.find((x) => x.n === c)?.i ?? "✨";
  const bars: { label: string; value: number; color: string }[] = [
    { label: "План", value: planned, color: "bg-good" },
    { label: "Факт", value: s.spent, color: s.spent > planned ? "bg-bad" : "bg-brand" },
  ];

  return (
    <div className="relative z-0 -mx-5 -mt-4 min-h-[calc(100dvh-3rem)] bg-[#f1f1f1] px-4 pb-8 pt-4 text-[#252525] before:fixed before:inset-0 before:-z-10 before:bg-[#f1f1f1] before:content-['']">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Статистика</h1>
      <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm shadow-black/5">
        <p className="text-xs font-medium text-[#777]">Усього витрачено</p>
        <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">{money(s.spent)}<span className="ml-2 text-lg font-semibold text-[#888]">{data.cur}</span></p>
      </div>

      <div className="mt-3 rounded-[28px] border border-black/5 bg-white p-5 shadow-sm shadow-black/5">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-semibold">Витрати по днях</h2>
          <span className="text-xs text-[#888]">{fmtDay(data.start)} – {fmtDay(data.end)}</span>
        </div>
        <BarChart values={values} labels={labels} limit={s.daily} />
        <p className="mt-2 text-xs text-[#4b9b71]">Пунктир — денний ліміт {money(s.daily)}</p>
      </div>

      <div className="mt-3 rounded-[28px] border border-black/5 bg-white p-5 shadow-sm shadow-black/5">
        <h2 className="mb-3 font-semibold">План і факт</h2>
        {bars.map((b) => (
          <div key={b.label} className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-12 text-[#777]">{b.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eeeeef]">
              <div className={`h-full rounded-full ${b.color}`} style={{ width: `${Math.min(100, (b.value / Math.max(planned, 0.01)) * 100)}%` }} />
            </div>
            <span className="w-16 text-right tabular-nums">{money(b.value)}</span>
          </div>
        ))}
        <p className="text-sm text-[#777]">{delta >= 0 ? `Ти на ${money(delta)} ${data.cur} нижче плану.` : `Ти на ${money(-delta)} ${data.cur} вище плану.`}</p>
      </div>

      <div className="mt-3 rounded-[28px] border border-black/5 bg-white p-5 shadow-sm shadow-black/5">
        <h2 className="mb-3 font-semibold">За категоріями</h2>
        {cats.length ? cats.map(([c, v]) => (
          <div key={c} className="mb-2.5 flex items-center gap-3 text-sm">
            <span className="w-28 truncate">{icon(c)} {c}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eeeeef]"><div className="h-full rounded-full bg-[#343438]" style={{ width: `${(v / top) * 100}%` }} /></div>
            <span className="w-16 text-right tabular-nums">{money(v)}</span>
          </div>
        )) : <p className="py-3 text-center text-sm text-[#777]">Витрат ще немає.</p>}
      </div>

      <Link href="/days/" className="mt-4 flex h-13 items-center justify-center rounded-2xl bg-[#242426] font-semibold text-white">Переглянути всі дні</Link>
    </div>
  );
}
