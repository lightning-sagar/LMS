"use client"

import type { ReactNode } from "react"

interface DirectionButtonProps {
  direction: string
  onMouseEnter: (direction: string) => void
  onMouseLeave: () => void
  children: ReactNode
  variant?: "primary" | "danger"
  className?: string
}

export const DirectionButton = ({
  direction,
  onMouseEnter,
  onMouseLeave,
  children,
  variant = "primary",
  className = "",
}: DirectionButtonProps) => {
  const baseClasses = "py-2 px-4 rounded-lg font-medium transition-colors"
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  }

  return (
    <button
      onMouseEnter={() => onMouseEnter(direction)}
      onMouseLeave={onMouseLeave}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
