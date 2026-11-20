"use client";
import { useState } from "react";
import { Sheet } from "../Sheet";
import { useBudget } from "@/store/BudgetProvider";
import { useUi } from "@/ui/ui-context";
import { money, newId, parseAmount } from "@/lib/format";
import { summarize } from "@/lib/budget";
import { ConfirmDialog } from "../ConfirmDialog";

export function TopUpSheet({ id }: { id?: string }) {
  const { data, today, upsertTopUp, removeTopUp } = useBudget();
  const { closeSheet, toast } = useUi();
  const t = id ? data.top.find((x) => x.id === id) : undefined;

  const [amount, setAmount] = useState(t ? String(t.amount) : "");
  const [desc, setDesc] = useState(t?.desc ?? "");
  const [d, setD] = useState(t?.date ?? today);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    const a = parseAmount(amount);
    if (!(a > 0)) return toast("Введіть суму більше 0");
    if (!d) return toast("Оберіть дату");
    const item = { id: t?.id ?? newId(), amount: a, desc: desc.trim(), date: d };
    const next = { ...data, top: [...data.top.filter((x) => x.id !== item.id), item] };
    upsertTopUp(item);
    closeSheet();
    toast(`Додано · ліміт на день ${money(summarize(next, today).daily)}`);
  };

  return (
    <>
    <Sheet title={t ? "Редагувати поповнення" : "Додати бюджет"} variant="light">
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
      <input className="w-full rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-base text-[#252525] outline-none placeholder:text-[#999] focus:border-black/20" placeholder="Опис (необов'язково)" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <p className="mb-1 ml-1 mt-4 text-xs text-[#777]">Дата</p>
      <input type="date" className="w-full rounded-2xl border border-black/5 bg-white px-4 py-3.5 text-base text-[#252525] outline-none focus:border-black/20" value={d} onChange={(e) => setD(e.target.value)} />
      <p className="mx-1 mt-3 text-sm text-[#777]">
        Додані кошти збільшують денний ліміт на весь період. Заощадження та перевитрати не змінюються.
      </p>
      <button className="mt-5 h-13 w-full rounded-2xl bg-[#242426] font-semibold text-white transition active:scale-[.98]" onClick={save}>Підтвердити</button>
      {t && (
        <button
          className="mt-2 h-12 w-full rounded-2xl bg-[#fce8e8] font-semibold text-[#b74343]"
          onClick={() => setConfirmDelete(true)}
        >
          Видалити
        </button>
      )}
    </Sheet>
    {confirmDelete && t && <ConfirmDialog title="Видалити поповнення?" message="Це поповнення буде видалено назавжди." onCancel={() => setConfirmDelete(false)} onConfirm={() => { removeTopUp(t.id); setConfirmDelete(false); closeSheet(); toast("Видалено"); }} />}
    </>
  );
}
