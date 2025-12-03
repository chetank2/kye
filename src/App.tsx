import { Workspace } from './pages/workspace'
import { ThemeProvider } from './components/theme/ThemeProvider'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <Workspace />
    </ThemeProvider>
  )
}

export default App
