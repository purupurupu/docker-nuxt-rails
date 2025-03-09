<script setup lang="ts">
import { ref } from 'vue';

const newTodo = ref('');
const dueDate = ref('');

const emit = defineEmits<{
  (e: 'add-todo', title: string, due_date: string): void
}>();

const addTodo = () => {
  if (newTodo.value.trim()) {
    emit('add-todo', newTodo.value, dueDate.value);
    newTodo.value = '';
    dueDate.value = '';
  }
};
</script>

<template>
  <form @submit.prevent="addTodo" class="space-y-4">
    <div class="space-y-2">
      <Label for="new-todo">New Task</Label>
      <Input
        id="new-todo"
        v-model="newTodo"
        placeholder="Enter a new task"
      />
    </div>
    <div class="space-y-2">
      <Label for="due_date">Due Date</Label>
      <Input
        id="due_date"
        v-model="dueDate"
        type="date"
      />
    </div>
    <Button type="submit" class="w-full">Add Task</Button>
  </form>
</template>
