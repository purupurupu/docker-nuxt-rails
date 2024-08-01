<script setup lang="ts">
import draggable from "vuedraggable";
import { Trash2, Edit } from "lucide-vue-next";

const todos = ref<Todo[]>([]);
const newTodo = ref("");

const editingTodo = ref<Todo | null>(null);
const editedTitle = ref("");
const isEditModalOpen = ref(false);

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const openEditModal = (todo: Todo): void => {
  editingTodo.value = todo;
  editedTitle.value = todo.title;
  isEditModalOpen.value = true;
};

const fetchTodos = async () => {
  const response = await fetch("http://localhost:3001/api/todos");
  todos.value = await response.json();
};

const addTodo = async () => {
  if (newTodo.value.trim()) {
    const response = await fetch("http://localhost:3001/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: { title: newTodo.value, completed: false },
      }),
    });
    const todo = await response.json();
    todos.value.push(todo);
    newTodo.value = "";
  }
};

const toggleTodo = async (todo: Todo) => {
  const response = await fetch(`http://localhost:3001/api/todos/${todo.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: { completed: !todo.completed } }),
  });
  const updatedTodo = await response.json();
  const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
  todos.value[index] = updatedTodo;
};

const updateTodo = async () => {
  if (editingTodo.value && editedTitle.value.trim()) {
    const response = await fetch(
      `http://localhost:3001/api/todos/${editingTodo.value.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: { title: editedTitle.value } }),
      }
    );
    const updatedTodo = await response.json();
    const index = todos.value.findIndex((t) => t.id === updatedTodo.id);
    todos.value[index] = updatedTodo;
    closeEditModal(); // 更新後にモーダルを閉じる
  }
};

const deleteTodo = async (todo: Todo) => {
  await fetch(`http://localhost:3001/api/todos/${todo.id}`, {
    method: "DELETE",
  });
  todos.value = todos.value.filter((t) => t.id !== todo.id);
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingTodo.value = null;
};

const updateOrder = async () => {
  const updatedTodos = todos.value.map((todo, index) => ({
    id: todo.id,
    position: index + 1,
  }));

  await fetch("http://localhost:3001/api/todos/update_order", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todos: updatedTodos,
    }),
  });
};

const onDragEnd = async () => {
  // TODO: Implement reordering of todos
  await updateOrder();
};

onMounted(fetchTodos);
</script>

<template>
  <div class="container py-8 mx-auto">
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Stylish TODO List</CardTitle>
        <CardDescription>Manage your tasks efficiently</CardDescription>
      </CardHeader>
      <CardContent>
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
        <draggable
          v-model="todos"
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
                  @update:checked="() => toggleTodo(todo)"
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
                <Button variant="ghost" size="icon" @click="deleteTodo(todo)">
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
      </CardContent>
    </Card>
    <!-- 編集用モーダル -->
    <Dialog v-model:open="isEditModalOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <div class="mt-4">
          <Input v-model="editedTitle" placeholder="Edit task" />
        </div>
        <div class="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" @click="closeEditModal">Cancel</Button>
          <Button @click="updateTodo" variant="default">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.ghost-class {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
