import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3670;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const addTodo = (title: string) =>
  client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });

export const updateTodo = (todo: Partial<Todo> & Pick<Todo, 'id'>) =>
  client.patch<Todo>(`/todos/${todo.id}`, todo);

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);
