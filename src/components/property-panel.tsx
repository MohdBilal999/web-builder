/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { X, ChevronDown, Trash2, Copy } from "lucide-react"

import { useBuilderStore } from "@/store/builder-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "@/components/color-picker"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PropertyPanel() {
  const { selectedElementId, elements, updateElementProperties, removeElement, duplicateElement } = useBuilderStore()
  const [activeTab, setActiveTab] = useState("content")
  const { toast } = useToast()

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  if (!selectedElement) {
    return null
  }

  const handleClose = () => {
    useBuilderStore.getState().setSelectedElementId(null)
  }

  const handleDelete = () => {
    removeElement(selectedElementId!)
    toast({
      title: "Element deleted",
      description: "The selected element has been removed from your canvas.",
      duration: 2000,
    })
  }

  const handleDuplicate = () => {
    duplicateElement(selectedElementId!)
    toast({
      title: "Element duplicated",
      description: "A copy of the selected element has been created.",
      duration: 2000,
    })
  }

  return (
    <div className="w-80 bg-card border-l overflow-hidden flex-shrink-0 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            {selectedElement.type === "text" && <span className="text-xs font-bold">T</span>}
            {selectedElement.type === "heading1" && <span className="text-xs font-bold">H1</span>}
            {selectedElement.type === "heading2" && <span className="text-xs font-bold">H2</span>}
            {selectedElement.type === "button" && <span className="text-xs font-bold">B</span>}
            {selectedElement.type === "image" && <span className="text-xs font-bold">I</span>}
            {selectedElement.type === "container" && <span className="text-xs font-bold">C</span>}
            {selectedElement.type === "columns" && <span className="text-xs font-bold">G</span>}
            {selectedElement.type === "link" && <span className="text-xs font-bold">L</span>}
            {selectedElement.type === "list" && <span className="text-xs font-bold">UL</span>}
            {selectedElement.type === "form" && <span className="text-xs font-bold">F</span>}
            {selectedElement.type === "video" && <span className="text-xs font-bold">V</span>}
            {selectedElement.type === "map" && <span className="text-xs font-bold">M</span>}
          </div>
          <h2 className="font-semibold capitalize">{selectedElement.type} Properties</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 p-1 bg-muted m-4 rounded-lg">
          <TabsTrigger
            value="content"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400"
          >
            Content
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400"
          >
            Style
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="rounded-md data-[state=active]:bg-background data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="content" className="mt-0">
              <ContentProperties element={selectedElement} />
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              <StyleProperties element={selectedElement} />
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <AdvancedProperties element={selectedElement} />
            </TabsContent>
          </div>
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="flex-1 gap-2"
              title="Duplicate Element"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex-1 gap-2"
              title="Delete Element (Delete)"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Element ID: <span className="font-mono">{selectedElement.id.substring(0, 8)}</span>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

function ContentProperties({ element }: { element: any }) {
  const { updateElementProperties } = useBuilderStore()
  const { register, handleSubmit } = useForm({
    defaultValues: element.properties,
  })

  const onSubmit = (data: any) => {
    updateElementProperties(element.id, data)
  }

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-4">
      {(element.type === "text" || element.type === "heading1" || element.type === "heading2") && (
        <div className="space-y-2">
          <Label htmlFor="text" className="text-sm font-medium">
            Text Content
          </Label>
          <Textarea
            id="text"
            {...register("text")}
            defaultValue={element.properties.text || "Text content"}
            className="min-h-[100px] resize-y"
          />
        </div>
      )}

      {element.type === "button" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">
              Button Text
            </Label>
            <Input id="text" {...register("text")} defaultValue={element.properties.text || "Button"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Button URL
            </Label>
            <Input id="url" {...register("url")} defaultValue={element.properties.url || "#"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="variant" className="text-sm font-medium">
              Button Style
            </Label>
            <Select
              defaultValue={element.properties.variant || "default"}
              onValueChange={(value) => updateElementProperties(element.id, { variant: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {element.type === "image" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="src" className="text-sm font-medium">
              Image URL
            </Label>
            <Input
              id="src"
              {...register("src")}
              defaultValue={element.properties.src || "/placeholder.svg?height=200&width=400"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt" className="text-sm font-medium">
              Alt Text
            </Label>
            <Input id="alt" {...register("alt")} defaultValue={element.properties.alt || "Image description"} />
          </div>
        </>
      )}

      {element.type === "link" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">
              Link Text
            </Label>
            <Input id="text" {...register("text")} defaultValue={element.properties.text || "Link"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              URL
            </Label>
            <Input id="url" {...register("url")} defaultValue={element.properties.url || "#"} />
          </div>
        </>
      )}

      {element.type === "list" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="items" className="text-sm font-medium">
              List Items (one per line)
            </Label>
            <Textarea
              id="items"
              {...register("items")}
              defaultValue={element.properties.items || "Item 1\nItem 2\nItem 3"}
              className="min-h-[100px] resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listType" className="text-sm font-medium">
              List Type
            </Label>
            <Select
              defaultValue={element.properties.listType || "ul"}
              onValueChange={(value) => updateElementProperties(element.id, { listType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ul">Bulleted List</SelectItem>
                <SelectItem value="ol">Numbered List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {element.type === "form" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="formTitle" className="text-sm font-medium">
              Form Title
            </Label>
            <Input
              id="formTitle"
              {...register("formTitle")}
              defaultValue={element.properties.formTitle || "Contact Form"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="submitText" className="text-sm font-medium">
              Submit Button Text
            </Label>
            <Input
              id="submitText"
              {...register("submitText")}
              defaultValue={element.properties.submitText || "Submit"}
            />
          </div>
        </>
      )}

      {element.type === "video" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-sm font-medium">
              Video URL (YouTube or Vimeo)
            </Label>
            <Input
              id="videoUrl"
              {...register("videoUrl")}
              defaultValue={element.properties.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
            />
          </div>
        </>
      )}

      {element.type === "map" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              {...register("location")}
              defaultValue={element.properties.location || "New York, NY"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zoom" className="text-sm font-medium">
              Zoom Level (1-20)
            </Label>
            <Slider
              defaultValue={[element.properties.zoom || 10]}
              min={1}
              max={20}
              step={1}
              onValueChange={(value) => updateElementProperties(element.id, { zoom: value[0] })}
              className="py-2"
            />
          </div>
        </>
      )}
    </form>
  )
}

function StyleProperties({ element }: { element: any }) {
  const { updateElementProperties } = useBuilderStore()

  const handleColorChange = (color: string) => {
    updateElementProperties(element.id, { color })
  }

  const handleBgColorChange = (backgroundColor: string) => {
    updateElementProperties(element.id, { backgroundColor })
  }

  const handleFontSizeChange = (fontSize: number) => {
    updateElementProperties(element.id, { fontSize: `${fontSize}px` })
  }

  const handlePaddingChange = (padding: number) => {
    updateElementProperties(element.id, { padding: `${padding}px` })
  }

  const handleBorderRadiusChange = (borderRadius: number) => {
    updateElementProperties(element.id, { borderRadius: `${borderRadius}px` })
  }

  // Extract current values with defaults
  const currentFontSize = Number.parseInt((element.properties.fontSize || "16px").replace("px", ""))
  const currentPadding = Number.parseInt((element.properties.padding || "0px").replace("px", ""))
  const currentBorderRadius = Number.parseInt((element.properties.borderRadius || "0px").replace("px", ""))

  return (
    <div className="space-y-6">
      <Collapsible defaultOpen className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted hover:bg-muted/80 transition-colors">
          <span className="font-medium text-sm">Colors</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 space-y-4 border-t">
          {(element.type === "text" ||
            element.type === "heading1" ||
            element.type === "heading2" ||
            element.type === "button" ||
            element.type === "link") && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text Color</Label>
              <ColorPicker color={element.properties.color || "#000000"} onChange={handleColorChange} />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Background Color</Label>
            <ColorPicker color={element.properties.backgroundColor || "transparent"} onChange={handleBgColorChange} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted hover:bg-muted/80 transition-colors">
          <span className="font-medium text-sm">Dimensions</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 space-y-4 border-t">
          {(element.type === "text" ||
            element.type === "heading1" ||
            element.type === "heading2" ||
            element.type === "button" ||
            element.type === "link") && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm font-medium">Font Size</Label>
                <span className="text-xs text-muted-foreground">{currentFontSize}px</span>
              </div>
              <Slider
                defaultValue={[currentFontSize]}
                min={8}
                max={72}
                step={1}
                onValueChange={(value) => handleFontSizeChange(value[0])}
                className="py-2"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Padding</Label>
              <span className="text-xs text-muted-foreground">{currentPadding}px</span>
            </div>
            <Slider
              defaultValue={[currentPadding]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handlePaddingChange(value[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm font-medium">Border Radius</Label>
              <span className="text-xs text-muted-foreground">{currentBorderRadius}px</span>
            </div>
            <Slider
              defaultValue={[currentBorderRadius]}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => handleBorderRadiusChange(value[0])}
              className="py-2"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted hover:bg-muted/80 transition-colors">
          <span className="font-medium text-sm">Typography</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-3 space-y-4 border-t">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Weight</Label>
            <Select
              defaultValue={element.properties.fontWeight || "normal"}
              onValueChange={(value) => updateElementProperties(element.id, { fontWeight: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Text Align</Label>
            <Select
              defaultValue={element.properties.textAlign || "left"}
              onValueChange={(value) => updateElementProperties(element.id, { textAlign: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function AdvancedProperties({ element }: { element: any }) {
  const { updateElementProperties } = useBuilderStore()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      id: element.properties.id || "",
      className: element.properties.className || "",
      customCss: element.properties.customCss || "",
    },
  })

  const onSubmit = (data: any) => {
    updateElementProperties(element.id, data)
  }

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="id" className="text-sm font-medium">
          Element ID
        </Label>
        <Input id="id" {...register("id")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="className" className="text-sm font-medium">
          CSS Classes
        </Label>
        <Input id="className" {...register("className")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customCss" className="text-sm font-medium">
          Custom CSS
        </Label>
        <Textarea
          id="customCss"
          {...register("customCss")}
          className="min-h-[100px] font-mono text-sm"
          placeholder="color: red; font-weight: bold;"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="animation" className="text-sm font-medium">
          Animation
        </Label>
        <Select
          defaultValue={element.properties.animation || "none"}
          onValueChange={(value) => updateElementProperties(element.id, { animation: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="fade">Fade In</SelectItem>
            <SelectItem value="slide">Slide Up</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
            <SelectItem value="pulse">Pulse</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}
