import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './components/AuthContext'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import ArtistDashboard from './components/ArtistDashboard'

export default function App() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <nav style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link to="/" style={{ marginRight: 8 }}>Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/artist/dashboard" style={{ marginRight: 8 }}>Dashboard</Link>
              </>
            )}
          </div>
          <div>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Welcome, {user?.fullname?.firstName || user?.email}!</span>
                <button
                  onClick={logout}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/register" style={{ marginRight: 8 }}>Register</Link>
                <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist/dashboard" element={<ArtistDashboard />} />
      </Routes>
    </div>
  )
}
