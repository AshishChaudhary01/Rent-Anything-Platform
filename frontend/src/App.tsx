import './App.css'
import { Toaster } from 'sonner'
import AppRoutes from './routes/AppRoutes'
function App() {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </div>
  )
}

export default App
