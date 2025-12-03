'use client';
import { useState, useEffect, useCallback } from 'react';

export interface Session {
  _id: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  ipAddress: string;
  isActive: boolean;
}

export function useDevices(userId?: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState('');

  const fetchSessions = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/controlC/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setSessions(data.devices || []);
        setCurrentDeviceId(data.currentDeviceId || '');
      } else {
        setError(data.message || 'Error al obtener las sesiones.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const closeAllOtherSessions = useCallback(async () => {
    if (!userId || !currentDeviceId) return { success: false, message: 'Datos insuficientes' };

    try {
      const res = await fetch(`http://localhost:8000/api/controlC/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentDeviceId }),
      });

      const data = await res.json();
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.deviceId === currentDeviceId));
        return {
          success: true,
          message: data.message || 'Sesiones cerradas correctamente',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Error al cerrar sesiones',
        };
      }
    } catch {
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  }, [userId, currentDeviceId]);

  useEffect(() => {
    if (userId) fetchSessions();
  }, [userId, fetchSessions]);

  return {
    sessions,
    loading,
    error,
    currentDeviceId,
    fetchSessions,
    closeAllOtherSessions,
  };
}
