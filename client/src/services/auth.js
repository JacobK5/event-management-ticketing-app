const CURRENT_USER_KEY = "currentUser";

export const login = (user) => {
  // Save user data to localStorage to keep them logged in
  console.log('login user in and saving:', user);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const logout = () => {
  // Remove user data from localStorage to log them out
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  // Retrieve user data from localStorage, if available
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  // Check if there's a user in localStorage
  return getCurrentUser() !== null;
};
