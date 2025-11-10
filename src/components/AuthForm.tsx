'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 🔹 Handle Email/Password Authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (type === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else {
        alert('Check your email for a verification link!')
        router.push('/login')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else {
        console.log('Login success:', data)
        router.push('/dashboard')
      }
    }

    setLoading(false)
  }

  // 🔹 Handle Google Authentication
  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // redirect after success
      },
    })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {type === 'signup' ? 'Create an Account' : 'Login'}
        </h2>
        <p className="text-center text-gray-500">
          {type === 'signup'
            ? 'Sign up to access the 3D Builder'
            : 'Enter your email and password'}
        </p>

        {/* Email/Password Form */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? 'Please wait...' : type === 'signup' ? 'Sign Up' : 'Login'}
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center">
          <div className="border-t border-gray-300 w-1/3"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="border-t border-gray-300 w-1/3"></div>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>

        {/* Link Toggle */}
        <p className="text-center text-gray-500 text-sm">
          {type === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a
            href={type === 'signup' ? '/login' : '/signup'}
            className="text-blue-500 hover:underline font-medium"
          >
            {type === 'signup' ? 'Login' : 'Sign up'}
          </a>
        </p>
      </form>
    </div>
  )
}
