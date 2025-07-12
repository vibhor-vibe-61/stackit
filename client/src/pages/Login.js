import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#e3f2fd]">
      <div className="card max-w-md w-full p-8 rounded-2xl shadow-lg" style={{background:'#fff', border:'none'}}>
        <h2 className="text-3xl font-extrabold text-center mb-2" style={{color:'#1976d2', letterSpacing:'0.01em'}}>Sign In</h2>
        <p className="text-center text-gray-500 mb-6" style={{fontWeight:500}}>Welcome back! Please enter your details to continue.</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-blue-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-lg mt-2"
            style={{borderRadius:'2rem', fontWeight:700}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
          <div className="flex items-center justify-between mt-2">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Forgot password?</Link>
            <Link to="/register" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Create account</Link>
          </div>
        </form>
        <div className="mt-6">
          <button
            type="button"
            className="btn btn-secondary w-full text-lg"
            style={{borderRadius:'2rem', fontWeight:700, background:'#1976d2', color:'#fff', marginTop:'0.5rem'}}
            onClick={() => { loginAsGuest(); navigate('/'); }}
          >
            Login as Guest (View Only)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 