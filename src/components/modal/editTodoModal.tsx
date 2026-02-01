import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { Schema } from "../../../amplify/data/resource";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { generateClient } from "aws-amplify/data";

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

const client = generateClient<Schema>();

type Props = {
  open: boolean;
  todoId?: string;
  onClose: () => void;
};

export default function EditTodoModal(props: Props) {
  const { open, todoId, onClose } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TodoInput>({
    defaultValues: {
      content: "",
      status: "TODO",
    },
  });

  useEffect(() => {
    if (todoId) {
      const fetchTodo = async () => {
        const { data: todo } = await client.models.Todo.get({ id: todoId });
        console.log("todo", todo);
        reset({
          content: todo?.content,
          status: todo?.status,
        });
      };
      fetchTodo();
    }
  }, [todoId, reset]);

  const updateTodo = async (data: TodoInput) => {
    if (!todoId) {
      console.error("todoId is required");
      return;
    }

    await client.models.Todo.update({
      id: todoId,
      content: data.content,
      status: data.status,
    });
  };

  const onSubmit: SubmitHandler<TodoInput> = (data) => {
    console.log(data);
    updateTodo(data);
    onClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
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
          <Controller
            name="status"
            control={control}
            rules={{ required: "ステータスは必須です" }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel id="status-label">Status</InputLabel>

                <Select
                  labelId="status-label"
                  label="Status"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                >
                  <MenuItem value="TODO">TODO</MenuItem>
                  <MenuItem value="DOING">DOING</MenuItem>
                  <MenuItem value="DONE">DONE</MenuItem>
                </Select>

                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Button onClick={handleSubmit(onSubmit)}>update Todo</Button>
        </Box>
      </Modal>
    </div>
  );
}
