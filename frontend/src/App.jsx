import { Routes, Route, Link } from 'react-router-dom'
// import './App.css'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12 }}>
        <Link to="/" style={{ marginRight: 8 }}>Home</Link>
        <Link to="/register" style={{ marginRight: 8 }}>Register</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
