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
  (e: 'update-todo', id: number, title: string): void
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
        class="flex items-center justify-between p-2 space-x-2 rounded-md cursor-move bg-secondary"
      >
        <div class="flex items-center flex-grow space-x-2">
          <Checkbox
            :id="'todo-' + todo.id"
            :checked="todo.completed"
            @update:checked="() => emit('toggle-todo', todo)"
          />
          <Label
            :for="'todo-' + todo.id"
            :class="{ 'line-through': todo.completed }"
          >
            {{ todo.title }}
          </Label>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            @click="openEditModal(todo)"
          >
            <Edit class="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="emit('delete-todo', todo.id)">
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </template>
  </draggable>
  <p
    v-if="todos.length === 0"
    class="mt-6 text-center text-muted-foreground"
  >
    No tasks yet. Add some!
  </p>
  <TodoEditModal
    v-if="editingTodo"
    :todo="editingTodo"
    :is-open="isEditModalOpen"
    @close="closeEditModal"
    @update="(title) => emit('update-todo', editingTodo!.id, title)"
  />
</template>

<style scoped>
.ghost-class {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
