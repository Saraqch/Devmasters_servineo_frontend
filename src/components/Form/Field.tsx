import type { ReactNode } from "react"
import Label from "./Label"

export interface FieldProps {
  id: string
  label?: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

const Field = ({ id, label, required, hint, error, className, children }: FieldProps) => {
  return (
    <div className={`w-full ${className || ""}`}>
      {label ? (
        <Label htmlFor={id} requiredMark={required} className="mb-1">
          {label}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  )
}

export default Field
