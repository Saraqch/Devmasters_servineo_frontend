import type { ReactNode } from "react"

export interface TabsTriggerProps {
  value: string
  activeTab?: string
  onValueChange?: (value: string) => void
  className?: string
  children: ReactNode
}

const TabsTrigger = ({ value, activeTab, onValueChange, className, children }: TabsTriggerProps) => {
  const isActive = value === activeTab

  return (
    <button
      id={`tab-${value}`}
      type="button"
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
        isActive
          ? "bg-blue-700 text-white shadow-sm"
          : "text-gray-900 hover:bg-gray-100"
      } ${className || ""}`}
      onClick={() => onValueChange?.(value)}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </button>
  )
}

export default TabsTrigger;
