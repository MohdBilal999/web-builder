"use client"

import type React from "react"

import { useDroppable } from "@dnd-kit/core"
import { useState, useEffect } from "react"
import { Responsive, WidthProvider, type Layout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { motion, AnimatePresence } from "framer-motion"

import { useBuilderStore } from "@/store/builder-store"
import { ElementRenderer } from "@/components/element-renderer"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface CanvasProps {
  isPreviewMode: boolean
  viewportSize: "desktop" | "tablet" | "mobile"
}

export default function Canvas({ isPreviewMode, viewportSize }: CanvasProps) {
  const { elements, addElement, updateElementLayout, selectedElementId, setSelectedElementId, removeElement } =
    useBuilderStore()

  const { toast } = useToast()
  const [, setCurrentBreakpoint] = useState("lg")
  const [mounted, setMounted] = useState(false)

  // Fix for hydration issues with react-grid-layout
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle keyboard events for selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElementId && e.key === "Delete") {
        removeElement(selectedElementId)
        toast({
          title: "Element deleted",
          description: "The selected element has been removed from your canvas.",
          duration: 2000,
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedElementId, removeElement, toast])

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable",
    data: {
      accepts: [
        "text",
        "heading1",
        "heading2",
        "image",
        "button",
        "container",
        "columns",
        "link",
        "list",
        "form",
        "video",
        "map",
      ],
    },
  })

  const handleDrop = (e: React.DragEvent) => {
    const elementType = e.dataTransfer.getData("application/reactflow-type")
    if (elementType) {
      const canvasBounds = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - canvasBounds.left
      const y = e.clientY - canvasBounds.top

      // Convert to grid coordinates
      const gridX = Math.floor(x / 50) * 2
      const gridY = Math.floor(y / 50)

      addElement(elementType, { x: gridX, y: gridY })
    }
  }

  const handleLayoutChange = (layout: Layout[]) => {
    // Update the layout of all elements
    layout.forEach((item) => {
      updateElementLayout(item.i, {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      })
    })
  }

  const handleElementSelect = (id: string) => {
    if (!isPreviewMode) {
      setSelectedElementId(id)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas, not on an element
    if (e.target === e.currentTarget) {
      setSelectedElementId(null)
    }
  }

  // Convert elements to layout items
  const layouts = {
    lg: elements.map((element) => ({
      i: element.id,
      x: element.layout.x,
      y: element.layout.y,
      w: element.layout.w,
      h: element.layout.h,
      minW: 2,
      minH: 1,
    })),
  }

  // Set canvas width based on viewport size
  const getCanvasWidth = () => {
    switch (viewportSize) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      case "desktop":
      default:
        return "100%"
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-full w-full bg-muted overflow-auto p-4 transition-colors",
        isOver && "bg-violet-50 dark:bg-violet-900/20",
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      <motion.div
        className="bg-background rounded-xl shadow-md min-h-[calc(100vh-8rem)] mx-auto transition-all"
        style={{ width: getCanvasWidth() }}
        animate={{ width: getCanvasWidth() }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {mounted && (
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
            rowHeight={30}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={setCurrentBreakpoint}
            isDraggable={!isPreviewMode}
            isResizable={!isPreviewMode}
            compactType={null}
            margin={[10, 10]}
            containerPadding={[20, 20]}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleElementSelect(element.id)
                }}
                className={cn(
                  selectedElementId === element.id && !isPreviewMode
                    ? "ring-2 ring-violet-500 dark:ring-violet-400"
                    : "",
                )}
              >
                <ElementRenderer
                  element={element}
                  isPreviewMode={isPreviewMode}
                  isSelected={selectedElementId === element.id}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {elements.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L10 8H14L12 4Z" fill="currentColor" className="text-violet-500" />
                  <path d="M8 10L4 12L8 14V10Z" fill="currentColor" className="text-violet-500" />
                  <path d="M16 10V14L20 12L16 10Z" fill="currentColor" className="text-violet-500" />
                  <path d="M10 16H14L12 20L10 16Z" fill="currentColor" className="text-violet-500" />
                  <path d="M12 12L10 10H14L12 12Z" fill="currentColor" className="text-violet-500" />
                  <path d="M12 12L14 14H10L12 12Z" fill="currentColor" className="text-violet-500" />
                  <path d="M12 12L10 14V10L12 12Z" fill="currentColor" className="text-violet-500" />
                  <path d="M12 12L14 10V14L12 12Z" fill="currentColor" className="text-violet-500" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Your Canvas is Empty</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Drag elements from the sidebar and drop them here to start building your website.
              </p>
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Drag and drop elements here</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
