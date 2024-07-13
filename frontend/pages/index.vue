<script setup>
import { ref, onMounted } from "vue";

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

onMounted(fetchTodos);
</script>

<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold mb-6">Stylish TODO List</h1>
        <div class="space-y-4">
            <div class="flex space-x-2">
                <input v-model="newTodo" @keyup.enter="addTodo" type="text" placeholder="Add a new task"
                    class="flex-grow px-3 py-2 border rounded-md bg-background text-foreground" />
                <button @click="addTodo"
                    class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Add
                </button>
            </div>
            <ul class="space-y-2">
                <li v-for="todo in todos" :key="todo.id"
                    class="flex items-center space-x-2 p-2 bg-card rounded-md shadow-sm">
                    <input :checked="todo.completed" @change="toggleTodo(todo)" type="checkbox"
                        class="form-checkbox h-5 w-5 text-primary border-primary" />
                    <span
                        :class="{ 'line-through text-muted-foreground': todo.completed, 'text-card-foreground': !todo.completed }">
                        {{ todo.title }}
                    </span>
                    <button @click="deleteTodo(todo)"
                        class="ml-auto px-2 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90">
                        Delete
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
