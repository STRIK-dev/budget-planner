// Формат даних сумісний зі старою HTML-версією (ключ "bt"), тож старі бекапи відновлюються.
export type Category = { n: string; i: string };
export type Expense = { id: string; amount: number; name: string; cat: string; date: string };
export type TopUp = { id: string; amount: number; desc: string; date: string };

export type BudgetData = {
  name: string;
  cur: string;
  total: number; // базовий бюджет (без додаткових коштів)
  start: string; // YYYY-MM-DD
  end: string;
  cats: Category[];
  exp: Expense[];
  top: TopUp[];
};

// Єдиний тип рядка для списків транзакцій
export type Tx = {
  kind: "expense" | "topup";
  id: string;
  amount: number;
  title: string;
  cat?: string;
  date: string;
};
