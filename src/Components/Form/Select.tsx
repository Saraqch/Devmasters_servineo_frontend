import React, { forwardRef, type SelectHTMLAttributes } from "react"
import "./form.css"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, children, ...props }, ref) => {
  const cls = [
    "form-select",
    error ? "form-select--error" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div style={{ width: "100%" }}>
      <select ref={ref} className={cls} {...props}>
        {children}
      </select>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  )
})

Select.displayName = "Select"

export default Select
