"use client";

export function ConfirmDialog({ title, message, confirmLabel = "Видалити", onCancel, onConfirm }: {
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 px-5 backdrop-blur-sm" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-[28px] bg-[#f1f1f1] p-5 text-[#252525] shadow-2xl">
        <h2 id="confirm-title" className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-[#777]">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button className="h-12 rounded-2xl bg-white font-semibold text-[#333]" onClick={onCancel}>Скасувати</button>
          <button className="h-12 rounded-2xl bg-[#242426] font-semibold text-white" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
