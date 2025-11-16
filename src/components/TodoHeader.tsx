// src/components/TodoHeader.tsx
import React from 'react';

export interface TodoHeaderProps {
  allCompleted: boolean;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  handleAddTodo: (e: React.FormEvent) => Promise<void>;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  allCompleted,
  newTitle,
  setNewTitle,
  isSubmitting,
  handleAddTodo,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder={allCompleted ? 'All done!' : 'What needs to be done?'}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
