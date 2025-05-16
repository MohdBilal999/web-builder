/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ArrowLeft, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface TemplateGalleryProps {
  onSelect: (elements: any[]) => void
  onClose: () => void
}

export function TemplateGallery({ onSelect, onClose }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const templates = [
    {
      id: "landing-page",
      name: "Landing Page",
      category: "Marketing",
      thumbnail: "https://th.bing.com/th/id/OIP.RFUUK7R68ObvXEAQ-yERkQHaEo?w=263&h=180&c=7&pcl=292827&r=0&o=5&dpr=1.3&pid=1.7",
      elements: [
        {
          id: "header-1",
          type: "heading1",
          layout: { x: 0, y: 0, w: 24, h: 2 },
          properties: {
            text: "Welcome to Our Website",
            textAlign: "center",
            color: "#4c1d95",
          },
        },
        {
          id: "text-1",
          type: "text",
          layout: { x: 4, y: 3, w: 16, h: 2 },
          properties: {
            text: "We provide the best services for your needs. Check out our offerings below.",
            textAlign: "center",
            color: "#6b7280",
          },
        },
        {
          id: "button-1",
          type: "button",
          layout: { x: 9, y: 6, w: 6, h: 2 },
          properties: {
            text: "Get Started",
            url: "#",
            backgroundColor: "#8b5cf6",
          },
        },
      ],
    },
    {
      id: "about-us",
      name: "About Us",
      category: "Company",
      thumbnail: "https://th.bing.com/th/id/OIP.5wXtBlXPnCKvSVMl0Ydj3gHaD4?w=328&h=180&c=7&pcl=292827&r=0&o=5&dpr=1.3&pid=1.7",
      elements: [
        {
          id: "header-2",
          type: "heading1",
          layout: { x: 0, y: 0, w: 24, h: 2 },
          properties: {
            text: "About Our Company",
            textAlign: "center",
            color: "#4c1d95",
          },
        },
        {
          id: "text-2",
          type: "text",
          layout: { x: 2, y: 3, w: 20, h: 4 },
          properties: {
            text: "Founded in 2020, our company has been dedicated to providing exceptional services to our clients. We believe in quality, innovation, and customer satisfaction.",
            color: "#6b7280",
          },
        },
        {
          id: "image-1",
          type: "image",
          layout: { x: 6, y: 8, w: 12, h: 8 },
          properties: {
            src: "https://th.bing.com/th/id/OIP.5wXtBlXPnCKvSVMl0Ydj3gHaD4?w=328&h=180&c=7&pcl=292827&r=0&o=5&dpr=1.3&pid=1.7",
            alt: "Our Team",
          },
        },
      ],
    },
    {
      id: "contact-form",
      name: "Contact Form",
      category: "Forms",
      thumbnail: "data:image/jpeg;base64,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",
      elements: [
        {
          id: "header-3",
          type: "heading1",
          layout: { x: 0, y: 0, w: 24, h: 2 },
          properties: {
            text: "Contact Us",
            textAlign: "center",
            color: "#4c1d95",
          },
        },
        {
          id: "text-3",
          type: "text",
          layout: { x: 4, y: 3, w: 16, h: 2 },
          properties: {
            text: "Have questions? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
            textAlign: "center",
            color: "#6b7280",
          },
        },
        {
          id: "form-1",
          type: "form",
          layout: { x: 6, y: 6, w: 12, h: 10 },
          properties: {
            formTitle: "Send us a message",
            submitText: "Submit",
          },
        },
      ],
    },
    {
      id: "portfolio",
      name: "Portfolio",
      category: "Personal",
      thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*heGWsFSN26KY_os7Lnvm1g.jpeg",
      elements: [
        {
          id: "header-4",
          type: "heading1",
          layout: { x: 0, y: 0, w: 24, h: 2 },
          properties: {
            text: "My Portfolio",
            textAlign: "center",
            color: "#4c1d95",
          },
        },
        {
          id: "text-4",
          type: "text",
          layout: { x: 4, y: 3, w: 16, h: 2 },
          properties: {
            text: "Check out some of my recent projects below.",
            textAlign: "center",
            color: "#6b7280",
          },
        },
        {
          id: "columns-1",
          type: "columns",
          layout: { x: 2, y: 6, w: 20, h: 8 },
          properties: {
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
          },
        },
      ],
    },
  ]

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) {
        onSelect(template.elements)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col h-screen">
      <header className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Template Gallery</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>

      <div className="p-4 border-b">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>

      <ScrollArea className="flex-1 p-6 overflow-auto min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -5 }}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "ring-2 ring-violet-500 border-violet-500"
                  : "hover:border-violet-200 dark:hover:border-violet-800"
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              <div className="relative aspect-video bg-muted">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 h-6 w-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.category}</p>
              </div>
            </motion.div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No templates found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex justify-end">
        <Button
          variant="default"
          size="lg"
          onClick={handleConfirmSelection}
          disabled={!selectedTemplate}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          Use Template
        </Button>
      </div>
    </div>
  )
}
