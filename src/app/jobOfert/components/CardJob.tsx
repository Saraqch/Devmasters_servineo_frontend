import { Card, CardContent } from "@/components/ui/card"

const CardJob = () => {
  const trabajos = [
    {
      titulo: "ALBAÑIL",
      detalle: "Albañil especializado en construcciones y refacciones",
      descripcion:
        "Realizo trabajos de construcción, revoque, colocación de cerámicas y remodelación",
      nombre: "Rodrigo Orellana",
      ubicacion: "Calle Lanza #245 - Cochabamba",
      contacto: "70XXXXXX",
    },
    {
      titulo: "CARPINTERO",
      detalle: "Carpintero especializado en muebles y reparaciones",
      descripcion:
        "Ofrezco servicios de fabricación, restauración y reparación de muebles de madera",
      nombre: "Juana Perez",
      ubicacion: "Av. Blanca Galindo - Quillacollo",
      contacto: "72XXXXXX",
    },
    {
      titulo: "CERRAJERO",
      detalle: "Cerrajero a domicilio y cambio de cerraduras",
      descripcion:
        "Apertura de puertas, cambios de cerraduras, duplicado de llaves",
      nombre: "Carlos Medina",
      ubicacion: "Av. Aniceto Arce - Cochabamba",
      contacto: "75XXXXXX",
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Título principal */}
      <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
        Resultados de la búsqueda
      </h1>

      {/* Lista de trabajos */}
      <div className="flex flex-col gap-4">
        {trabajos.map((t, index) => (
          <Card key={index} className="border border-gray-400">
            <CardContent className="flex items-center p-4">
              {/* Imagen */}
              <div className="w-28 h-28 border border-gray-400 flex items-center justify-center mr-4">
                <span className="text-gray-400 text-xs text-center">
                  Imagen
                </span>
              </div>

              {/* Información */}
              <div className="flex-1 text-sm leading-relaxed">
                <h2 className="text-center font-semibold text-base mb-1">
                  {t.titulo}
                </h2>
                <p>
                  <strong>Título:</strong> {t.detalle}
                </p>
                <p>
                  <strong>Descripción:</strong> {t.descripcion}
                </p>
                <p>
                  <strong>Nombre:</strong> {t.nombre}
                </p>
                <p>
                  <strong>Ubicación:</strong> {t.ubicacion}
                </p>
                <p className="mt-2 text-center">
                  <strong>Contacto:</strong> {t.contacto}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CardJob
