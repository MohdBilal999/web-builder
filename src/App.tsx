import { Route, Routes } from "react-router-dom"
import WebsiteBuilder from "./builder/page"
import { ThemeProvider } from "./contexts/ThemeProvider"

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<WebsiteBuilder />} />
        {/* Add more routes as needed */}
      </Routes>
    </ThemeProvider>
  )
}

export default App
