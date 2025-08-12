'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IoLockClosedOutline, IoPersonOutline, IoEyeOutline, IoEyeOffOutline, IoHomeOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import '../admin.css'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    id: 'admin',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/admin')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    if (credentials.id === 'admin' && credentials.password === 'Faith') {
      // Use the auth context to login
      login('admin-session-token', credentials.id)
      
      // Redirect to admin dashboard
      router.push('/admin')
    } else {
      setError('Invalid credentials. Please try again.')
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <Link href="/" className="logo-link">
              <div className="logo-icon">
                <IoHomeOutline />
              </div>
              <h1>Tony Properties</h1>
            </Link>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-form-header">
            <div className="login-icon">
              <IoLockClosedOutline />
            </div>
            <h2>Admin Login</h2>
            <p>Enter your credentials to access the admin dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="id">Admin ID</label>
              <div className="input-wrapper">
                <IoPersonOutline className="input-icon" />
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={credentials.id}
                  onChange={handleInputChange}
                  placeholder="Enter admin ID"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>Protected access only for authorized personnel</p>
          </div>
        </div>
      </div>
    </div>
  )
}
