/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { FILTERS, FilterType } from './constants/filters';
import { useErrorNotification } from './hooks/useErrorNotification';
import { useTodos } from './hooks/useTodos';

import { TodoHeader } from './components/TodoHeader';
import { TodoMain } from './components/TodoMain';
import { TodoFooter } from './components/TodoFooter';
import { Loader } from './components/Loader';

import {
  selectFilteredTodos,
  selectActiveCount,
  selectHasCompleted,
  selectAllCompleted,
} from './selectors/todoSelectors';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>(FILTERS.ALL);

  const {
    todos,
    loading,
    isSubmitting,
    newTitle,
    setNewTitle,
    notification,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  } = useTodos(USER_ID);

  const { error, hideError, isVisible, showError } = useErrorNotification();

  if (notification && !isVisible) {
    showError(notification);
  }

  const filteredTodos = selectFilteredTodos(todos, filter);
  const activeTodosCount = selectActiveCount(todos);
  const hasCompletedTodos = selectHasCompleted(todos);
  const allCompleted = selectAllCompleted(todos);

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

      {error && isVisible && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={hideError}
          />
          {error}
        </div>
      )}
    </div>
  );
};
