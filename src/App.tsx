import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import {IncidentCreation} from './pages/IncidentCreation'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<IncidentCreation />} />
        </Routes>
      </AuthProvider>  
    </BrowserRouter>
  )
}

export default App
