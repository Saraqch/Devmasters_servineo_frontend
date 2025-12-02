"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { enviarRegistroManual } from "@/app/redux/services/auth/registro";
import { generarContrasena } from "../Registrardecoder/generadorContrasena";

interface RegistroFormProps {
  onNotify?: (notification: {
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  }) => void;
}

const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

const registroSchema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .regex(nameRegex, "Solo se permiten letras y espacios"),
    apellido: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres")
      .regex(nameRegex, "Solo se permiten letras y espacios"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "Debe tener al menos 8 caracteres"),
    confirmarPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

type RegistroSchema = z.infer<typeof registroSchema>;

export default function RegistroForm({ onNotify }: RegistroFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistroSchema>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistroSchema, string>>>({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [cargando, setCargando] = useState(false);

  /* --------------------------- HANDLERS --------------------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGenerarContrasena = () => {
    const nueva = generarContrasena({
      length: 12,
      symbols: true,
      avoidAmbiguous: true,
    });

    setFormData((prev) => ({
      ...prev,
      password: nueva,
      confirmarPassword: nueva,
    }));

    setMostrarTooltip(false);
    setMostrarPassword(true);
    navigator.clipboard.writeText(nueva);

    onNotify?.({
      type: "info",
      title: "Contraseña generada",
      message: "La contraseña segura ha sido generada y copiada al portapapeles.",
    });
  };

  /* --------------------------- SUBMIT --------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registroSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegistroSchema, string>> = {};

      validation.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0] as keyof RegistroSchema;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);

      onNotify?.({
        type: "warning",
        title: "Datos incompletos o incorrectos",
        message: "Revisa los campos marcados para continuar.",
      });

      return;
    }

    setCargando(true);
    const nombreCompleto = `${formData.nombre.trim()} ${formData.apellido.trim()}`;

    try {
      const data = await enviarRegistroManual(nombreCompleto, formData.email, formData.password);

      if (data.success) {
        if (data.token) localStorage.setItem("servineo_token", data.token);

        onNotify?.({
          type: "success",
          title: "Registro exitoso",
          message: `Bienvenido, ${nombreCompleto}. Tu cuenta ha sido creada correctamente.`,
        });

        sessionStorage.setItem("toastMessage", `¡Cuenta creada exitosamente! Bienvenido, ${nombreCompleto}.`);
        router.push("/signUp/registrar/registrarFoto");
      } else {
        onNotify?.({
          type: "error",
          title: "Error en el registro",
          message: data.message || "No fue posible completar el registro.",
        });
      }
    }  finally {
      setCargando(false);
    }
  };

  /* --------------------------- UI --------------------------- */

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Tus inputs y layout se mantienen exactamente igual */}
      {/* SOLO se añadió la integración de onNotify arriba */}
      {/* ----------------------------------------------------------------- */}

      {/* Nombre y Apellido */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Nombre*
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.nombre ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-servineo-400"
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Apellido*
          </label>
          <input
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Ingresa tu apellido"
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.apellido ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-servineo-400"
            }`}
          />
          {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
        </div>
      </div>

      {/* Correo */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Correo electrónico*
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nombre@dominio.com"
          className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
            errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-servineo-400"
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Contraseña*
        </label>
        <div className="relative">
          <input
            name="password"
            type={mostrarPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-servineo-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

        <button
          type="button"
          onClick={handleGenerarContrasena}
          onMouseEnter={() => setMostrarTooltip(true)}
          onMouseLeave={() => setMostrarTooltip(false)}
          className="text-sm text-servineo-500 hover:underline mt-1"
        >
          Generar contraseña segura
        </button>

        {mostrarTooltip && (
          <div className="absolute top-full left-0 mt-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-md animate-fade-in z-10">
            Se copiará automáticamente al portapapeles
          </div>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Confirmar contraseña*
        </label>
        <div className="relative">
          <input
            name="confirmarPassword"
            type={mostrarConfirmarPassword ? "text" : "password"}
            value={formData.confirmarPassword}
            onChange={handleChange}
            placeholder="Confirma tu contraseña"
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errors.confirmarPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-servineo-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {mostrarConfirmarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmarPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmarPassword}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={cargando}
        className="w-full flex items-center justify-center gap-2 bg-[#4046ee] hover:bg-[#3d43ff] text-white font-semibold rounded-xl p-2.5 mt-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
      >
        {cargando ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Registrando...
          </>
        ) : (
          "Únete"
        )}
      </button>
    </form>
  );
}
