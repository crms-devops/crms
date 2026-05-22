import LoginPage from "./pages/LoginPage"
import ResultsPage from "./pages/ResultsPage"

function App() {
  const path = window.location.pathname
  if (path === "/results") return <ResultsPage />
  return <LoginPage />
}

export default App