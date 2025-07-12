import './App.css'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import AuthenticationPage from './pages/AuthenticationPage'
import { lazy } from 'react'

const VerifcationPage = lazy(()=> import("./pages/Verification"))
function App() {

  return (
   <Router>
    <Routes>
      <Route path='/' element={<AuthenticationPage/>} />
      <Route path='/verify/:email' element={<VerifcationPage/>} />

    </Routes>
   </Router>
  )
}

export default App
