import axios from 'axios';

const API = axios.create({ baseURL: 'https://expense-track-backend-9rzm.onrender.com/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getExpenses = () => API.get('/expenses');
export const addExpense = (data) => API.post('/expenses', data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

export const getIncomes = () => API.get('/incomes');
export const addIncome = (data) => API.post('/incomes', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
