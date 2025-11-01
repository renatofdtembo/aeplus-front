"use client"

import type React from "react"
import { type InputHTMLAttributes, useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { XCircle, ChevronDown, ChevronUp, Search } from "lucide-react"
import { cn } from "../services/Util"

// Interface para as opções do autocomplete
interface Option {
  label: any
  value: any
  object?: any
}

type InputType =
  | "default"
  | "text-only"
  | "number-only"
  | "phone"
  | "cpf"
  | "date"
  | "email"
  | "file"
  | "password"
  | "currency"

type DefaultInputProps = {
  id?: string
  name?: string
  top?: string
  label: string
  error?: string
  float?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  inputType?: InputType
  htmlType?: string
  mask?: string
  readOnly?: boolean
  required?: boolean
  inputvalue: any
  onChange?: (value: any) => void
  onClickIconRight?: () => void
  onValueChange?: (value: string, rawValue: any) => void
  // Props para autocomplete
  options?: Option[]
  selectedChange?: (value: any, object?: any) => void
  placeholder?: string
  currencySymbol?: string
  currencyLocale?: string
  // Nova propriedade para textarea
  textarea?: boolean
  rows?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder">

export const DefaultInput: React.FC<DefaultInputProps> = ({
  id,
  name,
  top = "0",
  label,
  error,
  float = false,
  iconLeft,
  iconRight,
  inputType = "default",
  htmlType = "text",
  mask,
  inputvalue,
  readOnly = false,
  required = false,
  className,
  onChange,
  onClickIconRight,
  onValueChange,
  // Props para autocomplete
  options = [],
  selectedChange,
  placeholder = "",
  currencySymbol = "AOA",
  currencyLocale = "pt-AO",
  // propriedade para textarea
  textarea = false,
  rows = 2,
  ...rest
}) => {
  const [internalError, setInternalError] = useState<string | null>(null)
  const [displayValue, setDisplayValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)

  // Estados para autocomplete
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Estado para posição do dropdown
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })

  // Estado para verificar se o DOM está disponível (para o Portal)
  const [isMounted, setIsMounted] = useState(false)

  const hasAutocomplete = options && options.length > 0

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Função de change para textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue, newValue);
    }
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setIsEditing(false);
    if (rest.onBlur) {
      (rest.onFocus as any)(e);
    }
  };
  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    setIsEditing(true);
    if (rest.onFocus) {
      // Precisamos converter o tipo para qualquer para evitar erros
      (rest.onFocus as any)(e);
    }
  };
  // Função para converter data para formato HTML5 (YYYY-MM-DD)
  const convertToHtml5Date = (value: string): string => {
    if (!value) return '';

    // Se já estiver no formato YYYY-MM-DD, retorna diretamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    // Tenta converter de DD/MM/YYYY para YYYY-MM-DD
    if (value.includes('/')) {
      const parts = value.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    // Se não conseguir converter, retorna string vazia
    return '';
  };

  // Função para formatar valor de moeda
  const formatCurrencyValue = (value: number): string => {
    return new Intl.NumberFormat(currencyLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Atualiza o valor de exibição quando o inputvalue muda
  useEffect(() => {
    let newValue = "";

    if (inputvalue !== undefined && inputvalue !== null) {
      if (inputType === "currency" && !isEditing) {
        const numericValue = typeof inputvalue === "number" ? inputvalue : Number.parseFloat(String(inputvalue)) || 0;
        newValue = formatCurrencyValue(numericValue);
      } else if (inputType === "date" && htmlType === "date") {
        // Para input type="date", converte para o formato YYYY-MM-DD
        newValue = convertToHtml5Date(String(inputvalue));
      } else if (hasAutocomplete) {
        const option = options.find((opt) => opt.value === inputvalue);
        newValue = option ? option.label : String(inputvalue);
      } else {
        newValue = String(inputvalue);
      }
    }

    if (newValue !== displayValue) {
      setDisplayValue(newValue);
    }
  }, [inputvalue, inputType, hasAutocomplete, options, isEditing, displayValue, htmlType]);

  useEffect(() => {
    if (hasAutocomplete) {
      const filtered = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredOptions(filtered)
    }
  }, [searchTerm, options, hasAutocomplete])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        const rect = containerRef.current!.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }

      updatePosition()

      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition, true)

      return () => {
        window.removeEventListener("resize", updatePosition)
        window.removeEventListener("scroll", updatePosition, true)
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".dropdown-portal")
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Efeito para focar no campo de busca quando o dropdown abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  const formatPhone = (value: string) => {
    const numeric = value.replace(/\D/g, "")

    if (numeric.length <= 3) {
      return numeric
    } else if (numeric.length <= 6) {
      return `${numeric.slice(0, 3)} ${numeric.slice(3)}`
    } else if (numeric.length <= 9) {
      return `${numeric.slice(0, 3)} ${numeric.slice(3, 6)} ${numeric.slice(6)}`
    } else {
      return `${numeric.slice(0, 3)} ${numeric.slice(3, 6)} ${numeric.slice(6, 9)} ${numeric.slice(9, 13)}`
    }
  }

  const formatCPF = (value: string) => {
    const numeric = value.replace(/\D/g, "")

    if (numeric.length <= 3) {
      return numeric
    } else if (numeric.length <= 6) {
      return `${numeric.slice(0, 3)}.${numeric.slice(3)}`
    } else if (numeric.length <= 9) {
      return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6)}`
    } else {
      return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6, 9)}-${numeric.slice(9, 11)}`
    }
  }

  const formatDate = (value: string, forInput: boolean = false) => {
    const numeric = value.replace(/\D/g, "");

    // Para exibição no input (formato YYYY-MM-DD)
    if (forInput && numeric.length >= 8) {
      const year = numeric.slice(4, 8);
      const month = numeric.slice(2, 4);
      const day = numeric.slice(0, 2);

      // Retorna no formato YYYY-MM-DD para inputs do tipo date
      return `${year}-${month}-${day}`;
    }

    // Para exibição normal (formato DD/MM/YYYY)
    if (numeric.length <= 2) {
      return numeric;
    } else if (numeric.length <= 4) {
      return `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
    } else {
      return `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(4, 8)}`;
    }
  }

  const applyMask = (value: string, mask: string) => {
    const raw = value.replace(/\D/g, "")

    const fixedPrefix = mask.replace(/[^+0-9]/g, "").match(/^\+?\d+/)?.[0] || ""
    const withoutPrefix = raw.startsWith(fixedPrefix.replace("+", ""))
      ? raw.slice(fixedPrefix.replace("+", "").length)
      : raw

    let result = fixedPrefix
    let rawIndex = 0

    for (let i = 0; i < mask.length; i++) {
      const maskChar = mask[i]
      if (maskChar === "#") {
        if (withoutPrefix[rawIndex]) {
          result += withoutPrefix[rawIndex]
          rawIndex++
        } else {
          break
        }
      } else if (/\d|\+/.test(maskChar)) {
        continue // já está incluído no fixedPrefix
      } else {
        result += maskChar
      }
    }

    return result
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Função para extrair apenas os dígitos de uma string
  const getDigitsOnly = (str: string): string => {
    return str.replace(/\D/g, "")
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Tratamento especial para moeda
    if (inputType === "currency") {
      // Marca que estamos editando para evitar que o useEffect sobrescreva o valor
      setIsEditing(true)

      // Obtém apenas os dígitos do valor digitado
      const digits = getDigitsOnly(inputValue)

      // Converte para número (em centavos)
      const numericValue = Number.parseInt(digits || "0", 10) / 100

      // Atualiza o valor de exibição com o que o usuário digitou
      setDisplayValue(inputValue)

      // Notifica sobre a mudança
      if (onChange) {
        onChange(numericValue)
      }

      if (onValueChange) {
        onValueChange(inputValue, numericValue.toString())
      }

      return
    }

    // Para outros tipos de input
    let formattedVal = inputValue
    let rawVal = inputValue
    let isValid = true

    switch (inputType) {
      case "number-only":
        if (/^\d*$/.test(inputValue)) {
          formattedVal = inputValue
          rawVal = inputValue
        } else {
          isValid = false
          setInternalError("Apenas números")
        }
        break

      case "text-only":
        if (/^[A-Za-zÀ-ÿ\s]*$/.test(inputValue)) {
          formattedVal = inputValue
          rawVal = inputValue
        } else {
          isValid = false
          setInternalError("Apenas letras")
        }
        break

      case "phone":
        rawVal = inputValue.replace(/\D/g, "")
        formattedVal = formatPhone(rawVal)
        break

      case "cpf":
        rawVal = inputValue.replace(/\D/g, "")
        formattedVal = formatCPF(rawVal)
        break

      case "date":
        if (htmlType === "date") {
          // Para input type="date", usa o valor diretamente (YYYY-MM-DD)
          rawVal = inputValue;
          formattedVal = inputValue;
        } else {
          // Para input type="text", formata como DD/MM/YYYY
          rawVal = inputValue.replace(/\D/g, "");
          formattedVal = formatDate(rawVal);
        }
        break

      case "email":
        rawVal = inputValue
        formattedVal = inputValue
        if (inputValue && !validateEmail(inputValue)) {
          isValid = false
          setInternalError("Email inválido")

          if (onValueChange) {
            onValueChange(formattedVal, rawVal)
          }
        }
        break

      default:
        if (mask) {
          rawVal = inputValue.replace(/\D/g, "")
          formattedVal = applyMask(rawVal, mask)
        } else {
          formattedVal = inputValue
          rawVal = inputValue
        }
    }

    if (isValid) {
      setDisplayValue(formattedVal)
      setInternalError(null)

      if (onChange) {
        onChange(rawVal)
      }

      if (onValueChange) {
        onValueChange(formattedVal, rawVal)
      }
    }
  }

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option)
    setDisplayValue(option.label)
    setSearchTerm("")
    setIsOpen(false)

    if (selectedChange) {
      selectedChange(option.value, option.object)
    }

    if (onChange) {
      console.log(option)
      onChange(option.value)
    }

    if (onValueChange) {
      onValueChange(option.label, option.object)
    }
  }

  const toggleDropdown = () => {
    if (hasAutocomplete) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        // Resetar o termo de busca quando abrir o dropdown
        setSearchTerm("")
      }
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setIsEditing(true)

    // Para campos de moeda, quando recebe foco, exibe o valor sem formatação
    if (inputType === "currency") {
      const numericValue = typeof inputvalue === "number" ? inputvalue : Number.parseFloat(String(inputvalue)) || 0
      setDisplayValue(numericValue.toString())
    }

    if (hasAutocomplete && !isOpen) {
      toggleDropdown()
    }
    if (rest.onFocus) rest.onFocus(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setIsEditing(false)

    // Para campos de moeda, quando perde foco, formata o valor
    if (inputType === "currency") {
      const numericValue = typeof inputvalue === "number" ? inputvalue : Number.parseFloat(String(inputvalue)) || 0
      setDisplayValue(formatCurrencyValue(numericValue))
    }

    setTimeout(() => {
      if (!isOpen) {
        if (hasAutocomplete && !isOpen && selectedOption && displayValue !== selectedOption.label) {
          setDisplayValue(selectedOption.label)
        }
      }
    }, 200)

    if (rest.onBlur) rest.onBlur(e)
  }

  const handleClear = () => {
    setDisplayValue("")
    setInternalError(null)
    setSelectedOption(null)
    setSearchTerm("")

    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (onChange) {
      onChange("")
    }

    if (onValueChange) {
      onValueChange("", "")
    }

    if (selectedChange) {
      selectedChange("", undefined)
    }
  }

  const errorMessage = error ?? internalError
  const hasError = !!errorMessage
  const hasValue = displayValue !== null && displayValue !== undefined && displayValue.toString().trim().length > 0

  const renderDropdown = () => {
    if (!hasAutocomplete || !isOpen || !isMounted) return null

    return createPortal(
      <div
        ref={dropdownRef}
        className="dropdown-portal bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-auto z-[10000000000]"
        style={{
          position: "absolute",
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 10000000000,
        }}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full p-2 pl-8 border border-gray-200 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:bg-gray-700 dark:placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-52 overflow-y-auto py-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white",
                  selectedOption?.value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200"
                )}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">Nenhuma opção encontrada</div>
          )}
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div className={cn(`w-full mb-1 py-${top}`, className)} ref={containerRef}>
      <div className="relative">
        {iconLeft && <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pl-2">{iconLeft}</span>}

        {float && (
          <label
            className={cn(
              "absolute left-0 transition-all duration-200 ease-in-out pointer-events-none",
              isFocused || hasValue
                ? "top-[-14px] text-xs text-blue-600 dark:text-blue-400"
                : "top-1 text-sm text-gray-400 dark:text-gray-500",
              iconLeft ? "left-0" : "left-0",
            )}
            style={{ margin: 0, padding: 0 }}
          >
            {label}
          </label>
        )}

        {!float && <label className="block mb-0 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>}

        <div className="relative group">
          {textarea ? (
            // Renderização como TextArea
            <textarea
              id={id}
              name={name}
              ref={textareaRef}
              value={displayValue}
              onChange={handleTextareaChange}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              placeholder={placeholder}
              className={cn(
                "w-full border rounded-md outline-none bg-transparent transition-colors duration-150 p-3",
                "text-gray-900 dark:text-white",
                "dark:border-gray-600 dark:bg-gray-700",
                float ? "placeholder-transparent" : "placeholder-gray-400 dark:placeholder-gray-500",
                iconLeft ? "pl-8" : "pl-3",
                iconRight ? "pr-4" : "pr-3",
                hasError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400",
                "resize-y min-h-[80px]"
              )}
              readOnly={readOnly}
              required={required}
              rows={rows || 4}
            />
          ) : (
            // Renderização como Input normal
            <>
              <input
                id={id}
                name={name}
                {...rest}
                ref={inputRef}
                type={inputType === "date" ? (htmlType || "text") : htmlType}
                value={displayValue}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                onChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClick={() => {
                  if (hasAutocomplete && !isOpen) {
                    toggleDropdown()
                  }
                }}
                placeholder={placeholder}
                className={cn(
                  "w-full border-b outline-none bg-transparent transition-colors duration-150",
                  "text-gray-900 dark:text-white",
                  "dark:border-gray-600",
                  float ? "placeholder-transparent" : "placeholder-gray-400 dark:placeholder-gray-500",
                  iconLeft ? "pl-8" : "pl-2",
                  iconRight || hasValue || hasAutocomplete ? "mr-8" : "mr-2",
                  float ? "pt-6 pb-2" : "pt-2 pb-2 ",
                  hasError
                    ? "border-red-500 focus:border-red-500 dark:border-red-500 dark:focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400",
                  inputType === "currency" ? "text-right" : "",
                )}
                style={{ margin: 0, padding: 0 }}
                readOnly={readOnly || (hasAutocomplete && isOpen)}
                required={required}
              />

              {inputType === "currency" && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  {currencySymbol}
                </span>
              )}
            </>
          )}

          {/* Botões de ação (só aparecem para inputs normais, não para textareas) */}
          {!textarea && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 flex items-center gap-1">
              {hasValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Limpar campo"
                >
                  <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              )}

              {hasAutocomplete && (
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none ml-1"
                  aria-label={isOpen ? "Fechar opções" : "Abrir opções"}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}

              {iconRight && <span className="text-gray-400 dark:text-gray-500" onClick={onClickIconRight}>{iconRight}</span>}
            </div>
          )}

          {/* Para textareas, mostramos o botão de limpar abaixo do campo */}
          {textarea && hasValue && (
            <div className="absolute right-2 bottom-2">
              <button
                type="button"
                onClick={handleClear}
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Limpar campo"
              >
                <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {hasError && <p className="mt-1 text-sm text-red-500 dark:text-red-400 mt-[-4px]">{errorMessage}</p>}

      {renderDropdown()}
    </div>
  );
}