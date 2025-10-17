import React, { useState } from 'react'
import { Field, Label, Input, Select } from '.'
import { Modal } from '@/Components/Modal'

export type FieldOption = { label: string; value: string }
export type FieldKind = 'text' | 'email' | 'phone' | 'select' | 'file'

export interface FormFieldConfig {
  id: string
  label: string
  type: FieldKind
  placeholder?: string
  options?: FieldOption[]
}
// We use SVG for icons for the moment.
export interface FixerRegisterFormProps {
  title?: string
  fields: FormFieldConfig[]
  onSubmit?: (data: Record<string, FormDataEntryValue>) => void
}

const FixerRegisterForm: React.FC<FixerRegisterFormProps> = ({
  title = 'Registro como fixer',
  fields,
  onSubmit,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const payload: Record<string, FormDataEntryValue> = {}
    for (const [k, v] of data.entries()) payload[k] = v
    onSubmit?.(payload)
    
    setModalOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-black bg-white p-6">
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Registro enviado"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Tus datos se han enviado correctamente.</p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-2 rounded-md bg-blue-600 text-white"
              onClick={() => setModalOpen(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
      <h2 className="mb-6 text-center text-xl font-bold">{title}</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((f) => (
          <Field key={f.id} id={f.id} label={f.label}>
            {f.type === 'select' ? (
              <Select
                id={f.id}
                name={f.id}
                defaultValue=""
                className="w-full appearance-none rounded-full border-0 bg-gray-200 px-4 py-2 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {f.placeholder || 'Selecciona una opción'}
                </option>
                {(f.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : f.type === 'file' ? (
              <label className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-900">
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-gray-900"
                  >
                    <path d="M12 16V8m0 0l-3 3m3-3l3 3" strokeWidth="1.6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="4" y="3" width="16" height="18" rx="3" ry="3" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
                <span>{f.placeholder || 'Subir archivo'}</span>
                <input id={f.id} name={f.id} type="file" className="hidden" />
              </label>
            ) : (
              <Input
                id={f.id}
                name={f.id}
                type={f.type === 'phone' ? 'tel' : f.type}
                placeholder={f.placeholder}
                className="w-full rounded-full border-0 bg-gray-200 px-4 py-2 text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            )}
          </Field>
        ))}

        <button
          type="submit"
          className="w-full rounded-full bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Convertirse en Fixer
        </button>
      </form>
    </div>
  )
}

export default FixerRegisterForm
