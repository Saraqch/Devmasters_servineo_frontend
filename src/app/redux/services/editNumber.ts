const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/controlC/modificar-datos`;

export interface User {
  email: string;
  name?: string;
  picture?: string;
  telefono?: string;
  ubicacion?: Ubicacion;
}

export interface UpdateRequesterData {
  telefono: string;
  ubicacion: Ubicacion;
}
export interface Ubicacion {
  lat: number;
  lng: number;
  direccion: string;
  departamento: string;
  pais: string;
}

export interface RequesterData {
  requesterId: string;
  telefono: string;
  ubicacion: Ubicacion;
}

export async function obtenerDatosUsuarioLogueado(): Promise<RequesterData> {
  const token = localStorage.getItem('servineo_token');

  if (!token) {
    throw new Error('No se encontró token de autenticación.');
  }

  try {
    // 👈 URL CORREGIDA: Agregando la ruta completa del router
    const fullUrl = `${BASE_URL}/requester/data`;

    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      // Mejorar el manejo de errores para mostrar el mensaje del backend si existe
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: No se pudo cargar el perfil.`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
}
export async function actualizarDatosUsuario(
  data: UpdateRequesterData,
): Promise<{ success: boolean; message?: string; code?: string }> {
  const token = localStorage.getItem('servineo_token');

  if (!token) {
    return { success: false, message: 'No autenticado.' };
  }

  try {
    // 👈 URL CORREGIDA: Agregando la ruta completa del router
    const fullUrl = `${BASE_URL}/requester/update-profile`;

    const res = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // parseamos siempre el body (si existe)
    const responseData = await res.json().catch(() => ({}));

    // insertado: manejo específico para 409 PHONE_TAKEN
    if (res.status === 409 && responseData?.error === 'PHONE_TAKEN') {
      // devolvemos el mismo formato pero con un codigo para que el front lo detecte
      return {
        success: false,
        message: responseData.message || 'Número ya registrado',
        code: 'PHONE_TAKEN',
      };
    }
    // fin de la verifiacion especifica

    if (!res.ok) {
      return {
        success: false,
        message: responseData.message || `Error ${res.status}: No se pudo actualizar.`,
      };
    }

    return { success: true, message: 'Perfil actualizado con éxito.' };
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errAny = error as any;
    return { success: false, message: errAny?.message || 'Fallo en la conexión o servidor.' };
  }
}
