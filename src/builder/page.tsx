/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { motion, AnimatePresence } from "framer-motion"
import {
  Save,
  FileJson,
  Eye,
  EyeOff,
  Home,
  Undo,
  Redo,
  Laptop,
  Smartphone,
  Tablet,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useHotkeys } from "react-hotkeys-hook"

import { useBuilderStore } from "@/store/builder-store"
import Sidebar from "@/components/sidebar"
import Canvas from "@/components/canvas"
import PropertyPanel from "@/components/property-panel"
import { Button } from "@/components/ui/button"
import { ElementPreview } from "@/components/element-preview"
import { ModeToggle } from "@/components/mode-toggle"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { LoadingScreen } from "@/components/loading-screen"
import { TemplateGallery } from "@/components/template-gallery"

export default function WebsiteBuilder() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)

  const { toast } = useToast()
  const {
    selectedElementId,
    setSelectedElementId,
    exportLayout,
    importLayout,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBuilderStore()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useHotkeys("ctrl+z", () => canUndo && undo())
  useHotkeys("ctrl+y", () => canRedo && redo())
  useHotkeys("ctrl+s", (e) => {
    e.preventDefault()
    handleSaveLayout()
  })
  useHotkeys("ctrl+p", (e) => {
    e.preventDefault()
    togglePreviewMode()
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    setActiveType(active.data.current?.type || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event

    if (over && over.id === "canvas-droppable" && activeType) {
      const { left, top } = over.rect
      useBuilderStore.getState().addElement(activeType, {
        x: Math.floor(left / 20),
        y: Math.floor(top / 20),
      })

      toast({
        title: "Element added",
        description: `Added ${activeType} to canvas.`,
        duration: 2000,
      })
    }

    setActiveId(null)
    setActiveType(null)
  }

  const handleSaveLayout = () => {
    const layoutData = exportLayout()
    const dataStr = JSON.stringify(layoutData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const link = document.createElement("a")
    link.setAttribute("href", dataUri)
    link.setAttribute("download", "layout.json")
    link.click()

    toast({ title: "Layout saved", description: "Layout saved successfully.", duration: 2000 })
  }

  const handleLoadLayout = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target?.result as string)
            importLayout(json)
            toast({ title: "Layout loaded", duration: 2000 })
          } catch {
            toast({
              title: "Error",
              description: "Invalid layout file.",
              variant: "destructive",
              duration: 3000,
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
    setSelectedElementId(null)
    toast({
      title: isPreviewMode ? "Edit mode enabled" : "Preview mode enabled",
      description: isPreviewMode
        ? "You can now edit your website."
        : "You are now in preview mode.",
      duration: 2000,
    })
  }

  const handleTemplateSelect = (templateElements: any[]) => {
    importLayout({ elements: templateElements })
    setShowTemplates(false)
    toast({ title: "Template applied", duration: 2000 })
  }

  if (isLoading) return <LoadingScreen />
  if (showTemplates)
    return <TemplateGallery onSelect={handleTemplateSelect} onClose={() => setShowTemplates(false)} />

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-card border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 text-white flex items-center justify-center rounded font-bold">
            WB
          </div>
          <h1 className="text-xl font-bold text-indigo-600">WebBuilder</h1>
        </div>

        <div className="flex items-center">
          <Tabs value={viewportSize} onValueChange={(v) => setViewportSize(v as any)} className="mr-4">
            <TabsList>
              <TabsTrigger value="desktop"><Laptop className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="tablet"><Tablet className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="mobile"><Smartphone className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={undo} disabled={!canUndo}><Undo /></Button>
            <Button variant="outline" size="icon" onClick={redo} disabled={!canRedo}><Redo /></Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/">
            <Button variant="ghost" size="sm"><Home /> Home</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>Templates</Button>
          <Button variant="outline" size="sm" onClick={togglePreviewMode}>
            {isPreviewMode ? <EyeOff /> : <Eye />}
            {isPreviewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadLayout}><FileJson /> Load</Button>
          <Button variant="default" size="sm" onClick={handleSaveLayout}><Save /> Save</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <AnimatePresence>
            {!isPreviewMode && (
              <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}>
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1 overflow-auto">
            <Canvas isPreviewMode={isPreviewMode} viewportSize={viewportSize} />
          </main>

          <AnimatePresence>
            {!isPreviewMode && selectedElementId && (
              <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}>
                <PropertyPanel />
              </motion.div>
            )}
          </AnimatePresence>

          <DragOverlay>
            {activeId && activeType && (
              <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
                <ElementPreview type={activeType} />
              </motion.div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
