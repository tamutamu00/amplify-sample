import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import CreateTodoModal from "./modal/createTodoModal";

const client = generateClient<Schema>();

export const TodoList = () => {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: todos } = await client.models.Todo.list();
      setTodos(todos);
    };
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      {todos && todos.map((todo) => <div key={todo.id}>{todo.content}</div>)}
      <CreateTodoModal />
    </div>
  );
};
