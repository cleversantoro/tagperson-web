export const API_BASE_URL =
  localStorage.getItem('tagperson.api.baseUrl') ?? 'https://localhost:56723/api';

export const DEFAULT_AUTH = {
  username: localStorage.getItem('tagperson.api.user') ?? 'admin',
  password: localStorage.getItem('tagperson.api.pass') ?? 'admin123'
};
