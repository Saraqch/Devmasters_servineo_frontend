'use client';

import { useEffect, useState } from 'react';
import { PillButton } from '../Pill-button';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Modal } from '@/Components/Modal';
import NotificationModal from '@/Components/Modal-notifications';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import {
  useGetPortfolioByFixerQuery,
  useCreatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
} from '@/app/redux/services/portafolioApi';
import { isApiError } from '@/app/redux/services/baseApi';

type PortfolioFormValues = {
  type: 'image' | 'video';
  url?: string;
  youtubeUrl?: string;
};

interface PortfolioSectionProps {
  readOnly?: boolean;
  fixerId?: string;
}

function getYouTubeId(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes('youtu.be')) return url.pathname.replace('/', '');
    const vParam = url.searchParams.get('v');
    if (vParam) return vParam;
    const parts = url.pathname.split('/');
    return parts[parts.length - 1] || undefined;
  } catch {
    return undefined;
  }
}

export function PortfolioSection({ readOnly = false, fixerId }: PortfolioSectionProps) {
  const effectiveFixerId = fixerId || '69285d2860ea986813517593';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'image' | 'video'>('image');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const {
    data: items = [],
    isLoading,
    isError,
  } = useGetPortfolioByFixerQuery(effectiveFixerId, {
    skip: !effectiveFixerId,
  });

  const [createItem, { isLoading: isCreating }] = useCreatePortfolioItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeletePortfolioItemMutation();

  const { register, handleSubmit, reset, watch } = useForm<PortfolioFormValues>();
  const watchedUrl = watch('url');

  useEffect(() => {
    if (!watchedUrl || modalType !== 'image') {
      setPreviewUrl('');
      setIsValidUrl(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsValidating(true);
      const img = document.createElement('img');
      img.onload = () => {
        setIsValidUrl(true);
        setPreviewUrl(watchedUrl);
        setIsValidating(false);
      };
      img.onerror = () => {
        setIsValidUrl(false);
        setPreviewUrl('');
        setIsValidating(false);
      };
      img.src = watchedUrl;
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedUrl, modalType]);

  const getErrorMessage = (error: unknown) => {
    if (isApiError(error)) return error.data.message || 'Error desconocido';
    return 'Ocurrió un error inesperado';
  };

  const showNotification = (
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string,
  ) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const handleOpenModal = (type: 'image' | 'video') => {
    if (readOnly) return;
    setModalType(type);
    setPreviewUrl('');
    setIsValidUrl(null);
    reset({ type, url: '', youtubeUrl: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setPreviewUrl('');
    setIsValidUrl(null);
  };

  const onSubmit = async (data: PortfolioFormValues) => {
    try {
      let finalUrl = data.url;

      if (data.type === 'image') {
        if (!finalUrl) {
          showNotification('error', 'Campo requerido', 'Por favor ingresa una URL');
          return;
        }
        if (isValidUrl !== true) {
          showNotification('error', 'URL Inválida', 'La imagen no pudo cargarse.');
          return;
        }
      }

      if (data.type === 'video' && data.youtubeUrl) {
        const videoId = getYouTubeId(data.youtubeUrl);
        if (videoId) {
          if (!finalUrl) {
            finalUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        } else {
          showNotification('error', 'URL Inválida', 'No se pudo identificar el video');
          return;
        }
      }

      const payload = {
        type: data.type,
        url: finalUrl,
        youtubeUrl: data.youtubeUrl,
        fixerId: effectiveFixerId,
      };

      await createItem(payload).unwrap();

      showNotification('success', '¡Éxito!', 'Elemento agregado al portafolio');
      handleCloseModal();
    } catch (error) {
      showNotification('error', 'Error al guardar', getErrorMessage(error));
    }
  };

  const handleDeleteRequest = (id: string) => {
    if (readOnly) return;
    setDeleteId(id);
    showNotification(
      'warning',
      '¿Estás seguro?',
      'Esta acción eliminará el elemento permanentemente.',
    );
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem(deleteId).unwrap();
      showNotification('success', 'Eliminado', 'Elemento eliminado correctamente');
      setDeleteId(null);
    } catch (error) {
      showNotification('error', 'Error', getErrorMessage(error));
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  if (isLoading) return <div className="text-center p-8 text-gray-500">Cargando portafolio...</div>;
  if (isError)
    return <div className="text-center p-8 text-red-500">Error al cargar el portafolio.</div>;

  return (
    <div className="space-y-6">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        type={notification.type as 'success' | 'error' | 'warning'}
        title={notification.title}
        message={notification.message}
        autoClose={notification.type !== 'warning'}
        autoCloseDelay={5000}
        onConfirm={deleteId ? confirmDelete : undefined}
        onCancel={deleteId ? cancelDelete : undefined}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          {readOnly ? 'Portafolio' : 'Mi Portafolio'}
        </h2>

        {!readOnly && (
          <div className="flex gap-2">
            <PillButton
              onClick={() => handleOpenModal('video')}
              className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Video
            </PillButton>

            <PillButton
              onClick={() => handleOpenModal('image')}
              className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Imagen
            </PillButton>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No hay elementos en el portafolio aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const isVideo = item.type === 'video';
            const videoId = getYouTubeId(item.youtubeUrl || undefined);
            const hasUrl = item.url && item.url.trim() !== '';
            const isDataUrl = hasUrl && item.url!.startsWith('data:');
            const isHttpUrl =
              hasUrl && (item.url!.startsWith('http://') || item.url!.startsWith('https://'));

            return (
              <div
                key={item._id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                {/* BOTÓN DE ELIMINAR ARRIBA A LA DERECHA */}
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRequest(item._id!);
                    }}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 z-10 p-2 bg-white/90 text-red-600 rounded-full hover:bg-white transition-all shadow-md hover:scale-110 opacity-0 group-hover:opacity-100"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                {/* CONTENIDO DEL ITEM */}
                {isVideo && videoId ? (
                  <div className="absolute inset-0 w-full h-full">
                    <iframe
                      className="w-full h-full rounded-2xl"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : hasUrl ? (
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setFullscreenImage(item.url || null)}
                  >
                    {isDataUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.url!}
                        alt="Portfolio item"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : isHttpUrl ? (
                      <Image
                        src={item.url!}
                        alt="Portfolio item"
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={true}
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.url!}
                        alt="Portfolio item"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-4">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Sin imagen</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === 'image' ? 'Agregar Imagen' : 'Agregar Video'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" value={modalType} {...register('type')} />

          {modalType === 'image' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la Imagen
                </label>
                <div className="relative">
                  <input
                    {...register('url', { required: 'La URL es requerida' })}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {isValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  {!isValidating && isValidUrl === true && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                  )}
                  {!isValidating && isValidUrl === false && (
                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" />
                  )}
                </div>
                {isValidUrl === false && (
                  <p className="text-xs text-red-600 mt-1">
                    ❌ No se pudo cargar la imagen. Verifica la URL.
                  </p>
                )}
              </div>

              {previewUrl && isValidUrl && (
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                  <p className="text-xs text-green-700 mb-2 font-semibold">✅ Vista Previa:</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de YouTube
                </label>
                <input
                  {...register('youtubeUrl', { required: 'La URL es requerida' })}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Miniatura (Opcional)
                </label>
                <input
                  {...register('url')}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Se intentará extraer automáticamente si está vacío"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <PillButton
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </PillButton>

            <PillButton
              type="submit"
              className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
              disabled={(modalType === 'image' && isValidUrl !== true) || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </PillButton>
          </div>
        </form>
      </Modal>

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenImage}
              alt="Imagen completa"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
