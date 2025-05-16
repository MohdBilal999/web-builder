"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "next-themes"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCurrentColor(newColor)
    onChange(newColor)
  }

  // Modern color palette
  const colorPalette = [
    // Violet shades
    "#8b5cf6",
    "#7c3aed",
    "#6d28d9",
    "#5b21b6",
    "#4c1d95",
    // Indigo shades
    "#6366f1",
    "#4f46e5",
    "#4338ca",
    "#3730a3",
    "#312e81",
    // Pink shades
    "#ec4899",
    "#db2777",
    "#be185d",
    "#9d174d",
    "#831843",
    // Teal shades
    "#14b8a6",
    "#0d9488",
    "#0f766e",
    "#115e59",
    "#134e4a",
    // Amber shades
    "#f59e0b",
    "#d97706",
    "#b45309",
    "#92400e",
    "#78350f",
    // Gray shades
    "#000000",
    "#374151",
    "#6b7280",
    "#9ca3af",
    "#ffffff",
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full h-10 rounded-md border border-input flex items-center justify-between px-3 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
          style={{ backgroundColor: currentColor === "transparent" ? "transparent" : currentColor }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md border border-border"
              style={{
                backgroundColor: currentColor,
                backgroundImage:
                  currentColor === "transparent"
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                    : "none",
                backgroundSize: "10px 10px",
                backgroundPosition: "0 0, 5px 5px",
              }}
            />
            <span
              className={`text-sm ${theme === "dark" && currentColor !== "transparent" && isColorDark(currentColor) ? "text-white" : "text-foreground"}`}
            >
              {currentColor}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="color"
              value={currentColor === "transparent" ? "#ffffff" : currentColor}
              onChange={handleColorChange}
              className="w-full h-8"
            />
          </div>
          <div className="grid grid-cols-6 gap-1">
            {colorPalette.map((presetColor) => (
              <button
                key={presetColor}
                className="w-8 h-8 rounded-md border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  setCurrentColor(presetColor)
                  onChange(presetColor)
                }}
              />
            ))}
          </div>
          <button
            className="w-full text-xs text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => {
              setCurrentColor("transparent")
              onChange("transparent")
            }}
          >
            Transparent
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Helper to determine if a color is dark
function isColorDark(color: string): boolean {
  // For hex colors
  if (color.startsWith("#")) {
    const r = Number.parseInt(color.slice(1, 3), 16)
    const g = Number.parseInt(color.slice(3, 5), 16)
    const b = Number.parseInt(color.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 128
  }
  return false
}
