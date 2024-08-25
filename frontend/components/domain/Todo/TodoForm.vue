<script setup lang="ts">
import { ref } from 'vue';

const newTodo = ref('');

const emit = defineEmits<{
  (e: 'add-todo', title: string): void
}>();

const addTodo = () => {
  if (newTodo.value.trim()) {
    emit('add-todo', newTodo.value);
    newTodo.value = '';
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
    <Button type="submit" class="w-full">Add Task</Button>
  </form>
</template>
