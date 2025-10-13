import { Card, CardContent } from "@/components/ui/card"

interface JobData {
  _id: string;
  title: string;
  description: string;
  status: string;
  price: number;
  createdAt: string;
  comment?: string;
}

interface CardJobProps {
  trabajos: JobData[];
}

const CardJob = ({ trabajos }: CardJobProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
        Resultados de la búsqueda
      </h1>

      {trabajos.length === 0 ? (
        <p className="text-gray-500 text-center">No se encontraron resultados</p>
      ) : (
        <div className="flex flex-col gap-4">
          {trabajos.map((t) => (
            <Card key={t._id} className="border border-gray-400">
              <CardContent className="flex items-center p-4">
                <div className="w-28 h-28 border border-gray-400 flex items-center justify-center mr-4">
                  <span className="text-gray-400 text-xs text-center">Imagen</span>
                </div>

                <div className="flex-1 text-sm leading-relaxed">
                  <h2 className="text-center font-semibold text-base mb-1">
                    {t.title}
                  </h2>
                  <p><strong>Descripción:</strong> {t.description}</p>
                  <p><strong>Precio:</strong> Bs. {t.price}</p>
                  <p><strong>Estado:</strong> {t.status}</p>
                  {t.comment && <p><strong>Comentario:</strong> {t.comment}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Publicado: {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CardJob
