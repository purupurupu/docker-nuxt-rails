<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { Trash2, Edit } from 'lucide-vue-next';
import TodoEditModal from './TodoEditModal.vue';
import type { Todo } from '../../../types/todo';

const props = defineProps<{
  todos: Todo[]
}>();

const emit = defineEmits<{
  (e: 'toggle-todo', todo: Todo): void
  (e: 'update-todo', id: number, title: string, due_date: string): void
  (e: 'delete-todo', id: number): void
  (e: 'update-order'): void
}>();

const editingTodo = ref<Todo | null>(null);
const isEditModalOpen = ref(false);

const openEditModal = (todo: Todo) => {
  editingTodo.value = todo;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingTodo.value = null;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP');
};

const onDragEnd = () => {
  emit('update-order');
};
</script>

<template>
  <draggable
    :list="todos"
    item-key="id"
    @end="onDragEnd"
    :animation="200"
    ghost-class="ghost-class"
    class="mt-6 space-y-2"
  >
    <template #item="{ element: todo }">
      <div
        class="p-4 border rounded-lg flex items-center justify-between group"
        :class="{ 'bg-gray-100 line-through': todo.completed }"
      >
        <div>
          <div class="flex items-center space-x-2">
            <Checkbox
              :checked="todo.completed"
              @update:checked="emit('toggle-todo', todo)"
            />
            <span>{{ todo.title }}</span>
          </div>
          <div v-if="todo.due_date" class="text-sm text-gray-500 ml-6 mt-1">
            期限: {{ formatDate(todo.due_date) }}
          </div>
        </div>
        <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" @click="openEditModal(todo)">
            <Edit class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="emit('delete-todo', todo.id)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </template>
  </draggable>
  <p
    v-if="todos.length === 0"
    class="mt-6 text-center text-muted-foreground"
  >
    タスクがありません。新しいタスクを追加してください。
  </p>
  <TodoEditModal
    v-if="editingTodo"
    :todo="editingTodo"
    :is-open="isEditModalOpen"
    @close="closeEditModal"
    @update="(id, title, due_date) => emit('update-todo', id, title, due_date)"
  />
</template>

<style scoped>
.ghost-class {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
