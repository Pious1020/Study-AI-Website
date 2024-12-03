import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, LogIn, Loader2 } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-white/70 border-b border-apple-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <GraduationCap className="h-8 w-8 text-apple-blue" />
              <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-apple-blue to-apple-purple bg-clip-text text-transparent">
                Study AI
              </span>
            </Link>
            
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`transition-colors duration-200 text-sm ${
                  isActive('/') 
                    ? 'text-apple-blue font-medium' 
                    : 'text-apple-gray-400 hover:text-apple-gray-500'
                }`}
              >
                Home
              </Link>
              <Link
                to="/library"
                className={`transition-colors duration-200 text-sm ${
                  isActive('/library')
                    ? 'text-apple-blue font-medium'
                    : 'text-apple-gray-400 hover:text-apple-gray-500'
                }`}
              >
                Library
              </Link>
              {isAuthenticated && (
                <Link
                  to="/create"
                  className="apple-button text-sm px-5 py-2.5"
                >
                  Create Set
                </Link>
              )}
              {isLoading ? (
                <div className="flex items-center space-x-2 text-apple-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user?.picture && (
                      <img
                        src={user.picture}
                        alt={user.name || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-apple-gray-600">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className="flex items-center space-x-1 text-sm text-apple-gray-400 hover:text-apple-gray-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="flex items-center space-x-1 text-sm text-apple-gray-400 hover:text-apple-gray-500"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}