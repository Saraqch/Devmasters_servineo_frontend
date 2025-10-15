// src/app/become-fixer/api/services.ts
export interface NewOfferData {
  titulo: string;
  descripcion: string;
  precio: number;
  categoria: string;
}

export async function createNewOffer(data: NewOfferData) {
  try {
    const res = await fetch("http://localhost:3000/api/newoffers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, message: json.error || "Error al registrar" };
    }

    return { success: true, message: "Registrado correctamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error de conexión con el servidor" };
  }
}
