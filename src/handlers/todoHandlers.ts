import { addTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ERROR_MESSAGES } from '../constants/errors';

/** state helpers */
const replaceTodo = (todos: Todo[], updated: Todo): Todo[] =>
  todos.map(t => (t.id === updated.id ? updated : t));

const removeTodo = (todos: Todo[], id: number): Todo[] =>
  todos.filter(t => t.id !== id);

export const loadTodosHandler = async (
  setTodos: (todos: Todo[]) => void,
  setLoading: (loading: boolean) => void,
  showError: (message: string) => void,
): Promise<void> => {
  setLoading(true);
  try {
    const list = await getTodos();

    setTodos(list);
  } catch {
    showError(ERROR_MESSAGES.LOAD);
  } finally {
    setLoading(false);
  }
};

export const addTodoHandler = async (
  e: React.FormEvent,
  newTitle: string,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  setNewTitle: (title: string) => void,
  setIsSubmitting: (value: boolean) => void,
  showError: (message: string) => void,
): Promise<void> => {
  e.preventDefault();

  const trimmed = newTitle.trim();

  if (!trimmed) {
    showError(ERROR_MESSAGES.EMPTY_TITLE);

    return;
  }

  setIsSubmitting(true);
  try {
    const created = await addTodo(trimmed);

    setTodos([...todos, created]);
    setNewTitle('');
  } catch {
    showError(ERROR_MESSAGES.ADD);
  } finally {
    setIsSubmitting(false);
  }
};

export const updateTodoHandler = async (
  id: number,
  data: Partial<Todo>,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  showError: (message: string) => void,
): Promise<void> => {
  try {
    const updated = await updateTodo({ id, ...data });

    setTodos(replaceTodo(todos, updated));
  } catch {
    showError(ERROR_MESSAGES.UPDATE);
  }
};

export const deleteTodoHandler = async (
  id: number,
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  showError: (message: string) => void,
): Promise<void> => {
  try {
    await deleteTodo(id);
    setTodos(removeTodo(todos, id));
  } catch {
    showError(ERROR_MESSAGES.DELETE);
  }
};
