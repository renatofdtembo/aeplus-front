"use client"

import type React from "react"

interface RTTextareaProps {
  id?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  className?: string
  disabled?: boolean
}

export function RTTextarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
  disabled = false,
}: RTTextareaProps) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500 resize-vertical ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
    />
  )
}
