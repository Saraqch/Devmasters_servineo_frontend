import React, { forwardRef, type InputHTMLAttributes } from "react"
import "./form.css"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  const cls = [
    "form-input",
    error ? "form-input--error" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div style={{ width: "100%" }}>
      <input ref={ref} className={cls} {...props} />
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  )
})

Input.displayName = "Input"

export default Input
