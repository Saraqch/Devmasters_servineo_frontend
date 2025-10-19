// src/app/jobOfert/components/CardJob.tsx
import { Card, CardContent } from "@/Components/ui/card";

interface OfferData {
  _id: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string;
  rating: number; // Añadido para el sorting por destacados
}

interface CardJobProps {
  trabajos: OfferData[];
}

const CardJob = ({ trabajos }: CardJobProps) => {
  return (
  <div className="w-full">
      <h1 className="text-lg font-semibold mb-4 border-b border-gray-400 pb-2">
        Resultados de la búsqueda
      </h1>

      {trabajos.length === 0 ? (
        <p className="text-gray-500 text-center">No se encontraron resultados</p>
      ) : (
        <div className="flex flex-col gap-4">
          {trabajos.map((t) => (
            <Card key={t._id} className="border border-gray-400">
              <CardContent className="flex flex-col sm:flex-row items-center p-2 sm:p-4 gap-2 sm:gap-0">
                <div className="w-full sm:w-28 h-28 border border-gray-400 flex items-center justify-center mb-2 sm:mb-0 sm:mr-4">
                  <span className="text-gray-400 text-xs text-center">Imagen</span>
                </div>

                <div className="flex-1 text-sm leading-relaxed w-full">
                  <h2 className="text-center font-semibold text-base mb-1 text-gray-800">
                    {t.title}
                  </h2>
                  <p><strong>Nombre:</strong> {t.fixerName}</p>
                  <p><strong>Categoría:</strong> {t.category}</p>
                  <p><strong>Descripción:</strong> {t.description}</p>
                  <p><strong>Ciudad:</strong> {t.city}</p>
                  <p><strong>Precio:</strong> Bs. {t.price}</p>
                  <p><strong>Contacto:</strong> {t.contactPhone}</p>
                  <p><strong>Calificación:</strong> {t.rating}</p>
                  <p className="mt-1 text-gray-500 text-xs">
                    Publicado: {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                  {t.tags && t.tags.length > 0 && (
                    <p className="text-xs mt-1">
                      <strong>Etiquetas:</strong> {t.tags.join(", ")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardJob;
