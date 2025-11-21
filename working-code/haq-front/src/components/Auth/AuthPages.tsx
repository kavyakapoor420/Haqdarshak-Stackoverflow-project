
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import AgentImage from '../../assets/Agent.png';
import { useNavigate } from 'react-router-dom';

interface TypewriterProps {
  text: string;
  speed?: number;
}

function Typewriter({ text, speed = 120 }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span>
      {displayText}
      <span className="animate-blink ml-0.5">|</span>
    </span>
  );
}

const AuthPage: React.FC<{ setToken: (token: string) => void; setRole: (role: string) => void }> = ({ setToken, setRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
    userType: 'user' as 'user' | 'admin'
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const switchAuthMode = () => {
    setIsLogin(prevIsLogin => !prevIsLogin);
    setError('');
    setSuccess('');
    setFormErrors({});
    setFormData(prev => ({
      ...prev,
      username: '',
      email: '',
      password: '',
      agreeToTerms: false,
      userType: 'user'
    }));
  };

  const handleUserTypeChange = (type: 'user' | 'admin') => {
    setFormData(prev => ({ ...prev, userType: type }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!isLogin && !formData.username.trim()) {
      errors.username = 'Username is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormErrors({});

    const validationErrors = validateForm();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }


    const url = isLogin
      ? 'http://localhost:5000/api/login'
      : 'http://localhost:5000/api/register';
      //  ? 'https://haqdarshak-stackoverflow-project.onrender.com/api/login'
      //  : 'https://haqdarshak-stackoverflow-project.onrender.com/api/register'

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password, role: formData.userType };

    try {
      const res = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (isLogin) {
        setSuccess(res.data.message || "Login successful!");
        setToken(res.data.token);
        setRole(res.data.role);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);

        // Redirect based on role
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setSuccess(res.data.message || "Account created successfully!");
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('Registration successful! Please log in.');
        }, 1500);
      }
    } catch (err: any) {
      console.error("Backend auth error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    setToken("");
    setRole("");
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setSuccess("Logged out successfully.");
    setError("");
    setFormData(prev => ({
      ...prev,
      username: '',
      email: '',
      password: '',
      agreeToTerms: false,
      userType: 'user'
    }));
    setIsLogin(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f4f1ee] via-[#f9e6da] to-[#f8d1be] flex justify-center items-center p-4 font-inter">
      <div className="w-full max-w-6xl h-full max-h-[80vh] shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-white">
        <div className="flex flex-col justify-center px-8 py-10 md:px-14">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#ef5d32] mb-2 text-left leading-snug">
              {isLogin ? (
                <Typewriter text="Welcome Back" speed={110} />
              ) : (
                <Typewriter text="" speed={110} />
              )}
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-8 text-left font-normal">
              {isLogin ? "Sign in to access your account" : "Join us to start your journey"}
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 mb-3">
              {!isLogin && (
                <div>
                  <label htmlFor="username" className="text-[15px] font-medium text-gray-800 mb-1">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`mt-2 bg-[#faf5ef] border ${formErrors.username ? 'border-red-500' : 'border-[#e7e2dc]'} text-gray-900 placeholder-gray-400 text-lg py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ef5d32] focus:border-transparent w-full`}
                    required={!isLogin}
                  />
                  {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                </div>
              )}
              <div>
                <label htmlFor="email" className="text-[15px] font-medium text-gray-800 mb-1">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-2 bg-[#faf5ef] border ${formErrors.email ? 'border-red-500' : 'border-[#e7e2dc]'} text-gray-900 placeholder-gray-400 text-lg py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ef5d32] focus:border-transparent w-full`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-[15px] font-medium text-gray-800">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Forgot password clicked.");
                      }}
                      className="text-sm text-[#ef5d32] hover:underline transition-colors duration-200"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`mt-2 bg-[#faf5ef] border ${formErrors.password ? 'border-red-500' : 'border-[#e7e2dc]'} text-gray-900 placeholder-gray-400 text-lg py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ef5d32] focus:border-transparent w-full`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ef5d32] focus:outline-none transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
              </div>

              {!isLogin && (
                <>
                  {formErrors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{formErrors.agreeToTerms}</p>}

                  <div className="flex items-center pt-2">
                    <input
                      id="admin-signup"
                      type="checkbox"
                      checked={formData.userType === 'admin'}
                      onChange={() => handleUserTypeChange(formData.userType === 'admin' ? 'user' : 'admin')}
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-[#e7e2dc] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#ef5d32] data-[state=checked]:text-white"
                    />
                    <label htmlFor="admin-signup" className="ml-2 block text-sm text-gray-600">
                      Sign up as Admin
                    </label>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="mb-4">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-600">Login as:</span>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleUserTypeChange('user')}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                          formData.userType === 'user'
                            ? 'bg-[#ef5d32] text-white'
                            : 'bg-[#faf5ef] text-gray-700 border border-[#e7e2dc] hover:bg-[#f8d1be]'
                        }`}
                      >
                        Agent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUserTypeChange('admin')}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                          formData.userType === 'admin'
                            ? 'bg-[#ef5d32] text-white'
                            : 'bg-[#faf5ef] text-gray-700 border border-[#e7e2dc] hover:bg-[#f8d1be]'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#ef5d32] text-white text-[17px] font-semibold py-3.5 mt-2 hover:bg-[#d84820] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={switchAuthMode}
                  className="ml-1 font-semibold text-[#ef5d32] hover:text-[#d84820] transition-colors duration-200"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-full h-full">
          <img
            src={AgentImage}
            alt="Authentication"
            className="object-cover w-full h-full"
            draggable={false}
            loading="eager"
            style={{ minHeight: "100%", minWidth: "100%" }}
          />
        </div>
      </div>
      <style>
        {`
          .animate-blink {
            animation: blink 1.1s steps(1) infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1 }
            50% { opacity: 0 }
          }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default AuthPage;