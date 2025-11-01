import type React from "react"

interface RTLabelProps {
  children: React.ReactNode
  htmlFor?: string
  className?: string
}

export function RTLabel({ children, htmlFor, className = "" }: RTLabelProps) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
      {children}
    </label>
  )
}
