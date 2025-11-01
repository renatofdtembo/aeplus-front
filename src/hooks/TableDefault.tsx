"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import ReactDOM from "react-dom"
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

export interface TableColumn {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: "left" | "center" | "right"
}

export interface TableAction {
  label: string
  icon?: React.ReactNode
  handleClick: (row: any) => void
  variant?: "default" | "destructive" | "success"
  hidden?: (row: any) => boolean
}

interface TableDefaultProps {
  columns: TableColumn[]
  data: any[]
  actions?: TableAction[]
  fixedHeader?: boolean
  style?: "bordered" | "striped" | "minimal" | "card"
  pagination?: boolean
  addRow?: boolean
  itemsPerPage?: number
  onAddRow?: (newRow: any) => void
  selectable?: boolean
  onSelectionChange?: (selectedRows: any[]) => void
  emptyState?: React.ReactNode
  rowClassName?: (row: any, index: number) => string
  onRowClick?: (row: any, index: number) => void
  totalItems?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  loading?: boolean
}

const TableDefault: React.FC<TableDefaultProps> = ({
  columns,
  data = [],
  actions = [],
  fixedHeader = false,
  style = "bordered",
  pagination = true,
  addRow = false,
  itemsPerPage = 10,
  onAddRow,
  selectable = true,
  onSelectionChange,
  emptyState,
  rowClassName,
  onRowClick,
  totalItems = 0,
  currentPage: externalCurrentPage,
  onPageChange,
  loading = false,
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [openActionRow, setOpenActionRow] = useState<number | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [newRowData, setNewRowData] = useState<Record<string, string>>({})
  const [isAllSelected, setIsAllSelected] = useState(false)

  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage
  const setCurrentPage = onPageChange || setInternalCurrentPage

  const actionBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [actionMenuPosition, setActionMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  const MAX_VISIBLE_PAGES = 4
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = useCallback(() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    let start = currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    let end = currentPage + Math.floor(MAX_VISIBLE_PAGES / 2)

    if (start < 1) {
      start = 1
      end = MAX_VISIBLE_PAGES
    }

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, totalPages - MAX_VISIBLE_PAGES + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  const visiblePages = getVisiblePages()

  const paginatedData = pagination
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data

  const sortedData = [...paginatedData].sort((a, b) => {
    if (!sortConfig) return 0
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (aValue === bValue) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1
    return (aValue < bValue ? -1 : 1) * (sortConfig.direction === "asc" ? 1 : -1)
  })

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc"
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const toggleActions = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (openActionRow === index) {
      setOpenActionRow(null)
      setActionMenuPosition(null)
    } else {
      const btn = actionBtnRefs.current[index]
      if (btn) {
        const rect = btn.getBoundingClientRect()
        setActionMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        })
        setOpenActionRow(index)
      }
    }
  }

  const toggleSelectAll = () => {
    if (isAllSelected || selectedRows.length === sortedData.length) {
      setSelectedRows([])
      setIsAllSelected(false)
    } else {
      setSelectedRows(Array.from({ length: sortedData.length }, (_, i) => i))
      setIsAllSelected(true)
    }
  }

  const toggleRowSelection = (index: number) => {
    const newSelected = [...selectedRows]
    const position = newSelected.indexOf(index)
    if (position === -1) {
      newSelected.push(index)
    } else {
      newSelected.splice(position, 1)
    }
    setSelectedRows(newSelected)
    setIsAllSelected(newSelected.length === sortedData.length)
  }

  const handleAddRow = () => {
    if (onAddRow && Object.keys(newRowData).length > 0) {
      onAddRow(newRowData)
      setNewRowData({})
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openActionRow !== null && 
          !actionBtnRefs.current[openActionRow]?.contains(e.target as Node) &&
          !actionMenuRef.current?.contains(e.target as Node)) {
        setOpenActionRow(null)
        setActionMenuPosition(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openActionRow])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows.map(index => sortedData[index]))
    }
  }, [selectedRows, sortedData, onSelectionChange])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [totalPages, currentPage, setCurrentPage])

  const tableClasses = `min-w-full ${style === "bordered" ? "border" : ""} ${style === "minimal" ? "" : "divide-y divide-gray-200"} ${style === "card" ? "rounded-lg shadow-sm" : ""}`
  const headerClasses = `${fixedHeader ? "sticky top-0 z-10" : ""} ${style === "minimal" ? "bg-transparent" : style === "card" ? "bg-white" : "bg-gray-50"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`

  const getRowClasses = (row: any, index: number) => {
    const baseClasses = `${style === "striped" ? "even:bg-gray-50" : style === "minimal" ? "" : style === "card" ? "hover:bg-gray-50" : "hover:bg-gray-50"} transition-colors duration-150 ${selectedRows.includes(index) ? "bg-blue-50" : ""} ${onRowClick ? "cursor-pointer" : ""}`
    return rowClassName ? `${baseClasses} ${rowClassName(row, index)}` : baseClasses
  }

  return (
    <div className={`overflow-hidden ${style === "card" ? "" : "rounded-lg"} relative`}>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center justify-center z-20 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className={`overflow-x-auto ${fixedHeader ? "max-h-[600px] overflow-y-auto" : ""}`}>
        <table className={tableClasses}>
          <thead className={style === "card" ? "bg-transparent" : "bg-gray-50 dark:bg-gray-800/50 dark:backdrop-blur dark:border-b dark:border-gray-700"}>
            <tr>
              {selectable && (
                <th className={`${headerClasses} px-4 py-3 w-10 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/50 dark:backdrop-blur`}>
                  <input
                    type="checkbox"
                    checked={isAllSelected || (selectedRows.length === sortedData.length && sortedData.length > 0)}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-blue-600"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${headerClasses} px-6 py-3 sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/50 dark:backdrop-blur ${column.sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50" : ""} ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""} text-gray-900 dark:text-gray-200 font-semibold`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className={`flex items-center ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : "justify-between"}`}>
                    <span className="whitespace-nowrap">{column.label}</span>
                    {column.sortable && (
                      <span className="inline-flex flex-col ml-2">
                        <ChevronUp size={12} className={sortConfig?.key === column.key && sortConfig.direction === "asc" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"} />
                        <ChevronDown size={12} className={sortConfig?.key === column.key && sortConfig.direction === "desc" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"} />
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {actions.length > 0 && (
                <th scope="col" className={`${headerClasses} px-6 py-3 text-right sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/50 dark:backdrop-blur text-gray-900 dark:text-gray-200 font-semibold`}>
                  Ações
                </th>
              )}
            </tr>
          </thead>

          <tbody className={style === "card" ? "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" : ""}>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={getRowClasses(row, rowIndex) + " bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {selectable && (
                  <td className="px-4 py-4 whitespace-nowrap dark:text-white">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleRowSelection(rowIndex)
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600 dark:checked:border-blue-600 dark:focus:ring-blue-500 dark:text-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap dark:text-white ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""} text-gray-900 dark:text-white`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      ref={(el) => { actionBtnRefs.current[rowIndex] = el }}
                      onClick={(e) => toggleActions(rowIndex, e)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none dark:text-white"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {addRow && (
              <tr className="bg-gray-50 dark:bg-gray-800">
                {selectable && <td className="px-4 py-2"></td>}
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-2">
                    <input
                      type="text"
                      value={newRowData[col.key] || ""}
                      onChange={(e) => setNewRowData((prev) => ({ ...prev, [col.key]: e.target.value }))}
                      className="w-full border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={col.label}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddRow()
                      }}
                      disabled={Object.keys(newRowData).length === 0}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm disabled:bg-blue-300 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-900 dark:text-white"
                    >
                      Adicionar
                    </button>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>

        {sortedData.length === 0 && !loading && (
          <div className="bg-white dark:bg-gray-900 py-12 text-center text-gray-500 dark:text-gray-400 dark:text-white">
            {emptyState || "Nenhum dado disponível"}
          </div>
        )}
      </div>

      {pagination && totalPages > 1 && (
        <div className={`bg-white dark:bg-gray-900 px-4 py-3 flex flex-col sm:flex-row items-center justify-between ${style === "card" ? "border-t dark:border-t-gray-800" : "border-t border-gray-200 dark:border-gray-700"}`}>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span className="font-medium">{startItem}</span> a <span className="font-medium">{endItem}</span> de <span className="font-medium">{totalItems}</span> resultados
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
              title="Primeira página"
            >
              <ChevronsLeft size={16} className="text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              title="Página anterior"
            >
              <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md ${currentPage === page ? "bg-blue-500 text-white dark:bg-blue-600" : "border hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              title="Próxima página"
            >
              <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              title="Última página"
            >
              <ChevronsRight size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {openActionRow !== null && actionMenuPosition && ReactDOM.createPortal(
        <div
          ref={actionMenuRef}
          style={{
            position: "absolute",
            top: `${actionMenuPosition.top}px`,
            left: `${actionMenuPosition.left-180}px`,
            zIndex: 1000,
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg min-w-48"
        >
          <div className="py-1">
            {actions
              .filter(action => {
                if (typeof action.hidden === 'function') {
                  return !action.hidden(sortedData[openActionRow])
                }
                return !action.hidden
              })
              .map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    action.handleClick(sortedData[openActionRow])
                    setOpenActionRow(null)
                    setActionMenuPosition(null)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    action.variant === "destructive" ? "text-red-600 dark:text-red-400" :
                    action.variant === "success" ? "text-green-600 dark:text-green-400" :
                    "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default TableDefault