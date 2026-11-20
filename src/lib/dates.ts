const pad = (n: number) => String(n).padStart(2, "0");
const utc = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const diffDays = (a: string, b: string) => Math.round((utc(b) - utc(a)) / 864e5);
export const addDays = (s: string, n: number) => {
  const d = new Date(utc(s) + n * 864e5);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};
export const fmtDay = (
  s: string,
  o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
) => new Date(utc(s)).toLocaleDateString("uk-UA", { ...o, timeZone: "UTC" });
