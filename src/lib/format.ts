export const money = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
export const parseAmount = (s: string) => parseFloat(s.replace(",", "."));
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
