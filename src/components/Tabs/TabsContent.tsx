import type { ReactNode } from "react"

interface TabsContentProps {
  value: string
  activeTab?: string
  className?: string
  children: ReactNode
}

const TabsContent = ({ value, activeTab, className, children }: TabsContentProps) => (
  <div
    className={`${value === activeTab ? "block" : "hidden"} ${className || ""}`}
    role="tabpanel"
    id={`panel-${value}`}
    aria-labelledby={`tab-${value}`}
  >
    {children}
  </div>
)

export default TabsContent
