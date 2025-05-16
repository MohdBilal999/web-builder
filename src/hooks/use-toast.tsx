"use client"

import { useState, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastVariant = "default" | "destructive" | "success" | "warning"

export interface ToastProps {
  id: string
  title?: string
  description?: ReactNode
  duration?: number
  variant?: ToastVariant
  onClose?: () => void
}

interface ToastContextValue {
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}

const Toast = ({ title, description, variant = "default", onClose }: ToastProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      className={cn(
        "pointer-events-auto relative w-full max-w-md overflow-hidden rounded-lg border shadow-lg",
        "p-4 pr-8 mb-4",
        variant === "default" && "bg-background border-border",
        variant === "destructive" && "bg-destructive border-destructive text-destructive-foreground",
        variant === "success" && "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30",
        variant === "warning" && "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30",
      )}
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
    </motion.div>
  )
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    toasts.forEach((toast) => {
      if (toast.duration !== Number.POSITIVE_INFINITY) {
        const timer = setTimeout(() => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
        }, toast.duration || 5000)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts])

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, ...toast }])
    return id
  }

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // Expose the methods
  useEffect(() => {
    if (mounted) {
      window.addToast = addToast
      window.dismissToast = dismissToast
    }
    return () => {
      delete window.addToast
      delete window.dismissToast
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => dismissToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

// Declare global window interface
declare global {
  interface Window {
    addToast?: (toast: Omit<ToastProps, "id">) => string
    dismissToast?: (id: string) => void
  }
}

export function useToast(): ToastContextValue {
  const toast = (props: Omit<ToastProps, "id">) => {
    if (typeof window !== "undefined" && window.addToast) {
      return window.addToast(props)
    }
    return ""
  }

  const dismiss = (id: string) => {
    if (typeof window !== "undefined" && window.dismissToast) {
      window.dismissToast(id)
    }
  }

  return { toast, dismiss }
}

export function Toaster() {
  return <ToastContainer />
}
