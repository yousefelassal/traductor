import { QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Todos from './pages/Todo'
import { queryClient } from './libs/utils'
import Home from './pages/Home'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Todos />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

