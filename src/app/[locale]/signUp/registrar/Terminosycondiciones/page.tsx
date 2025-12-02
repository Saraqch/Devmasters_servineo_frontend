'use client';
import React from "react";

export default function TerminosPage() {
    return (
        <main className="max-w-4xl mx-auto p-6 md:p-12">
            <h1 className="text-3xl font-bold mb-6 text-center">Términos y Condiciones de Uso de Servero</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. ACEPTACIÓN DE TÉRMINOS</h2>
                <p>
                    Al acceder y utilizar la aplicación Servero, el usuario acepta cumplir con los presentes Términos y Condiciones.
                    Si no está de acuerdo con ellos, deberá abstenerse de usar la plataforma.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. USO DEL SERVICIO</h2>
                <p>
                    Servineo es una plataforma digital que conecta a usuarios con proveedores independientes de servicios
                    (ejemplo: electricistas, plomeros, albañiles, pintores, entre otros).
                    El usuario reconoce que Servero no presta directamente los servicios, sino que actúa únicamente como intermediario digital.
                </p>
                <p>
                    Cada usuario es responsable de la veracidad de la información que proporciona.
                    Queda prohibido usar la plataforma para fines ilícitos, fraudulentos o contrarios al orden público.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. PRIVACIDAD</h2>
                <p>
                    La información personal proporcionada por el usuario será tratada conforme a la Política de Privacidad de Servero.
                    Los datos serán utilizados únicamente para el funcionamiento de la aplicación, la gestión de cuentas y la conexión entre requesters y fixers.
                    Servero se compromete a proteger la información del usuario, pero no se responsabiliza por accesos no autorizados derivados de negligencia del propio usuario (ejemplo: compartir contraseñas).
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. PROPIEDAD INTELECTUAL</h2>
                <p>
                    Todos los derechos sobre el nombre Servero, logotipos, diseño, interfaz y contenidos de la aplicación pertenecen a los titulares de Servero.
                    El usuario no podrá copiar, modificar, distribuir ni usar con fines comerciales ningún elemento de la plataforma sin autorización expresa.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. LIMITACIÓN DE RESPONSABILIDAD</h2>
                <p>
                    Servineo no garantiza la calidad, cumplimiento o idoneidad de los servicios ofrecidos por los proveedores registrados en la plataforma.
                    La responsabilidad por la ejecución de los trabajos recae exclusivamente en los proveedores y los usuarios que los contraten.
                    Servero no se hace responsable por daños, pérdidas o conflictos que puedan surgir entre usuarios y proveedores.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. TERMINACIÓN</h2>
                <p>
                    Servero se reserva el derecho de suspender o cancelar la cuenta de cualquier usuario que incumpla estos Términos y Condiciones o que haga un uso indebido de la aplicación.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. LEY APLICABLE</h2>
                <p>
                    Estos Términos y Condiciones se rigen por las leyes vigentes en el Estado Plurinacional de Bolivia.
                    En caso de controversia, las partes se someten a la jurisdicción de los tribunales competentes en dicho país.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">8. CONTACTO</h2>
                <p>
                    Para consultas, reclamos o sugerencias, los usuarios pueden comunicarse con el equipo de Servero a través del correo electrónico:
                    <a href="mailto:XXXXXXXX#@gmail.com" className="text-blue-600 hover:underline">XXXXXXXX#@gmail.com</a>
                </p>
            </section>
        </main>
    );
}
