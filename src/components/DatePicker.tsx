"use client";
import { useState } from "react";
import { fmtDay } from "@/lib/dates";

const isoDate = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const monthStart = (iso: string) => `${iso.slice(0, 7)}-01`;
const shiftMonth = (iso: string, offset: number) => {
  const [year, month] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return isoDate(date.getUTCFullYear(), date.getUTCMonth(), 1);
};

export function DatePicker({ value, min, max, onChange, compact = false }: { value: string; min?: string; max?: string; onChange: (date: string) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart((!min || value >= min) && (!max || value <= max) ? value : min ?? value));
  const [year, month] = visibleMonth.split("-").map(Number);
  const monthIndex = month - 1;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;
  const canPrev = !min || shiftMonth(visibleMonth, -1) >= monthStart(min);
  const canNext = !max || shiftMonth(visibleMonth, 1) <= monthStart(max);
  const inRange = Boolean(value && (!min || value >= min) && (!max || value <= max));

  return (
    <div className={compact ? "relative" : "relative w-full"}>
      <button type="button" aria-label="Вибрати дату в календарі" onClick={() => { setVisibleMonth(monthStart((!min || value >= min) && (!max || value <= max) ? value : min ?? value)); setOpen((v) => !v); }} aria-expanded={open} className={compact ? "grid size-12 shrink-0 place-items-center rounded-xl border border-black/5 bg-[#f5f5f5] text-[#171717]" : "flex w-full items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-left text-[#252525]"}>
        {!compact && <span className={inRange ? "" : "text-[#999]"}>{inRange ? fmtDay(value, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Оберіть дату в періоді"}</span>}
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
      </button>
      {open && <div className={`${compact ? "absolute right-0 top-full z-30 mt-2 w-[min(19rem,calc(100vw-3rem))]" : "mt-2 w-full"} rounded-[24px] border border-black/5 bg-white p-3 shadow-lg shadow-black/10`}>
        <div className="mb-3 flex items-center justify-between">
          <button type="button" aria-label="Попередній місяць" disabled={!canPrev} onClick={() => setVisibleMonth(shiftMonth(visibleMonth, -1))} className="grid size-9 place-items-center rounded-full bg-[#f1f1f1] text-lg disabled:opacity-30">‹</button>
          <p className="font-semibold capitalize">{new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString("uk-UA", { month: "long", year: "numeric", timeZone: "UTC" })}</p>
          <button type="button" aria-label="Наступний місяць" disabled={!canNext} onClick={() => setVisibleMonth(shiftMonth(visibleMonth, 1))} className="grid size-9 place-items-center rounded-full bg-[#f1f1f1] text-lg disabled:opacity-30">›</button>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {["пн", "вт", "ср", "чт", "пт", "сб", "нд"].map((day) => <span key={day} className="pb-1 text-[11px] font-medium uppercase text-[#999]">{day}</span>)}
          {Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = isoDate(year, monthIndex, day);
            const enabled = (!min || date >= min) && (!max || date <= max);
            const selected = date === value;
            return <button key={date} type="button" disabled={!enabled} onClick={() => { onChange(date); setOpen(false); }} className={`mx-auto grid size-9 place-items-center rounded-full text-sm transition ${selected ? "bg-[#242426] font-semibold text-white" : enabled ? "text-[#333] hover:bg-[#eeeeef]" : "text-[#ccc]"}`}>{day}</button>;
          })}
        </div>
        {min && max && <p className="mt-2 text-center text-[11px] text-[#999]">Доступно: {fmtDay(min)} – {fmtDay(max)}</p>}
      </div>}
    </div>
  );
}
