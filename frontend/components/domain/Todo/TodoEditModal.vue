<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Todo } from '@/types/todo';

const props = defineProps<{
  todo: Todo;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update', id: number, title: string, due_date: string): void;
}>();

const title = ref(props.todo.title);
const dueDate = ref(props.todo.due_date || '');

watch(() => props.todo, (newTodo) => {
  title.value = newTodo.title;
  dueDate.value = newTodo.due_date || '';
});

const handleSubmit = () => {
  if (title.value.trim()) {
    emit('update', props.todo.id, title.value, dueDate.value);
    emit('close');
  }
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && emit('close')">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>タスクの編集</DialogTitle>
        <DialogDescription>
          タスクの詳細を編集してください
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="edit-title">タスク名</Label>
            <Input id="edit-title" v-model="title" placeholder="タスク名を入力" />
          </div>
          <div class="space-y-2">
            <Label for="edit-due-date">期限日</Label>
            <Input id="edit-due-date" v-model="dueDate" type="date" />
          </div>
        </div>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="emit('close')">キャンセル</Button>
          <Button type="submit">保存</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
