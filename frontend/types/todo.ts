export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  order: number;
}
