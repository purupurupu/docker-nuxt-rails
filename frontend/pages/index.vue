<script setup>
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
    <div class="container mx-auto py-8">
        <Card class="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Stylish TODO List</CardTitle>
                <CardDescription>Manage your tasks efficiently</CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="addTodo" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="new-todo">New Task</Label>
                        <Input id="new-todo" v-model="newTodo" placeholder="Enter a new task" />
                    </div>
                    <Button type="submit" class="w-full">Add Task</Button>
                </form>
                <div v-if="todos.length > 0" class="mt-6 space-y-2">
                    <div v-for="todo in todos" :key="todo.id" class="flex items-center space-x-2">
                        <Checkbox :id="'todo-' + todo.id" :checked="todo.completed"
                            @update:checked="(checked) => toggleTodo(todo, checked)" />
                        <Label :for="'todo-' + todo.id" :class="{ 'line-through': todo.completed }">
                            {{ todo.title }}
                        </Label>
                        <Button variant="destructive" size="sm" @click="deleteTodo(todo)" class="ml-auto">
                            Delete
                        </Button>
                    </div>
                </div>
                <p v-else class="text-center text-muted-foreground mt-6">No tasks yet. Add some!</p>
            </CardContent>
        </Card>
    </div>
</template>
