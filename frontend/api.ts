import axios from 'axios';
const API_URL = 'http://localhost:3000/todo';

export const getTodos = () => axios.get(API_URL);
export const addTodo = (title: string) => axios.post(API_URL, { title });
export const deleteTodo = (id: number) => axios.delete(`${API_URL}/${id}`);