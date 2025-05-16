"use client"

import {
  Type,
  ImageIcon,
  BoxIcon as ButtonIcon,
  Columns,
  Box,
  Heading1,
  Heading2,
  ListOrdered,
  Link,
  Video,
  Map,
  FormInput,
} from "lucide-react"
import { motion } from "framer-motion"

interface ElementPreviewProps {
  type: string
}

export function ElementPreview({ type }: ElementPreviewProps) {
  const getElementDetails = () => {
    switch (type) {
      case "text":
        return { name: "Text Element", icon: Type }
      case "heading1":
        return { name: "Heading 1", icon: Heading1 }
      case "heading2":
        return { name: "Heading 2", icon: Heading2 }
      case "image":
        return { name: "Image Element", icon: ImageIcon }
      case "button":
        return { name: "Button Element", icon: ButtonIcon }
      case "container":
        return { name: "Container Element", icon: Box }
      case "columns":
        return { name: "Columns Element", icon: Columns }
      case "link":
        return { name: "Link Element", icon: Link }
      case "list":
        return { name: "List Element", icon: ListOrdered }
      case "form":
        return { name: "Form Element", icon: FormInput }
      case "video":
        return { name: "Video Element", icon: Video }
      case "map":
        return { name: "Map Element", icon: Map }
      default:
        return { name: "Unknown Element", icon: Box }
    }
  }

  const { name, icon: Icon } = getElementDetails()

  return (
    <motion.div
      className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg shadow-md min-w-[150px]"
      initial={{ opacity: 0.8, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-8 w-8 rounded-md bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
        <Icon className="h-5 w-5" />
      </div>
      <span>{name}</span>
    </motion.div>
  )
}
