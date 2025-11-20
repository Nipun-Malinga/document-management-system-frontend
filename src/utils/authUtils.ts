export const getAccessToken = () => {
  return localStorage.getItem('jwt-access-token');
};

export const updateAccessToken = (token: string) => {
  localStorage.setItem('jwt-access-token', token);
};

export const clearAccessToken = () => {
  localStorage.removeItem('jwt-access-token');
};
