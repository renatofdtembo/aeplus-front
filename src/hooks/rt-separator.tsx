interface RTSeparatorProps {
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function RTSeparator({ className = "", orientation = "horizontal" }: RTSeparatorProps) {
  return (
    <div
      className={`bg-gradient-to-r from-transparent via-gray-300 to-transparent ${
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full"
      } ${className}`}
    />
  )
}
