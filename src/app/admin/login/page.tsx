'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IoLockClosedOutline, IoPersonOutline, IoEyeOutline, IoEyeOffOutline, IoHomeOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import '../admin.css'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const { user, signIn, signInWithUsername, signUp } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/admin')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!emailOrUsername.trim() || !password.trim()) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      let result: { error: any }

      if (isSignUp) {
        // For sign up, we can use either email or username
        const isEmail = emailOrUsername.includes('@')
        if (isEmail) {
          // Check if email exists by attempting to sign up first
          // If email exists, Supabase will return an error
          result = await signUp(emailOrUsername, password, { username: emailOrUsername.split('@')[0] })
          
          // Check if the error is about existing user
          if (result.error && result.error.message.includes('already registered')) {
            setError('User already exists! Please switch to login mode and sign in with your credentials.')
            setLoading(false)
            return
          }
        } else {
          // Sign up with username - generate a placeholder email
          const placeholderEmail = `${emailOrUsername}@tonyproperties.local`
          result = await signUp(placeholderEmail, password, { username: emailOrUsername })
        }
      } else {
        // For sign in, try email first, then username
        if (emailOrUsername.includes('@')) {
          result = await signIn(emailOrUsername, password)
        } else {
          result = await signInWithUsername(emailOrUsername, password)
        }
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        // Success - check if user needs email verification
        if (isSignUp) {
          // Check if the user is already confirmed
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          if (currentUser?.email_confirmed_at) {
            // Email already confirmed, redirect to admin
            router.push('/admin')
          } else {
            // Email not confirmed yet
            setError('Please check your email to confirm your account before signing in.')
            setIsSignUp(false)
          }
        } else {
          // For sign in, check if user is confirmed
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          if (currentUser?.email_confirmed_at) {
            // Email confirmed, redirect to admin
            router.push('/admin')
          } else {
            // Email not confirmed, show error
            setError('Please verify your email address before signing in.')
            // Sign out the user since they can't access admin yet
            await supabase.auth.signOut()
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setEmailOrUsername('')
    setPassword('')
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
            <h2>{isSignUp ? 'Create Admin Account' : 'Admin Login'}</h2>
            <p>Enter your credentials to access the admin dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="emailOrUsername">Email or Username</label>
              <div className="input-wrapper">
                <IoPersonOutline className="input-icon" />
                <input
                  type="text"
                  id="emailOrUsername"
                  name="emailOrUsername"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter email or username"
                  required
                  autoComplete={isSignUp ? 'username' : 'username'}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={6}
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
              disabled={loading}
            >
              {loading ? (
                <span className="loading-text">
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-mode-btn"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
