"use client" 

import EstadisticasTrabajos from "@/Components/fixer/Fixer-statistics";

export default function StadisticsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
                Panel de Estadísticas
            </h1>
            <div className="max-w-sm"> 
                <EstadisticasTrabajos />
            </div>
        </div>
    )
}