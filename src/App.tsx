/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Loader } from './components/Loader';
import {
  selectFilteredTodos,
  selectActiveCount,
  selectHasCompleted,
  selectAllCompleted,
} from './selectors/todoSelectors';
import { getTodos } from './api/todos';
import { FILTERS, FilterType } from './constants/filters';
import { useErrorNotification } from './hooks/useErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
import { useTodoActions } from './hooks/useTodoActions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FILTERS.ALL);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { error, hideError, isVisible, showError } = useErrorNotification();

  const filteredTodos = selectFilteredTodos(todos, filter);
  const activeTodosCount = selectActiveCount(todos);
  const hasCompletedTodos = selectHasCompleted(todos);
  const allCompleted = selectAllCompleted(todos);

  const { handleAddTodo, handleUpdateTodo, handleDeleteTodo } = useTodoActions({
    todos,
    setTodos,
    newTitle,
    setNewTitle,
    setIsSubmitting,
    showError,
  });

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      getTodos()
        .then(setTodos)
        .catch(() => showError('Unable to load todos'))
        .finally(() => setLoading(false));
    }, 1000);
  }, [showError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          allCompleted={allCompleted}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          isSubmitting={isSubmitting}
          handleAddTodo={handleAddTodo}
        />

        <TodoMain
          todos={filteredTodos}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>

      {loading && <Loader />}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          isVisible ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
