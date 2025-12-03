import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('servineo_token');
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}
