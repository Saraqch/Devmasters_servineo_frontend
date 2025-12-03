'use client';

import { useState } from 'react';
import { PillButton } from '../Pill-button';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  Calendar,
  Building2,
  Loader2,
} from 'lucide-react';
import { ICertification } from '@/types/fixer-profile';
import { Modal } from '@/Components/Modal';
import { useForm } from 'react-hook-form';
// Importamos tu componente de notificaciones
import NotificationModal from '@/Components/Modal-notifications';
import {
  useGetCertificationsByFixerQuery,
  useCreateCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
} from '@/app/redux/services/certifications';

interface CertificationsSectionProps {
  readOnly?: boolean;
  fixerId?: string;
}

// Interfaz para el estado de la notificación
interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  onConfirm?: () => void; // Solo necesario para el delete
}

export function CertificationsSection({ readOnly = false, fixerId }: CertificationsSectionProps) {
  // Queries y Mutations
  const { data: certs = [], isLoading } = useGetCertificationsByFixerQuery(fixerId || '', {
    skip: !fixerId,
    refetchOnMountOrArgChange: true,
  });

  const [createCertification, { isLoading: isCreating }] = useCreateCertificationMutation();
  const [updateCertification, { isLoading: isUpdating }] = useUpdateCertificationMutation();
  const [deleteCertification, { isLoading: isDeleting }] = useDeleteCertificationMutation();

  // Estados locales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<ICertification | null>(null);

  // Estado para manejar tu NotificationModal
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: undefined,
  });

  // React Hook Form
  const { register, handleSubmit, reset, setValue } = useForm<ICertification>();

  // --- Manejadores de Notificación ---
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (message: string) => {
    setNotification({
      isOpen: true,
      type: 'success',
      title: '¡Operación Exitosa!',
      message,
      onConfirm: undefined,
    });
  };

  const showError = (message: string) => {
    setNotification({
      isOpen: true,
      type: 'error',
      title: 'Ocurrió un error',
      message,
      onConfirm: undefined,
    });
  };

  // --- Lógica del Formulario ---

  const handleOpenModal = (cert?: ICertification) => {
    if (readOnly) return;

    if (cert) {
      setEditingCert(cert);
      setValue('name', cert.name);
      setValue('institution', cert.institution);
      setValue(
        'issueDate',
        cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      );
      setValue(
        'expiryDate',
        cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
      );
      setValue('credentialId', cert.credentialId);
      setValue('credentialUrl', cert.credentialUrl);
    } else {
      setEditingCert(null);
      reset({
        name: '',
        institution: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCert(null);
    reset();
  };

  const onSubmit = async (data: ICertification) => {
    if (!fixerId) return;

    try {
      if (editingCert && editingCert._id) {
        // UPDATE
        await updateCertification({
          id: editingCert._id,
          data: { ...data, fixerId },
        }).unwrap();
        showSuccess('La certificación ha sido actualizada correctamente.');
      } else {
        // CREATE
        await createCertification({
          ...data,
          fixerId,
        }).unwrap();
        showSuccess('La nueva certificación ha sido agregada.');
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showError('No se pudo guardar la certificación. Inténtalo de nuevo.');
    }
  };

  // --- Lógica de Eliminado con tu Modal ---

  // 1. Paso 1: El usuario hace clic en el botón de basura
  const handleDeleteClick = (id: string) => {
    if (readOnly) return;

    // Abrimos el modal en modo WARNING
    setNotification({
      isOpen: true,
      type: 'warning',
      title: '¿Eliminar certificación?',
      message:
        'Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminarla permanentemente?',
      onConfirm: () => confirmDelete(id), // Pasamos la función que ejecuta el borrado
    });
  };

  // 2. Paso 2: El usuario confirma en el modal
  const confirmDelete = async (id: string) => {
    try {
      await deleteCertification(id).unwrap();
      // Mostramos éxito después de borrar
      // Pequeño timeout para que la transición del modal se sienta natural
      setTimeout(() => {
        showSuccess('Certificación eliminada correctamente.');
      }, 300);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        showError('No se pudo eliminar la certificación.');
      }, 300);
    }
  };

  if (!fixerId) {
    return (
      <div className="p-4 text-center text-gray-500">
        No se puede cargar certificaciones sin un perfil de fixer.
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="p-4 text-center flex justify-center">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          {readOnly ? 'Certificaciones' : 'Mis Certificaciones'}
        </h2>
        {!readOnly && (
          <PillButton
            onClick={() => handleOpenModal()}
            className="bg-primary text-white hover:bg-blue-800 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar
          </PillButton>
        )}
      </div>

      {/* Lista de Certificaciones */}
      <div className="grid gap-4">
        {certs.length === 0 && (
          <div className="text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            No hay certificaciones registradas aún.
          </div>
        )}

        {certs.map((cert) => (
          <div
            key={cert._id}
            className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4 w-full">
                {/* Icono */}
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 border border-blue-100">
                  <Award className="h-6 w-6" />
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">{cert.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1 font-medium">
                    <Building2 className="h-4 w-4" />
                    <span>{cert.institution}</span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Emitido:{' '}
                        {new Date(cert.issueDate).toLocaleDateString(undefined, {
                          timeZone: 'UTC',
                        })}
                      </span>
                    </div>
                    {cert.expiryDate && (
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Expira:{' '}
                          {new Date(cert.expiryDate).toLocaleDateString(undefined, {
                            timeZone: 'UTC',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline text-sm mt-3 font-medium transition-colors"
                    >
                      Ver credencial <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Botones de acción (Editar / Eliminar) */}
              {!readOnly && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 md:static md:opacity-100">
                  <button
                    onClick={() => handleOpenModal(cert)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    // CAMBIO: Ahora llamamos a handleDeleteClick para abrir el modal
                    onClick={() => cert._id && handleDeleteClick(cert._id)}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Formulario (Crear/Editar) */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingCert ? 'Editar Certificación' : 'Nueva Certificación'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la certificación
            </label>
            <input
              {...register('name', { required: true })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Desarrollo Web Full Stack"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institución emisora
            </label>
            <input
              {...register('institution', { required: true })}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Udemy, Coursera, Universidad..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de emisión
              </label>
              <input
                type="date"
                {...register('issueDate', { required: true })}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración <span className="text-gray-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="date"
                {...register('expiryDate')}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de la credencial <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <input
              {...register('credentialId')}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. UC-12345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la credencial <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <input
              {...register('credentialUrl')}
              type="url"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2 border-t">
            <PillButton
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </PillButton>
            <PillButton
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) && <Loader2 className="animate-spin h-4 w-4" />}
              {isCreating || isUpdating ? 'Guardando...' : 'Guardar Certificación'}
            </PillButton>
          </div>
        </form>
      </Modal>

      {/* TU MODAL DE NOTIFICACIONES */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onConfirm={notification.onConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
