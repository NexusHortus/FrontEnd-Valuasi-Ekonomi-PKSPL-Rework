import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRoleLocal] = useState('peneliti')
  
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', { fullName, email, password, role });
    
    // Set role in auth context then navigate
    setRole(role as 'peneliti' | 'admin');
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/projects');
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a56db] font-inter p-4 md:p-8">
      {/* Register Card */}
      <div
        id="register-card"
        className="w-full max-w-[960px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[560px]"
      >
        {/* Left Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          {/* Back to Home Link */}
          <Link
            to="/"
            className="absolute top-6 left-8 text-sm font-medium text-gray-500 hover:text-[#1a56db] flex items-center gap-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Beranda
          </Link>

          <div className="mb-8 mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm">Please enter your details to sign up</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullname-input"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Full name
              </label>
              <input
                id="fullname-input"
                type="text"
                placeholder="Enter your Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 hover:border-gray-400"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Email
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 hover:border-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 hover:border-gray-400"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role-input"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                Role
              </label>
              <select
                id="role-input"
                value={role}
                onChange={(e) => setRoleLocal(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 hover:border-gray-400 bg-white"
              >
                <option value="peneliti">Peneliti (Researcher)</option>
                <option value="admin">Super Admin</option>
              </select>
            </div>

            {/* Sign In Button */}
            <button
              id="register-button"
              type="submit"
              className="w-full py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-[#1545b8] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] cursor-pointer"
            >
              Sign up
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an Account?{' '}
            <Link
              to="/login"
              id="login-link"
              className="text-[#1a56db] font-semibold hover:text-[#1545b8] hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1a56db] to-[#0e3baa] items-center justify-center p-6 relative overflow-hidden">
          <div className="w-full h-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">Your Image Here</p>
              <p className="text-xs mt-1 opacity-70">Replace this placeholder</p>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
