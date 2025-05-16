"use client"

import type React from "react"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import {
  Type,
  ImageIcon,
  BoxIcon as ButtonIcon,
  Columns,
  Box,
  Layers,
  Palette,
  Search,
  X,
  Heading1,
  Heading2,
  ListOrdered,
  LinkIcon,
  Video,
  Map,
  FormInput,
} from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const elementCategories = [
  {
    name: "Basic",
    icon: Layers,
    elements: [
      { id: "text", name: "Text", icon: Type, description: "Add text content" },
      { id: "heading1", name: "Heading 1", icon: Heading1, description: "Add a large heading" },
      { id: "heading2", name: "Heading 2", icon: Heading2, description: "Add a medium heading" },
      { id: "image", name: "Image", icon: ImageIcon, description: "Add an image" },
      { id: "button", name: "Button", icon: ButtonIcon, description: "Add a button" },
      { id: "link", name: "Link", icon: LinkIcon, description: "Add a hyperlink" },
      { id: "list", name: "List", icon: ListOrdered, description: "Add a bulleted or numbered list" },
    ],
  },
  {
    name: "Layout",
    icon: Palette,
    elements: [
      { id: "container", name: "Container", icon: Box, description: "Group elements together" },
      { id: "columns", name: "Columns", icon: Columns, description: "Create a multi-column layout" },
    ],
  },
  {
    name: "Advanced",
    icon: FormInput,
    elements: [
      { id: "form", name: "Form", icon: FormInput, description: "Add a contact form" },
      { id: "video", name: "Video", icon: Video, description: "Embed a video" },
      { id: "map", name: "Map", icon: Map, description: "Embed a map" },
    ],
  },
]

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState(elementCategories)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (!term) {
      setFilteredCategories(elementCategories)
      return
    }

    const filtered = elementCategories
      .map((category) => ({
        ...category,
        elements: category.elements.filter(
          (element) => element.name.toLowerCase().includes(term) || element.description.toLowerCase().includes(term),
        ),
      }))
      .filter((category) => category.elements.length > 0)

    setFilteredCategories(filtered)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setFilteredCategories(elementCategories)
  }

  return (
    <aside className="w-72 bg-card border-r overflow-hidden flex-shrink-0 shadow-sm h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Elements</h2>
        <p className="text-xs text-muted-foreground mb-4">Drag and drop elements onto the canvas</p>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search elements..."
            className="w-full pl-8 pr-8 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="p-4">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <category.icon className="h-4 w-4 text-violet-500" />
                <h3 className="font-medium text-sm">{category.name}</h3>
              </div>
              <div className="space-y-3">
                {category.elements.map((element) => (
                  <DraggableElement
                    key={element.id}
                    id={element.id}
                    name={element.name}
                    description={element.description}
                    Icon={element.icon}
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No elements found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4">
          <h3 className="font-medium text-sm text-violet-800 dark:text-violet-300 mb-2">Pro Tip</h3>
          <p className="text-xs text-violet-600 dark:text-violet-400">
            Use keyboard shortcuts: Ctrl+Z to undo, Ctrl+Y to redo, and Ctrl+S to save your layout.
          </p>
        </div>
      </div>
    </aside>
  )
}

interface DraggableElementProps {
  id: string
  name: string
  description?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ElementType<any>
}

function DraggableElement({ id, name, description, Icon }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      type: id,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-grab shadow-sm hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all",
        isDragging && "opacity-50 border-violet-300 dark:border-violet-700 shadow-lg",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-9 w-9 rounded-md bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium text-sm">{name}</h4>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </motion.div>
  )
}
