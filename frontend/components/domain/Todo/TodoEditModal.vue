<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Todo } from '../../../types/todo';

const props = defineProps<{
  todo: Todo
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update', title: string): void
}>();

const editedTitle = ref(props.todo.title);

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    editedTitle.value = props.todo.title;
  }
});

const updateTodo = () => {
  if (editedTitle.value.trim()) {
    emit('update', editedTitle.value);
    emit('close');
  }
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('close')">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Todo</DialogTitle>
      </DialogHeader>
      <div class="mt-4">
        <Input v-model="editedTitle" placeholder="Edit task" />
      </div>
      <div class="flex justify-end mt-4 space-x-2">
        <Button variant="secondary" @click="emit('close')">Cancel</Button>
        <Button @click="updateTodo" variant="default">Save</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
