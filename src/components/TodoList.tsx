import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import CreateTodoModal from "./modal/createTodoModal";
import EditTodoModal from "./modal/editTodoModal";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const toTime = (iso?: string | null) => {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
};

const sampleTodos: Schema["Todo"]["type"][] = [
  {
    id: "1",
    content: "Sample Todo",
    status: "TODO",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    content: "Sample Todo2",
    status: "TODO",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
type StatusType = Schema["Todo"]["nestedTypes"]["status"]["type"];

const client = generateClient<Schema>();

export const TodoList = () => {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>(sampleTodos);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<StatusType | undefined>(undefined);
  const [sort, setSort] = useState<"asc" | "desc" | undefined>(undefined);

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

  const filteredTodos = filter
    ? todos.filter((todo) => todo.status === filter)
    : todos;

  const sortedTodos = filteredTodos.sort((a, b) => {
    const aDue = toTime(a.dueDate) ?? 0;
    const bDue = toTime(b.dueDate) ?? 0;
    const aCreatedAt = toTime(a.createdAt) ?? 0;
    const bCreatedAt = toTime(b.createdAt) ?? 0;
    if (sort === "asc") {
      if (a.dueDate === null && b.dueDate === null)
        return bCreatedAt - aCreatedAt;
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;
      return aDue - bDue;
    } else if (sort === "desc") {
      if (a.dueDate === null && b.dueDate === null)
        return bCreatedAt - aCreatedAt;
      if (aDue === null) return 1;
      if (bDue === null) return -1;
      return bDue - aDue;
    }
    return 0;
  });

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        フィルター
        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusType)}
          >
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="DOING">DOING</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </Select>
        </FormControl>
      </div>
      {/* そーと */}
      <div>
        <button onClick={() => setSort("asc")}>昇順</button>
        <button onClick={() => setSort("desc")}>降順</button>
      </div>
      {sortedTodos &&
        sortedTodos.map((todo) => (
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
              {todo.content}:{todo.status}:{todo?.dueDate}
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
