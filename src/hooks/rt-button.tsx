"use client"

import { CheckCircle } from "lucide-react"
import type React from "react"

export function loadSpeener(isLoader: boolean) {
  return <>
    {isLoader ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Processando...
      </>
    ) : (
      <>
        <CheckCircle className="w-4 h-4" />
        Finalizar Inscrição
      </>
    )}
  </>
}

interface RTButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "outline" | "destructive" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  type?: "button" | "submit" | "reset"
}

export function RTButton({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
  type = "button",
}: RTButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  }

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}
