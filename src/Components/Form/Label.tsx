import type { LabelHTMLAttributes, ReactNode } from "react"
import "./form.css"

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  requiredMark?: boolean
  children: ReactNode
}

const Label = ({ className, children, requiredMark, ...props }: LabelProps) => {
  return (
    <label
      className={`form-label ${className || ""}`.trim()}
      {...props}
    >
      {children}
      {requiredMark ? <span style={{ marginLeft: 2, color: "#dc2626" }}>*</span> : null}
    </label>
  )
}

export default Label
