
"use client";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/90 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          ¿Listo para encontrar al profesional ideal?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Únete a miles de personas que ya encontraron al profesional perfecto
          para sus necesidades
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/registro"
            className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Regístrate gratis
          </Link>
          <Link
            href="/servicios"
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Ver servicios
          </Link>
        </div>
      </div>
    </section>
  );
}