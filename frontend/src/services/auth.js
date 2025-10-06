export const authService = {
  setToken: (token) => {
    sessionStorage.setItem('token', token);
  },

  getToken: () => {
    return sessionStorage.getItem('token');
  },

  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    sessionStorage.clear();
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        sessionStorage.clear();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      sessionStorage.clear();
      return false;
    }
  }
};