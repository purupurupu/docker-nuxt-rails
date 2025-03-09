import type { Todo } from '@/types/todo';

const API_URL = 'http://localhost:3001/api/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const addTodo = async (title: string, due_date: string): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      todo: { title, completed: false, due_date }
    }),
  });
  return await response.json();
};

export const toggleTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${todo.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todo: { completed: !todo.completed } }),
  });
  return await response.json();
};

export const updateTodo = async (id: number, title: string, due_date: string): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todo: { title, due_date } }),
  });
  return await response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};

export const updateOrder = async (todos: Todo[]): Promise<void> => {
  const updatedTodos = todos.map((todo, index) => ({
    id: todo.id,
    position: index + 1,
  }));

  await fetch(`${API_URL}/update_order`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      todos: updatedTodos,
    }),
  });
};
