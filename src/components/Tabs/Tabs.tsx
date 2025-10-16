import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"
import TabsTrigger, { type TabsTriggerProps } from "./TabsTrigger"
import TabsContent from "./TabsContent"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: ReactNode
}

const Tabs = ({ value, onValueChange, className, children }: TabsProps) => {
  const enhance = (node: ReactNode): ReactNode => {
    if (!isValidElement(node)) return node

    if (node.type === TabsTrigger) {
      return cloneElement(node as ReactElement<TabsTriggerProps>, {
        activeTab: value,
        onValueChange,
      })
    }

    if (node.type === TabsContent) {
      return cloneElement(node as ReactElement<{ activeTab?: string }>, {
        activeTab: value,
      })
    }

    const childProps: any = node.props ?? {}
    const nestedChildren: ReactNode = childProps.children
    if (nestedChildren) {
      return cloneElement(node as ReactElement, {
        ...childProps,
        children: Children.map(nestedChildren, enhance),
      })
    }

    return node
  }

  return <div className={`w-full ${className || ""}`}>{Children.map(children, enhance)}</div>
}

export default Tabs;
