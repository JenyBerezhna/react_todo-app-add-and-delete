import { useState, useEffect, useRef, useCallback } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todos';
import { ERROR_MESSAGES } from '../constants/errors';

export function useTodos(userId: number) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** load todos on mount */
  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const list = await getTodos();

        setTodos(list);
      } catch {
        setNotification(ERROR_MESSAGES.LOAD);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newTitle.trim();

      if (!trimmed) {
        setNotification(ERROR_MESSAGES.EMPTY_TITLE);

        return;
      }

      const optimistic: Todo = {
        id: 0,
        title: trimmed,
        completed: false,
        userId,
      };

      setTempTodo(optimistic);
      setIsSubmitting(true);

      try {
        const created = await addTodo({
          title: trimmed,
          userId,
          completed: false,
        });

        setTodos(prev => [...prev, created]);
        setNewTitle('');
      } catch {
        setNotification(ERROR_MESSAGES.ADD);
      } finally {
        setTempTodo(null);
        setIsSubmitting(false);
        inputRef.current?.focus();
      }
    },
    [newTitle, userId],
  );

  const handleUpdateTodo = useCallback(
    async (id: number, data: Partial<Todo>) => {
      try {
        const updated = await updateTodo({ id, ...data });

        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } catch {
        setNotification(ERROR_MESSAGES.UPDATE);
      }
    },
    [setTodos],
  );

  /** delete todo */
  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setNotification(ERROR_MESSAGES.DELETE);
    }
  }, []);

  return {
    todos,
    loading,
    isSubmitting,
    newTitle,
    setNewTitle,
    notification,
    tempTodo,
    inputRef,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  };
}
