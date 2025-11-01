"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type RTAlertType = "success" | "error" | "warning" | "info"
type RTAlertPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center"

interface RTAlertMessage {
  id: string
  type: RTAlertType
  message: string
  position: RTAlertPosition
  timer?: number
}

const RT_ALERT_CONTAINER_ID = "rt-alert-container"

function createRTAlertContainer() {
  let container = document.getElementById(RT_ALERT_CONTAINER_ID)
  if (!container) {
    container = document.createElement("div")
    container.id = RT_ALERT_CONTAINER_ID
    document.body.appendChild(container)
  }
  return container
}

let addRTAlertToList: (alert: RTAlertMessage) => void = () => {}

// API pública para exibir alertas RT
export const rtalert = {
  success: (msg: string, position: RTAlertPosition = "top-right", timer?: number) =>
    showRTAlert("success", msg, position, timer),
  error: (msg: string, position: RTAlertPosition = "top-right", timer?: number) =>
    showRTAlert("error", msg, position, timer),
  warning: (msg: string, position: RTAlertPosition = "top-right", timer?: number) =>
    showRTAlert("warning", msg, position, timer),
  info: (msg: string, position: RTAlertPosition = "top-right", timer?: number) =>
    showRTAlert("info", msg, position, timer),
}

function showRTAlert(type: RTAlertType, message: string, position: RTAlertPosition, timer?: number) {
  const id = Date.now().toString()
  addRTAlertToList({ id, type, message, position, timer })
}

const positionStyles: Record<RTAlertPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
}

const alertStyles: Record<RTAlertType, string> = {
  success: "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white",
  error: "bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white",
  warning: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black",
  info: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white",
}

export const RTAlertManager = () => {
  const [alerts, setAlerts] = useState<RTAlertMessage[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    addRTAlertToList = (alert: RTAlertMessage) => {
      setAlerts((prev) => [...prev, alert])

      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
      }, alert.timer ?? 5000)
    }
  }, [])

  if (!mounted) return null

  const grouped = alerts.reduce(
    (acc, alert) => {
      acc[alert.position] = [...(acc[alert.position] || []), alert]
      return acc
    },
    {} as Record<RTAlertPosition, RTAlertMessage[]>,
  )

  return createPortal(
    <>
      {Object.entries(grouped).map(([position, group]) => (
        <div key={position} className={`fixed z-[99999] space-y-4 ${positionStyles[position as RTAlertPosition]}`}>
          {group.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-4 px-6 py-4 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer ${alertStyles[alert.type]}`}
            >
              <span className="text-xl">
                {
                  {
                    success: "✅",
                    error: "❌",
                    warning: "⚠️",
                    info: "ℹ️",
                  }[alert.type]
                }
              </span>
              <span className="text-sm font-medium">RT: {alert.message}</span>
              <button
                className="ml-4 text-lg hover:text-opacity-70"
                onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
              >
                ✖️
              </button>
            </div>
          ))}
        </div>
      ))}
    </>,
    createRTAlertContainer(),
  )
}
