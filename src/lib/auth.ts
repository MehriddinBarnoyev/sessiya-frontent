
// Authentication utilities
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getRole = (): string | null => {
  return localStorage.getItem('role');
};

export const setRole = (role: string): void => {
  localStorage.setItem('role', role);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
