type P = { className?: string };
const base = {
  width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
export const HomeIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>
);
export const ChartIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 20V10M12 20V4M19 20v-7" /></svg>
);
export const GearIcon = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>
);
export const BellIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4" /></svg>
);
