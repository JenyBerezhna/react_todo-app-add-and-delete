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
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setNewTitle: (title: string) => void,
  setIsSubmitting: (value: boolean) => void,
  setTempTodo: (todo: Todo | null) => void,
  inputRef: React.RefObject<HTMLInputElement>,
  userId: number,
  showError: (message: string) => void,
): Promise<void> => {
  e.preventDefault();
  const trimmed = newTitle.trim();

  if (!trimmed) {
    showError(ERROR_MESSAGES.EMPTY_TITLE);

    return;
  }

  const optimistic: Todo = { id: 0, title: trimmed, completed: false, userId };

  setTempTodo(optimistic);
  setIsSubmitting(true);

  try {
    const created = await addTodo({ title: trimmed, userId, completed: false });

    setTodos(prev => [...prev, created]);

    setNewTitle('');
  } catch {
    showError(ERROR_MESSAGES.ADD);
  } finally {
    setTempTodo(null);
    setIsSubmitting(false);
    inputRef.current?.focus();
  }
};

export const updateTodoHandler = async (
  id: number,
  data: Partial<Todo>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showError: (message: string) => void,
): Promise<void> => {
  try {
    const updated = await updateTodo({ id, ...data });

    setTodos(prev => replaceTodo(prev, updated));
  } catch {
    showError(ERROR_MESSAGES.UPDATE);
  }
};

export const deleteTodoHandler = async (
  id: number,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  showError: (message: string) => void,
): Promise<void> => {
  try {
    await deleteTodo(id);

    setTodos(prev => removeTodo(prev, id));
  } catch {
    showError(ERROR_MESSAGES.DELETE);
  }
};
