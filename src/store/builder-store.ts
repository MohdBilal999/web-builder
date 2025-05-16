/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import { produce } from "immer"

interface ElementLayout {
  x: number
  y: number
  w: number
  h: number
}

interface Element {
  id: string
  type: string
  layout: ElementLayout
  properties: Record<string, any>
}

interface HistoryState {
  past: Element[][]
  present: Element[]
  future: Element[][]
}

interface BuilderStore {
  elements: Element[]
  selectedElementId: string | null
  history: HistoryState
  canUndo: boolean
  canRedo: boolean
  addElement: (type: string, position: { x: number; y: number }) => void
  updateElementLayout: (id: string, layout: Partial<ElementLayout>) => void
  updateElementProperties: (id: string, properties: Record<string, any>) => void
  removeElement: (id: string) => void
  duplicateElement: (id: string) => void
  setSelectedElementId: (id: string | null) => void
  exportLayout: () => any
  importLayout: (data: any) => void
  undo: () => void
  redo: () => void
}

// Default properties for each element type
const defaultProperties = {
  text: {
    text: "Text content",
    color: "#000000",
    fontSize: "16px",
    padding: "8px",
  },
  heading1: {
    text: "Heading 1",
    color: "#000000",
    fontSize: "32px",
    padding: "8px",
    fontWeight: "bold",
  },
  heading2: {
    text: "Heading 2",
    color: "#000000",
    fontSize: "24px",
    padding: "8px",
    fontWeight: "semibold",
  },
  button: {
    text: "Button",
    url: "#",
    color: "#ffffff",
    backgroundColor: "#8b5cf6",
    fontSize: "16px",
    padding: "8px 16px",
    borderRadius: "4px",
    variant: "default",
  },
  image: {
    src: "/placeholder.svg?height=200&width=400",
    alt: "Image",
    padding: "0px",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
  },
  columns: {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
  },
  link: {
    text: "Link",
    url: "#",
    color: "#8b5cf6",
    fontSize: "16px",
    padding: "4px",
  },
  list: {
    items: "Item 1\nItem 2\nItem 3",
    listType: "ul",
    color: "#000000",
    fontSize: "16px",
    padding: "8px",
  },
  form: {
    formTitle: "Contact Form",
    submitText: "Submit",
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  video: {
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    padding: "0px",
  },
  map: {
    location: "New York, NY",
    zoom: 10,
    padding: "0px",
  },
}

// Default sizes for each element type
const defaultSizes = {
  text: { w: 12, h: 2 },
  heading1: { w: 24, h: 2 },
  heading2: { w: 20, h: 2 },
  button: { w: 6, h: 2 },
  image: { w: 12, h: 8 },
  container: { w: 12, h: 8 },
  columns: { w: 12, h: 8 },
  link: { w: 6, h: 1 },
  list: { w: 12, h: 6 },
  form: { w: 12, h: 10 },
  video: { w: 12, h: 8 },
  map: { w: 12, h: 8 },
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  elements: [],
  selectedElementId: null,
  history: {
    past: [],
    present: [],
    future: [],
  },
  canUndo: false,
  canRedo: false,

  addElement: (type, position) => {
    const id = uuidv4()
    const { w, h } = defaultSizes[type as keyof typeof defaultSizes] || { w: 6, h: 4 }

    set(
      produce((state: BuilderStore) => {
        // Save current state to history
        state.history.past.push([...state.history.present])
        state.history.future = []
        state.canUndo = true
        state.canRedo = false

        // Add new element
        const newElement = {
          id,
          type,
          layout: {
            x: position.x,
            y: position.y,
            w,
            h,
          },
          properties: {
            ...(defaultProperties[type as keyof typeof defaultProperties] || {}),
          },
        }

        state.elements.push(newElement)
        state.history.present = [...state.elements]
        state.selectedElementId = id
      }),
    )
  },

  updateElementLayout: (id, layout) => {
    set(
      produce((state: BuilderStore) => {
        // Save current state to history
        state.history.past.push([...state.history.present])
        state.history.future = []
        state.canUndo = true
        state.canRedo = false

        // Update element layout
        const elementIndex = state.elements.findIndex((element) => element.id === id)
        if (elementIndex !== -1) {
          state.elements[elementIndex].layout = {
            ...state.elements[elementIndex].layout,
            ...layout,
          }
          state.history.present = [...state.elements]
        }
      }),
    )
  },

  updateElementProperties: (id, properties) => {
    set(
      produce((state: BuilderStore) => {
        // Save current state to history
        state.history.past.push([...state.history.present])
        state.history.future = []
        state.canUndo = true
        state.canRedo = false

        // Update element properties
        const elementIndex = state.elements.findIndex((element) => element.id === id)
        if (elementIndex !== -1) {
          state.elements[elementIndex].properties = {
            ...state.elements[elementIndex].properties,
            ...properties,
          }
          state.history.present = [...state.elements]
        }
      }),
    )
  },

  removeElement: (id) => {
    set(
      produce((state: BuilderStore) => {
        // Save current state to history
        state.history.past.push([...state.history.present])
        state.history.future = []
        state.canUndo = true
        state.canRedo = false

        // Remove element
        state.elements = state.elements.filter((element) => element.id !== id)
        state.history.present = [...state.elements]
        if (state.selectedElementId === id) {
          state.selectedElementId = null
        }
      }),
    )
  },

  duplicateElement: (id) => {
    set(
      produce((state: BuilderStore) => {
        // Find the element to duplicate
        const elementToDuplicate = state.elements.find((element) => element.id === id)
        if (!elementToDuplicate) return

        // Save current state to history
        state.history.past.push([...state.history.present])
        state.history.future = []
        state.canUndo = true
        state.canRedo = false

        // Create a duplicate with a new ID and slightly offset position
        const newId = uuidv4()
        const newElement = {
          ...elementToDuplicate,
          id: newId,
          layout: {
            ...elementToDuplicate.layout,
            x: elementToDuplicate.layout.x + 1,
            y: elementToDuplicate.layout.y + 1,
          },
        }

        state.elements.push(newElement)
        state.history.present = [...state.elements]
        state.selectedElementId = newId
      }),
    )
  },

  setSelectedElementId: (id) => {
    set({ selectedElementId: id })
  },

  exportLayout: () => {
    return {
      elements: get().elements,
    }
  },

  importLayout: (data) => {
    if (data && data.elements) {
      set(
        produce((state: BuilderStore) => {
          // Save current state to history
          state.history.past.push([...state.history.present])
          state.history.future = []
          state.canUndo = true
          state.canRedo = false

          // Import new elements
          state.elements = data.elements
          state.history.present = [...state.elements]
          state.selectedElementId = null
        }),
      )
    }
  },

  undo: () => {
    set(
      produce((state: BuilderStore) => {
        if (state.history.past.length === 0) return

        // Move current state to future
        state.history.future.unshift([...state.history.present])

        // Get previous state from past
        const previousState = state.history.past.pop()
        if (previousState) {
          state.elements = previousState
          state.history.present = [...previousState]
        }

        state.canUndo = state.history.past.length > 0
        state.canRedo = true
        state.selectedElementId = null
      }),
    )
  },

  redo: () => {
    set(
      produce((state: BuilderStore) => {
        if (state.history.future.length === 0) return

        // Move current state to past
        state.history.past.push([...state.history.present])

        // Get next state from future
        const nextState = state.history.future.shift()
        if (nextState) {
          state.elements = nextState
          state.history.present = [...nextState]
        }

        state.canUndo = true
        state.canRedo = state.history.future.length > 0
        state.selectedElementId = null
      }),
    )
  },
}))
