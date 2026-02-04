import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { TextField } from "@mui/material";
import type { Schema } from "../../../amplify/data/resource";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getClient } from "../../lib/amplifyClient";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type TodoInput = Omit<Schema["Todo"]["type"], "id" | "createdAt" | "updatedAt">;

export default function CreateTodoModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoInput>();

  const client = getClient();

  const createTodo = async (data: TodoInput) => {
    await client.models.Todo.create({
      content: data.content,
      status: "TODO",
    });
  };

  const onSubmit: SubmitHandler<TodoInput> = (data) => {
    console.log(data);
    createTodo(data);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>open create modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* TODO: ここにフォームを実装する */}
          <TextField
            {...register("content", { required: "空は禁止です。" })}
            helperText={errors.content?.message}
            error={!!errors.content}
          />

          <Button onClick={handleSubmit(onSubmit)}>Create Todo</Button>
        </Box>
      </Modal>
    </div>
  );
}
