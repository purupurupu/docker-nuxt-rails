<script setup>
import draggable from "vuedraggable";

const todos = ref([]);
const newTodo = ref("");

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

const toggleTodo = async (todo) => {
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

const deleteTodo = async (todo) => {
  await fetch(`http://localhost:3001/api/todos/${todo.id}`, {
    method: "DELETE",
  });
  todos.value = todos.value.filter((t) => t.id !== todo.id);
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
  await updateOrder(todos.value);
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
              <div class="flex items-center space-x-2">
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
              <Button variant="destructive" size="sm" @click="deleteTodo(todo)">
                Delete
              </Button>
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
  </div>
</template>

<style scoped>
.ghost-class {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
