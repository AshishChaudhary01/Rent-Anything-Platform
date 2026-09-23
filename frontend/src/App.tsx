import './App.css'
import AuthSession from './components/auth/AuthSession'
import RaToaster from './components/toast/RaToaster'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <div>
      <RaToaster />
      <AuthSession />
      <AppRoutes />
    </div>
  )
}

export default App
