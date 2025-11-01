"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronUp, XCircle } from "lucide-react"
import { cn } from "../services/Util"

interface Option {
  label: string
  value: any
  object?: any
}

interface AutocompleteInputProps {
  id?: string
  name?: string
  label: string
  options: Option[]
  value: any
  onChange: (value: any, object?: any) => void
  placeholder?: string
  className?: string
  float?: boolean
  error?: string
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "",
  className,
  float = false,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasInteracted, setHasInteracted] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })

  const selected = options.find((opt) => opt.value === value)
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest(".dropdown-portal")
      ) {
        if (!hasInteracted && selected) {
          setSearchTerm(selected.label) // restore if user never typed
        }
        setIsOpen(false)
        setHasInteracted(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [selected, hasInteracted])

  useEffect(() => {
    if (value && !searchTerm) {
      const selectedOption = options.find(opt => opt.value === value)
      if (selectedOption) {
        setSearchTerm(selectedOption.label)
      }
    }
  }, [value, options])

  const handleFocus = () => {
    setSearchTerm("") // clear to show all options
    setIsOpen(true)
  }

  const handleClear = () => {
    onChange("", undefined)
    setSearchTerm("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleSelect = (option: Option) => {
    onChange(option.value, option.object || option)
    setSearchTerm(option.label)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    if (isOpen) {
      setIsOpen(false)
      setHasInteracted(false)
      if (selected) setSearchTerm(selected.label)
    } else {
      setSearchTerm("") // clear to show all
      setIsOpen(true)
    }
  }

  const renderDropdown = () => {
    if (!isOpen || !isMounted) return null

    return createPortal(
      <div
        className="dropdown-portal absolute bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-auto z-[9999999]"
        style={{
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: dropdownPos.width,
        }}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-gray-100",
                opt.value === value && "bg-blue-50 text-blue-600"
              )}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-gray-500">Nenhuma opção encontrada</div>
        )}
      </div>,
      document.body
    )
  }

  return (
    <div className={cn("w-full relative", className)} ref={containerRef}>
      {float && (
        <label
          className={cn(
            "absolute left-0 transition-all duration-200 ease-in-out pointer-events-none",
            searchTerm || isOpen ? "top-[10px] text-xs text-blue-600" : "top-[30px] text-sm text-gray-400"
          )}
        >
          {label}
        </label>
      )}

      {!float && (
        <label className="block mb-0 text-sm font-medium text-gray-600">{label}</label>
      )}

      <div className="relative group">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={searchTerm}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full border-b outline-none bg-transparent transition text-gray-900",
            float ? "pt-6 pb-0 placeholder-transparent" : "pt-2 pb-0 placeholder-gray-400",
            "pl-2 pr-10",
            error ? "border-red-500" : "border-gray-300 focus:border-blue-500"
          )}
          onFocus={handleFocus}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
            setHasInteracted(true)
          }}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-7 top-[30px] -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute right-2 top-[30px] -translate-y-1/2 text-gray-400"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {renderDropdown()}
    </div>
  )
}
