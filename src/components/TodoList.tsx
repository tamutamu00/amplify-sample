import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import CreateTodoModal from "./modal/createTodoModal";
import EditTodoModal from "./modal/editTodoModal";

const sampleTodos: Schema["Todo"]["type"][] = [
  {
    id: "1",
    content: "Sample Todo",
    status: "TODO",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const client = generateClient<Schema>();

export const TodoList = () => {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>(sampleTodos);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: todos } = await client.models.Todo.list();
      setTodos(todos);
    };
    fetchTodos();
  }, []);

  const handleDeleteTodo = async (todoId: string) => {
    await client.models.Todo.delete({ id: todoId });
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
  };

  // filter 条件を設定出来るUIが必要だね。

  // sort も出来ないといけないね。

  return (
    <div>
      <h1>Todo List</h1>
      {todos &&
        todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              onClick={() => {
                setEditModalOpen(true);
                setSelectedTodoId(todo.id);
              }}
            >
              {todo.content}:{todo.status}
            </div>
            <div>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </div>
        ))}
      <CreateTodoModal />
      <EditTodoModal
        open={editModalOpen}
        todoId={selectedTodoId}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
};
