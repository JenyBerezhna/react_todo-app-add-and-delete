import { useState, useEffect, useRef, useCallback } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todos';
import { ERROR_MESSAGES } from '../constants/errors';

export function useTodos(userId: number) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [notification, setNotification] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await getTodos();

        setTodos(list);
      } catch {
        setNotification(ERROR_MESSAGES.LOAD);
      } finally {
        setLoading(false);
        focusInput();
      }
    };

    load();
  }, [focusInput]);

  const handleAddTodo = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmed = newTitle.trim();

      if (!trimmed) {
        setNotification(ERROR_MESSAGES.EMPTY_TITLE);
        focusInput();

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
        focusInput();
      } catch {
        setNotification(ERROR_MESSAGES.ADD);
        focusInput();
      } finally {
        setTempTodo(null);
        setIsSubmitting(false);
      }
    },
    [newTitle, userId, focusInput],
  );

  const handleUpdateTodo = useCallback(
    async (id: number, data: Partial<Todo>) => {
      setProcessingIds(ids => [...ids, id]);
      try {
        const updated = await updateTodo({ id, ...data });

        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } catch {
        setNotification(ERROR_MESSAGES.UPDATE);
        focusInput();
      } finally {
        setProcessingIds(ids => ids.filter(x => x !== id));
      }
    },
    [focusInput],
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      setProcessingIds(ids => [...ids, id]);
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
        focusInput();
      } catch {
        setNotification(ERROR_MESSAGES.DELETE);
        focusInput();
      } finally {
        setProcessingIds(ids => ids.filter(x => x !== id));
      }
    },
    [focusInput],
  );

  return {
    todos,
    tempTodo,
    newTitle,
    setNewTitle,
    isSubmitting,
    notification,
    loading,
    processingIds,
    inputRef,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  };
}
