import type React from "react"

interface RTCardProps {
  children: React.ReactNode
  className?: string
}

export function RTCard({ children, className = "" }: RTCardProps) {
  return <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>{children}</div>
}

export function RTCardHeader({ children, className = "" }: RTCardProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}>
      {children}
    </div>
  )
}

export function RTCardTitle({ children, className = "" }: RTCardProps) {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
}

export function RTCardContent({ children, className = "" }: RTCardProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}
