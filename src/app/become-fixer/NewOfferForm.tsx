'use client';

import { Field, Input, Select, Textarea } from '@/Components/Form';
import { useState } from 'react';
import { createNewOffer, NewOfferData } from './api/services';
import { Modal } from '@/Components/Modal';

const NewOfferForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  const categories = [
    { label: 'Seleccione categoría', value: '' },
    { label: 'Electricidad', value: 'electricidad' },
    { label: 'Plomería', value: 'plomeria' },
    { label: 'Albañilería', value: 'albanileria' },
    { label: 'Pintura', value: 'pintura' },
  ];

  const handleSubmit = async () => {
    if (!title || !description || !price || !category) {
      setToast({ message: "Todos los campos son obligatorios", success: false });
      return;
    }

    const data: NewOfferData = {
      titulo: title,
      descripcion: description,
      precio: parseFloat(price),
      categoria: category,
    };

    const result = await createNewOffer(data);

    setToast({ message: result.message, success: result.success });

    if (result.success) {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
    }

    // desaparece después de 3s
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="relative">
      {/* Toast básico sin animaciones */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-2 shadow-lg text-white ${
            toast.success ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Formulario */}
      <div className="mx-auto w-full max-w-md rounded-xl border border-black bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-center text-xl font-bold">Nueva Oferta</h2>
        <div className="space-y-4">
          <Field id="title" label="Título de servicio">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Reparación de grifo"
              className="w-full"
            />
          </Field>
          <Field id="description" label="Descripción">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada del servicio"
              rows={4}
              className="w-full"
            />
          </Field>
          <Field id="price" label="Precio">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00 Bs"
              className="w-full"
            />
          </Field>
          <Field id="category" label="Categoría">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-4xl w-full sm:w-auto"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setTitle('');
                setDescription('');
                setPrice('');
                setCategory('');
              }}
              className="px-4 py-2 bg-gray-300 rounded-4xl w-full sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOfferForm;