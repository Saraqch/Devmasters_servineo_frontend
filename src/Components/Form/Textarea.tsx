import React, { forwardRef, type TextareaHTMLAttributes } from "react"
import "./form.css"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => {
  const cls = [
    "form-textarea",
    error ? "form-textarea--error" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div style={{ width: "100%" }}>
      <textarea ref={ref} className={cls} {...props} />
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  )
})

Textarea.displayName = "Textarea"

export default Textarea
