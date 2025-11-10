import type React from "react"
type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function PillButton(props: PillButtonProps) {
  const { className = "", ...rest } = props
  return (
    <button
      {...rest}
      className={"rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none " + className}
    />
  )
}
