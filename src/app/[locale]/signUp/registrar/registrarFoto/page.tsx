"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "../Registrardecoder/getID";

export default function FotoPerfil() {
  const router = useRouter();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/controlC`;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const eliminarFoto = () => {
    setArchivo(null);
    setFotoPreview(null);
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const continuar = async () => {
    if (!archivo) return alert("Primero selecciona una foto");

    const usuarioId = getUserIdFromToken();
    if (!usuarioId) return alert("No se encontró el ID del usuario");

    try {
      setCargando(true);
      const fotoBase64 = await fileToBase64(archivo);

      const response = await fetch(`${BASE_URL}/foto-perfil/usuarios/foto`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, fotoPerfil: fotoBase64 }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Foto actualizada correctamente");
        router.push("/signUp/registrar/registrarUbicacion");
      } else {
        alert(data.message || "Error al subir la foto");
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-blue-50 animate-fadeInUp relative">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-xl p-10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] relative z-10">

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent">
          Foto de perfil
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Sube una foto para tu perfil
        </p>

        {/* Imagen */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border border-blue-100 shadow-lg">
            {fotoPreview ? (
              <Image
                src={fotoPreview}
                alt="Foto de perfil"
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <svg
                className="w-full h-full text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                  1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                  0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>

          <input
            id="input-foto"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={manejarCambio}
          />

          <div className="flex gap-2 mt-3">
            <label
              htmlFor="input-foto"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:opacity-90 transition"
            >
              {fotoPreview ? "Cambiar foto" : "Subir foto"}
            </label>

            {fotoPreview && (
              <button
                onClick={eliminarFoto}
                className="p-2 bg-red-500 text-white rounded-full hover:opacity-90 transition"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Botones navegación */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => router.push("/signUp/registrar/registrarServicios")}
            className="px-5 py-2 bg-red-500 text-white rounded-full hover:opacity-90 transition"
          >
            Atrás
          </button>

          <button
            onClick={continuar}
            disabled={!archivo || cargando}
            className={`px-5 py-2 rounded-full transition ${
              archivo
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {cargando ? "Subiendo..." : "Continuar"}
          </button>
        </div>
      </div>
    </section>
  );
}
