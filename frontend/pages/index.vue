<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TodoList from '@/components/domain/Todo/TodoList.vue';
import TodoForm from '@/components/domain/Todo/TodoForm.vue';
import { fetchTodos, addTodo, toggleTodo, updateTodo, deleteTodo, updateOrder } from '@/services/todoService';
import type { Todo } from '@/types/todo';

const todos = ref<Todo[]>([]);

onMounted(async () => {
  todos.value = await fetchTodos();
});

const handleAddTodo = async (title: string) => {
  const newTodo = await addTodo(title);
  todos.value.push(newTodo);
};

const handleToggleTodo = async (todo: Todo) => {
  const updatedTodo = await toggleTodo(todo);
  const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
  todos.value[index] = updatedTodo;
};

const handleUpdateTodo = async (id: number, title: string) => {
  const updatedTodo = await updateTodo(id, title);
  const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
  todos.value[index] = updatedTodo;
};

const handleDeleteTodo = async (id: number) => {
  await deleteTodo(id);
  todos.value = todos.value.filter((t) => t.id !== id);
};

const handleUpdateOrder = async () => {
  await updateOrder(todos.value);
};
</script>

<template>
  <div class="container py-8 mx-auto">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Stylish TODO List</CardTitle>
        <CardDescription>Manage your tasks efficiently</CardDescription>
      </CardHeader>
      <CardContent>
        <TodoForm @add-todo="handleAddTodo" />
        <TodoList
          :todos="todos"
          @toggle-todo="handleToggleTodo"
          @update-todo="handleUpdateTodo"
          @delete-todo="handleDeleteTodo"
          @update-order="handleUpdateOrder"
        />
      </CardContent>
    </Card>
  </div>
</template>