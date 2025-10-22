import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ResponsiveHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Determine user role
  const userRole = user?.role || 'user';
  const isArtist = userRole === 'artist';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const navigationItems = [
    { name: 'Home', href: '/', requiresAuth: false },
    { name: 'Dashboard', href: '/dashboard', requiresAuth: true },
    { name: 'Playlists', href: '/playlists', requiresAuth: true },
    { name: 'Upload', href: '/new-track', requiresAuth: true, artistOnly: true },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.requiresAuth) return true;
    if (!isAuthenticated) return false;
    if (item.artistOnly && !isArtist) return false;
    return true;
  });

  return (
    <header className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white text-xl sm:text-2xl font-black hover:text-green-400 transition-colors"
              onClick={closeMobileMenu}
            >
              MadMax
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold transition-colors hover:text-white ${
                  location.pathname === item.href
                    ? 'text-green-400'
                    : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-black text-sm font-bold">
                    {(user?.fullname?.firstName || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {user?.fullname?.firstName || user?.email}
                  </span>
                  <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {isArtist ? 'Artist' : 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-45' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-3 border-t border-gray-700">
            {/* Mobile Navigation Links */}
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-lg text-base font-semibold transition-colors ${
                  location.pathname === item.href
                    ? 'text-green-400 bg-gray-700/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                }`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-700">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-black text-lg font-bold">
                      {(user?.fullname?.firstName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">
                        {user?.fullname?.firstName || user?.email}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {isArtist ? 'Artist Account' : 'User Account'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/register"
                    className="block w-full text-center bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-white px-4 py-3 rounded-lg transition-colors font-semibold text-sm"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-green-500 hover:bg-green-400 text-black px-4 py-3 rounded-lg transition-colors font-semibold text-sm"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
