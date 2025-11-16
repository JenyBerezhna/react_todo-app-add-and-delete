import { useCallback } from 'react';
import { Todo } from '../types/Todo';
import {
  addTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
} from '../handlers/todoHandlers';

interface UseTodoActionsParams {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  setIsSubmitting: (value: boolean) => void;
  showError: (message: string) => void;
}

interface TodoActions {
  handleAddTodo: (e: React.FormEvent) => Promise<void>;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
}

export const useTodoActions = ({
  todos,
  setTodos,
  newTitle,
  setNewTitle,
  setIsSubmitting,
  showError,
}: UseTodoActionsParams): TodoActions => {
  const handleAddTodo = useCallback(
    (e: React.FormEvent) =>
      addTodoHandler(
        e,
        newTitle,
        todos,
        setTodos,
        setNewTitle,
        setIsSubmitting,
        showError,
      ),
    [newTitle, todos, showError, setTodos, setNewTitle, setIsSubmitting],
  );

  const handleUpdateTodo = useCallback(
    (id: number, data: Partial<Todo>) =>
      updateTodoHandler(id, data, todos, setTodos, showError),
    [todos, showError, setTodos],
  );

  const handleDeleteTodo = useCallback(
    (id: number) => deleteTodoHandler(id, todos, setTodos, showError),
    [todos, showError, setTodos],
  );

  return { handleAddTodo, handleUpdateTodo, handleDeleteTodo };
};
