// Стовпчики витрат по днях + пунктирна лінія денного ліміту
export function BarChart({ values, labels, limit }: { values: number[]; labels: string[]; limit: number }) {
  const n = Math.max(values.length, 1);
  const W = Math.max(340, n * 24), H = 128, bw = W / n;
  const max = Math.max(limit * 1.2, ...values, 1);
  const ly = H - (limit / max) * H;
  return (
    <div className="-mx-1 overflow-x-auto">
    <svg viewBox={`0 0 ${W} ${H + 28}`} className="block max-w-none" style={{ width: `${W}px` }} role="img" aria-label="Витрати за весь період бюджету">
      {values.map((v, i) => {
        const h = Math.max(2, (v / max) * H);
        const barWidth = Math.max(2, Math.min(14, bw - 6));
        return <rect key={i} x={i * bw + (bw - barWidth) / 2} y={H - h} width={barWidth} height={h} rx={Math.min(5, barWidth / 2)} className={v > limit ? "fill-bad" : "fill-brand"} />;
      })}
      <line x1={0} x2={W} y1={ly} y2={ly} strokeDasharray="4 4" strokeWidth={1.5} className="stroke-good" />
      {values.map((_, i) => {
        const step = Math.max(1, Math.ceil(n / 8));
        if (i % step !== 0 && i !== n - 1) return null;
        return <text key={`label-${i}`} x={i * bw + bw / 2} y={H + 20} textAnchor="middle" fontSize="9" fill="#888">{labels[i]}</text>;
      })}
    </svg>
    </div>
  );
}
