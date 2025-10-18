import type { ReactNode } from "react"

interface TabsListProps {
  className?: string
  children: ReactNode
}

const TabsList = ({ className, children }: TabsListProps) => (
  <div
    className={`inline-flex items-center gap-2 rounded-xl border border-black bg-white p-1 shadow-sm mx-auto ${className || ""}`}
    role="tablist"
  >
    {children}
  </div>
)

export default TabsList
