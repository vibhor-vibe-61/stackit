import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Menu, X, User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/questions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header sticky top-0 z-40" style={{background:'transparent', boxShadow:'none', borderBottom:'none'}}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 pt-4">
          {/* Logo and Navigation in same row */}
          <div className="flex items-center w-full">
            <nav className="flex items-center gap-4 ml-auto">
              <Link
                to="/questions"
                className="btn btn-primary"
                style={{fontWeight:700, fontSize:'1.05rem'}}
              >
                Questions
              </Link>
              {user ? (
                <>
                  <Link
                    to="/ask"
                    className="btn btn-primary shadow"
                  >
                    Ask Question
                  </Link>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-8 h-8 rounded-full border-2 border-blue-500"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-300" />
                        </div>
                      )}
                      <span className="hidden lg:block">{user.username}</span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#23232b] bg-opacity-95 rounded-md shadow-lg py-1 z-50 border border-blue-900">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-blue-200 hover:bg-blue-900 hover:text-white flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-900 hover:text-white flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="btn btn-outline"
                    style={{fontWeight:700, fontSize:'1.05rem'}}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/questions"
                    className="btn btn-primary"
                    style={{fontWeight:700, fontSize:'1.05rem'}}
                  >
                    Questions
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-secondary"
                    style={{fontWeight:700, fontSize:'1.05rem'}}
                  >
                    Join Now
                  </Link>
                  <Link
                    to="/ask"
                    className="btn btn-primary"
                    style={{fontWeight:700, fontSize:'1.05rem'}}
                  >
                    Ask Question
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 