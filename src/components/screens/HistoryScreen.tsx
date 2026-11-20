"use client";
import Link from "next/link";
import { useState } from "react";
import { useBudget } from "@/store/BudgetProvider";
import { allTransactions } from "@/lib/transactions";
import { TransactionRow } from "../TransactionRow";

export function HistoryScreen() {
  const { data } = useBudget();
  const [cat, setCat] = useState("");
  const [from, setFrom] = useState("");
  const list = allTransactions(data).filter((t) => (!cat || t.cat === cat) && (!from || t.date >= from));

  return (
    <div className="relative z-0 -mx-5 -mt-4 min-h-[calc(100dvh-3rem)] bg-[#f1f1f1] px-4 pb-8 pt-4 text-[#252525] before:fixed before:inset-0 before:-z-10 before:bg-[#f1f1f1] before:content-['']">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#666]">‹ <span>Головна</span></Link>
      <div className="mb-4 flex items-end justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Усі транзакції</h1><p className="mt-1 text-xs text-[#888]">Історія витрат і поповнень</p></div>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#555] shadow-sm">{list.length}</span>
      </div>
      <div className="mb-3 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm shadow-black/5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#999]">Категорії</p>
        <div className="flex flex-wrap gap-2">
        <button className={`rounded-full border px-3.5 py-2 text-sm transition ${cat === "" ? "border-[#242426] bg-[#242426] text-white" : "border-black/5 bg-[#f4f4f4] text-[#555]"}`} onClick={() => setCat("")}>Усі</button>
        {data.cats.map((c) => (
          <button key={c.n} className={`rounded-full border px-3.5 py-2 text-sm transition ${cat === c.n ? "border-[#242426] bg-[#242426] text-white" : "border-black/5 bg-[#f4f4f4] text-[#555]"}`} onClick={() => setCat(c.n)}>{c.i} {c.n}</button>
        ))}
        </div>
        <p className="mb-1 mt-4 ml-1 text-xs font-medium text-[#777]">Починаючи з дати</p>
        <input type="date" className="w-full rounded-2xl border border-black/5 bg-[#f5f5f5] px-4 py-3 text-base text-[#252525] outline-none focus:border-black/20" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="rounded-[24px] border border-black/5 bg-white px-4 shadow-sm shadow-black/5">
        {list.length ? list.map((t) => <TransactionRow key={t.kind + t.id} tx={t} variant="light" />) : <p className="py-8 text-center text-sm text-[#888]">За цими фільтрами нічого немає.</p>}
      </div>
    </div>
  );
}
