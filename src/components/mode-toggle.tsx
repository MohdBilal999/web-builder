import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "@/contexts/ThemeProvider"

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  )
}
