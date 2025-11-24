import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from '../components/Loader';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  isTemporary?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  isTemporary,
}) => {
  const { id, title, completed } = todo;

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    await onUpdate(id, { completed: !completed });
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(id);
    setIsLoading(false);
  };

  const showLoader = isTemporary || isLoading;

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label
        className="todo__status-label"
        htmlFor={`todo-status-${id}`}
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-status-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
          disabled={showLoader}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={showLoader}
      >
        ×
      </button>

      {showLoader && (
        <div data-cy="TodoLoader" className="todo__loader">
          <Loader />
        </div>
      )}
    </div>
  );
};
