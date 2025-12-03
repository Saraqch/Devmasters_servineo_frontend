'use client';

import { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { vincularCorreoContrasena, Client } from '@/app/redux/services/services/api';
import { z } from 'zod';

const schema = z
  .object({
    email: z.string().email('Debe ser un correo electrónico válido.'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula.')
      .regex(/[a-z]/, 'Debe contener al menos una letra minúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.')
      .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo.'),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['repeatPassword'],
  });

interface VincularCorreoProps {
  token: string;
  onLinked?: (client?: Client) => void;
}

export default function VincularCorreo({ token, onLinked }: VincularCorreoProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRepeatPassword, setMostrarRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar dinámicamente al escribir
  const validarCampo = (campo: string, valor: string) => {
    const data = { email, password, repeatPassword, [campo]: valor };
    const result = schema.safeParse(data);

    if (!result.success) {
      const issues = result.error.issues.filter((i) => i.path[0] === campo);
      if (issues.length > 0) {
        setErrors((prev) => ({ ...prev, [campo]: issues[0].message }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[campo];
          return newErrors;
        });
      }
    } else {
      setErrors({});
    }
  };

  const handleVincular = async () => {
    const result = schema.safeParse({ email, password, repeatPassword });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      toast.error('Por favor, corrige los errores del formulario.');
      return;
    }

    setLoading(true);
    const response = await vincularCorreoContrasena(token, email, password);
    setSuccess(response.success);

    if (response.success) {
      toast.success(response.message);
      onLinked?.(response.client);
      setMostrarFormulario(false);
      setEmail('');
      setPassword('');
      setRepeatPassword('');
      setErrors({});
    } else {
      toast.error(response.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 align-middle">
          <Mail size={28} className="text-gray-800" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Correo y contraseña</span>
            <span className="text-xs text-gray-500">Vincula tu cuenta con credenciales</span>
          </div>
        </div>

        <button
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {mostrarFormulario ? 'Cancelar' : 'Vincular'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {/* Correo */}
          <div className="mb-3">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validarCampo('email', e.target.value);
              }}
              className={`border rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div className="relative mb-3">
            <input
              type={mostrarPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validarCampo('password', e.target.value);
              }}
              className={`border rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Repetir contraseña */}
          <div className="relative mb-3">
            <input
              type={mostrarRepeatPassword ? 'text' : 'password'}
              placeholder="Repetir contraseña"
              value={repeatPassword}
              onChange={(e) => {
                setRepeatPassword(e.target.value);
                validarCampo('repeatPassword', e.target.value);
              }}
              className={`border rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${
                errors.repeatPassword ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setMostrarRepeatPassword(!mostrarRepeatPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {mostrarRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.repeatPassword && (
              <p className="text-red-600 text-xs mt-1">{errors.repeatPassword}</p>
            )}
          </div>

          {/* Botón confirmar */}
          <button
            onClick={handleVincular}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Vinculando...' : 'Confirmar Vinculación'}
          </button>

          {success && (
            <p className="mt-3 text-sm text-green-600 font-medium">Vinculación exitosa.</p>
          )}
        </div>
      )}
    </div>
  );
}
