import { Route, Routes } from "react-router-dom"
import WebsiteBuilder from "./builder/page"
import { ThemeProvider } from "./contexts/ThemeProvider"

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<WebsiteBuilder />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
