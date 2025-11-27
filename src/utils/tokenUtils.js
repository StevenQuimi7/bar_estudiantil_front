import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};

export const getTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // convert to ms
  } catch {
    return null;
  }
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ?  `Bearer ${token}` : null;
};
