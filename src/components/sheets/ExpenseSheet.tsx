"use client";
import { useState } from "react";
import { Sheet } from "../Sheet";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { newId, parseAmount } from "@/lib/format";
import { ConfirmDialog } from "../ConfirmDialog";
import { DatePicker } from "../DatePicker";

export function ExpenseSheet({ id, date }: { id?: string; date?: string }) {
  const { data, today, upsertExpense, removeExpense } = useBudget();
  const { closeSheet, toast } = useUi();
  const ex = id ? data.exp.find((e) => e.id === id) : undefined;

  const [amount, setAmount] = useState(ex ? String(ex.amount) : "");
  const [name, setName] = useState(ex?.name ?? "");
  const [cat, setCat] = useState(ex?.cat ?? data.cats[0]?.n ?? "");
  const initialDate = ex?.date ?? date ?? (today < data.start ? data.start : today > data.end ? data.end : today);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const dateMin = ex && ex.date < data.start ? ex.date : data.start;
  const dateMax = ex && ex.date > data.end ? ex.date : data.end;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    const a = parseAmount(amount);
    if (!(a > 0)) return toast("Введіть суму більше 0");
    if (selectedDate < dateMin || selectedDate > dateMax) return toast("Оберіть дату в межах доступного періоду");
    upsertExpense({ id: ex?.id ?? newId(), amount: a, name: name.trim(), cat, date: selectedDate });
    closeSheet();
    toast("Витрату збережено");
  };

  return (
    <>
    <Sheet title={ex ? "Редагувати витрату" : "Нова витрата"} variant="light">
      <div className="flex items-baseline justify-center gap-2 py-3">
        <input
          autoFocus
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-[78%] bg-transparent text-right text-5xl font-bold tracking-tight text-[#252525] outline-none placeholder:text-black/25"
        />
        <span className="text-xl font-semibold text-[#888]">{data.cur}</span>
      </div>
      <input className="w-full rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-base text-[#252525] outline-none placeholder:text-[#999] focus:border-black/20" placeholder="На що витрачено?" value={name} onChange={(e) => setName(e.target.value)} />
      <p className="mb-1 ml-1 mt-4 text-xs text-[#777]">Категорія</p>
      <div className="flex flex-wrap gap-2">
        {data.cats.map((c) => (
          <button key={c.n} type="button" data-on={c.n === cat} className={`rounded-full border px-3.5 py-2 text-sm transition ${c.n === cat ? "border-[#242426] bg-[#242426] text-white" : "border-black/10 bg-white text-[#555]"}`} onClick={() => setCat(c.n)}>
            {c.i} {c.n}
          </button>
        ))}
      </div>
      <p className="mb-1 ml-1 mt-4 text-xs text-[#777]">Дата</p>
      <DatePicker value={selectedDate} min={dateMin} max={dateMax} onChange={setSelectedDate} />
      <button className="mt-5 h-13 w-full rounded-2xl bg-[#242426] font-semibold text-white transition active:scale-[.98]" onClick={save}>Зберегти витрату</button>
      {ex && (
        <button
          className="mt-2 h-12 w-full rounded-2xl bg-[#fce8e8] font-semibold text-[#b74343]"
          onClick={() => setConfirmDelete(true)}
        >
          Видалити
        </button>
      )}
    </Sheet>
    {confirmDelete && ex && <ConfirmDialog title="Видалити витрату?" message="Цю витрату буде видалено назавжди." onCancel={() => setConfirmDelete(false)} onConfirm={() => { removeExpense(ex.id); setConfirmDelete(false); closeSheet(); toast("Видалено"); }} />}
    </>
  );
}
