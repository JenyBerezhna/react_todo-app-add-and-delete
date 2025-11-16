import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoMainProps {
  todos: Todo[];
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
  onDeleteTodo: (id: number) => void;
}

export const TodoMain: React.FC<TodoMainProps> = ({
  todos,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todoapp__list" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </ul>
    </section>
  );
};
