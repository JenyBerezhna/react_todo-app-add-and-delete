import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoMainProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
  onDeleteTodo: (id: number) => void;
}

export const TodoMain: React.FC<TodoMainProps> = ({
  todos,
  tempTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => (
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

      {/* create a todo with `id: 0`*/}
      {tempTodo && !todos.some(t => t.id === tempTodo.id) && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isTemporary
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
        />
      )}
    </ul>
  </section>
);
