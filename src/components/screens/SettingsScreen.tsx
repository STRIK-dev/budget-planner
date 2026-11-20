"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { summarize } from "@/lib/budget";
import { CURRENCIES } from "@/lib/config";
import { money, parseAmount } from "@/lib/format";
import { ConfirmDialog } from "../ConfirmDialog";
import { DatePicker } from "../DatePicker";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-center justify-between gap-3 border-b border-black/5 py-3 last:border-0"><span>{label}</span>{children}</div>;
}
const Title = ({ children }: { children: ReactNode }) => <h2 className="mb-2 mt-6 font-semibold tracking-tight text-[#555]">{children}</h2>;
const CATEGORY_ICONS = ["🏷️", "🍽️", "🚌", "🎬", "🛍️", "🏠", "💊", "📚", "☕", "🐾", "💼", "✈️", "🎁", "💪", "🎮", "🔹"];
const toDateText = (iso: string) => { const [year, month, day] = iso.split("-"); return `${day}.${month}.${year}`; };
const formatDateText = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length <= 2 ? digits : digits.length <= 4 ? `${digits.slice(0, 2)}.${digits.slice(2)}` : `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
};
const parseDateText = (value: string) => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return "";
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day) ? `${year}-${month}-${day}` : "";
};

export function SettingsScreen() {
  const { data, today, patch, reset } = useBudget();
  const { openSheet, toast } = useUi();
  const [newCat, setNewCat] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🏷️");
  const [dateText, setDateText] = useState({ start: toDateText(data.start), end: toDateText(data.end) });
  const [confirmAction, setConfirmAction] = useState<null | { kind: "category"; index: number } | { kind: "reset" }>(null);
  const budgetSummary = summarize(data, today);

  useEffect(() => setDateText({ start: toDateText(data.start), end: toDateText(data.end) }), [data.start, data.end]);

  const setDate = (k: "start" | "end", v: string) => {
    if (!v) return;
    const a = k === "start" ? v : data.start;
    const b = k === "end" ? v : data.end;
    if (a > b) return toast("Кінець має бути після початку");
    patch(k === "start" ? { start: v } : { end: v });
  };
  const commitDate = (k: "start" | "end") => {
    const value = parseDateText(dateText[k]);
    if (!value) {
      toast("Введіть дату у форматі ДД.ММ.РРРР");
      setDateText((dates) => ({ ...dates, [k]: toDateText(data[k]) }));
      return;
    }
    if ((k === "start" && value > data.end) || (k === "end" && value < data.start)) {
      toast("Кінець має бути після початку");
      setDateText((dates) => ({ ...dates, [k]: toDateText(data[k]) }));
      return;
    }
    setDate(k, value);
  };
  const addCat = () => {
    const v = newCat.trim();
    if (!v) return;
    patch({ cats: [...data.cats, { n: v, i: newCatIcon }] });
    setNewCat("");
    setNewCatIcon("🏷️");
  };

  return (
    <div className="relative z-0 -mx-5 -mt-4 min-h-[calc(100dvh-3rem)] bg-[#f1f1f1] px-4 pb-8 pt-4 text-[#252525] before:fixed before:inset-0 before:-z-10 before:bg-[#f1f1f1] before:content-['']">
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Налаштування</h1>
      <div className="rounded-[26px] border border-black/5 bg-white px-4 shadow-sm shadow-black/5">
        <Row label="Ім’я"><input className="w-40! rounded-xl border border-black/5 bg-[#f5f5f5] px-3 py-2.5! text-right text-[#252525] outline-none focus:border-black/20" value={data.name} onChange={(e) => patch({ name: e.target.value })} /></Row>
        <Row label="Валюта">
          <select className="w-28! rounded-xl border border-black/5 bg-[#f5f5f5] px-3 py-2.5! text-[#252525] outline-none focus:border-black/20" value={data.cur} onChange={(e) => patch({ cur: e.target.value })}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Row>
      </div>

      <Title>Період бюджету</Title>
      <div className="rounded-[26px] border border-black/5 bg-white p-4 shadow-sm shadow-black/5">
        <label className="block text-xs font-medium text-[#888]">Загальний бюджет</label>
        <div className="mt-1 flex items-center gap-3 border-b border-black/5 pb-4">
          <input key={data.total} className="min-w-0 flex-1 bg-transparent py-1 text-3xl font-bold tracking-tight text-[#252525] outline-none" inputMode="decimal" defaultValue={data.total}
            onBlur={(e) => { const v = parseAmount(e.target.value); if (v >= 0) patch({ total: v }); }} />
          <span className="rounded-full bg-[#f1f1f1] px-3 py-1.5 text-sm font-semibold text-[#666]">{data.cur}</span>
        </div>
        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#777]">Початок періоду</span>
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" maxLength={10} placeholder="ДД.ММ.РРРР" className="min-w-0 flex-1 rounded-2xl border border-black/5 bg-[#f5f5f5] px-4 py-3 text-base text-[#252525] outline-none placeholder:text-[#999] focus:border-black/20" value={dateText.start} onChange={(e) => setDateText((dates) => ({ ...dates, start: formatDateText(e.target.value) }))} onBlur={() => commitDate("start")} />
              <DatePicker compact value={data.start} max={data.end} onChange={(value) => { setDate("start", value); setDateText((dates) => ({ ...dates, start: toDateText(value) })); }} />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#777]">Кінець періоду</span>
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" maxLength={10} placeholder="ДД.ММ.РРРР" className="min-w-0 flex-1 rounded-2xl border border-black/5 bg-[#f5f5f5] px-4 py-3 text-base text-[#252525] outline-none placeholder:text-[#999] focus:border-black/20" value={dateText.end} onChange={(e) => setDateText((dates) => ({ ...dates, end: formatDateText(e.target.value) }))} onBlur={() => commitDate("end")} />
              <DatePicker compact value={data.end} min={data.start} onChange={(value) => { setDate("end", value); setDateText((dates) => ({ ...dates, end: toDateText(value) })); }} />
            </div>
          </label>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f1f1f1] px-4 py-3">
          <div><p className="text-xs text-[#777]">Денний ліміт</p><p className="mt-0.5 text-lg font-bold tabular-nums">{money(budgetSummary.daily)} <span className="text-xs font-semibold text-[#777]">{data.cur}</span></p></div>
          <p className="text-right text-xs text-[#888]">з урахуванням<br />поповнень</p>
        </div>
      </div>

      <Title>Категорії</Title>
      <div className="rounded-[26px] border border-black/5 bg-white px-4 shadow-sm shadow-black/5">
        {data.cats.map((c, i) => (
          <Row key={c.n} label={`${c.i} ${c.n}`}>
            <button className="text-bad" onClick={() => setConfirmAction({ kind: "category", index: i })}>Видалити</button>
          </Row>
        ))}
        <div className="py-3">
          <div className="flex items-center gap-2">
            <input className="min-w-0 flex-1 rounded-xl border border-black/5 bg-[#f5f5f5] px-3 py-2.5 text-[#252525] outline-none placeholder:text-[#999] focus:border-black/20" placeholder="Нова категорія" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
            <button className="shrink-0 rounded-full bg-[#242426] px-4 py-2.5 text-sm font-semibold text-white" onClick={addCat}>Додати</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Оберіть іконку категорії">
            {CATEGORY_ICONS.map((icon) => <button key={icon} type="button" aria-label={`Іконка ${icon}`} aria-pressed={newCatIcon === icon} onClick={() => setNewCatIcon(icon)} className={`grid size-9 place-items-center rounded-full border text-lg transition ${newCatIcon === icon ? "border-[#242426] bg-[#242426]" : "border-black/5 bg-[#f5f5f5]"}`}>{icon}</button>)}
          </div>
        </div>
      </div>

      <Title>Резервна копія</Title>
      <div className="rounded-[26px] border border-black/5 bg-white p-4 shadow-sm shadow-black/5">
        <p className="mb-3 text-sm text-[#777]">Дані зберігаються лише на цьому пристрої. Іноді робити копію — гарна звичка.</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button className="h-12 rounded-2xl bg-[#eeeeef] font-semibold text-[#333]" onClick={() => openSheet({ type: "backup" })}>Зберегти</button>
          <button className="h-12 rounded-2xl bg-[#eeeeef] font-semibold text-[#333]" onClick={() => openSheet({ type: "restore" })}>Відновити</button>
        </div>
      </div>

      <Title>Установка на iPhone</Title>
      <div className="rounded-[26px] border border-black/5 bg-white p-4 text-sm leading-relaxed text-[#777] shadow-sm shadow-black/5">Відкрий сторінку в Safari, натисни «Поділитися», потім «На екран Додому». Після цього додаток відкривається на весь екран.</div>

      <button className="btn btn-danger mt-6" onClick={() => setConfirmAction({ kind: "reset" })}>Скинути всі дані</button>
      <div className="mt-8 pb-1 text-center text-[10px] font-medium tracking-[0.24em] text-[#999]">
        DESIGNED &amp; MADE BY <span className="font-bold text-[#555]">STRIK</span>
      </div>
      {confirmAction && <ConfirmDialog
        title={confirmAction.kind === "reset" ? "Скинути всі дані?" : "Видалити категорію?"}
        message={confirmAction.kind === "reset" ? "Витрати та налаштування буде видалено. Цю дію не можна скасувати." : `Категорію «${data.cats[confirmAction.index]?.n ?? ""}» буде видалено.`}
        confirmLabel={confirmAction.kind === "reset" ? "Скинути" : "Видалити"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction.kind === "reset") reset();
          else patch({ cats: data.cats.filter((_, i) => i !== confirmAction.index) });
          setConfirmAction(null);
        }}
      />}
    </div>
  );
}
