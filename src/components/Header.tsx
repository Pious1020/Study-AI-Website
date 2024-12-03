import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
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
              <Link
                to="/create"
                className="apple-button text-sm px-5 py-2.5"
              >
                Create Set
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}