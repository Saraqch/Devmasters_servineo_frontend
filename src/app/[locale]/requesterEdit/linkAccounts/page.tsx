"use client";

import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  obtenerMetodosCliente,
  desvincularMetodo,
  AuthProvider,
} from "@/app/redux/services/services/api";
import VincularCorreo from "./vinculoCuenta/vincularCorreo";
import VincularGoogle from "./vinculoCuenta/vincularGoogle";
import VincularGithub from "./vinculoCuenta/vincularGithub";
import VincularDiscord from "./vinculoCuenta/vincularDiscord";


interface Props {
  token?: string;
}

const ALL_PROVIDERS_META = [
  { provider: "google", name: "Google" },
  { provider: "github", name: "GitHub" },
  { provider: "email", name: "Correo Electrónico" },
  { provider: "discord", name: "Discord" },
] as const;

interface FullAuthProvider extends AuthProvider {
  isLinked: boolean;
  name: string;
}

export default function AccountLoginSettings({ token = "" }: Props) {
  const [methods, setMethods] = useState<FullAuthProvider[]>([]);

  const buildFullMethodsList = (
    linkedMethodsFromAPI: AuthProvider[]
  ): FullAuthProvider[] => {
    const linkedMethodsMap = new Map<string, AuthProvider>(
      linkedMethodsFromAPI.map((m) => [m.provider, m])
    );

    return ALL_PROVIDERS_META.map((p) => {
      const linkedData = linkedMethodsMap.get(p.provider);
      return {
        provider: p.provider,
        name: p.name,
        isLinked: !!linkedData,
        email: linkedData?.email,
        token: linkedData?.token,
      };
    });
  };

  useEffect(() => {
    async function fetchMethods() {
      try {
        const linkedMethodsFromAPI = await obtenerMetodosCliente();
        const fullList = buildFullMethodsList(linkedMethodsFromAPI);
        setMethods(fullList);
      } catch (err) {
        console.error("Error al cargar métodos:", err);
      }
    }
    fetchMethods();
  }, [token]);

  const linkedMethods = methods.filter((m) => m.isLinked);
  const availableMethods = methods.filter((m) => !m.isLinked);

  const handleLink = async (provider: string) => {
    try {
      const updatedLinkedMethods = await obtenerMetodosCliente();
      const fullList = buildFullMethodsList(updatedLinkedMethods);
      setMethods(fullList);
    } catch (err) {
      console.error(err);
      alert(
        `Error al vincular el método ${provider}: ${
          err instanceof Error ? err.message : "Desconocido"
        }`
      );
    }
  };

  const handleUnlink = async (provider: string) => {
    if (linkedMethods.length <= 1) {
      alert("Debes tener al menos un método activo.");
      return;
    }
    if (window.confirm(`¿Desvincular ${provider}?`)) {
      try {
        const updatedLinkedMethods = await desvincularMetodo(provider);
        const fullList = buildFullMethodsList(updatedLinkedMethods);
        setMethods(fullList);
      } catch (err) {
        console.error(err);
        alert(
          `Error al desvincular método ${provider}: ${
            err instanceof Error ? err.message : "Desconocido"
          }`
        );
      }
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md p-8 mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Configuración de Cuentas Vinculadas
      </h1>

      {/* Métodos vinculados */}
      <section className="mb-10">
  <h2 className="text-lg font-semibold text-gray-800 mb-3">
    Cuentas Vinculadas ({linkedMethods.length})
  </h2>

  <div className="space-y-3">
    {linkedMethods.map((method) => {
      return (
        <div
          key={method.provider}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            {/* Íconos con mismo estilo que los componentes de vinculación */}
            {method.provider === "google" && (
              <FcGoogle size={30} />
            )}
            {method.provider === "github" && (
              <FaGithub size={30} className="text-gray-800" />
            )}
            {method.provider === "email" && (
              <Mail size={28} className="text-gray-800" />
            )}
            {method.provider === "discord" && (
              <FaDiscord size={30} className="text-[#5865F2]" />
            )}

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                {method.name}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              </span>
              {method.email && (
                <span className="text-xs text-gray-500 mt-0.5">{method.email}</span>
              )}
            </div>
          </div>

          {/* Botón de Desvincular con estilo coherente */}
          <button
            onClick={() => handleUnlink(method.provider)}
            disabled={linkedMethods.length <= 1}
            className={`flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition disabled:opacity-60 ${
              linkedMethods.length <= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Desvincular
          </button>
        </div>
      );
    })}
  </div>
</section>



      {/* Métodos disponibles */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Métodos Disponibles ({availableMethods.length})
        </h2>

        {availableMethods.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Todos los métodos están actualmente vinculados.
          </p>
        ) : (
          <div className="space-y-3">
            {availableMethods.map((method) => {
              if (method.provider === "google") {
                return (
                  <VincularGoogle
                    key="google"
                    tokenUsuario={token}
                    onLinked={() => handleLink("google")}
                  />
                );
              }

              if (method.provider === "github") {
                return (
                  <VincularGithub
                    key="github"
                    onLinked={() => handleLink("github")}
                  />
                );
              }

              if (method.provider === "discord") {
                return (
                  <VincularDiscord
                    key="discord"
                    onLinked={() => handleLink("discord")}
                  />
                );
              }
              if (method.provider === "email") {
                // Aquí reemplazamos el botón por el formulario directo
                return (
                  <VincularCorreo
                    key="email"
                    token={token}
                    onLinked={(client) => {
                      if (!client) return; 
                      const fullList = buildFullMethodsList(client.authProviders);
                      setMethods(fullList);
                    }}

                  />
                );
              }

              return null;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
