'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client (client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/') // redirect to homepage immediately after logout
  }

  if (loading) return null

  return (
    <nav className="bg-gray-50 text-blue-500 p-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-xl font-bold">
        3D Builder
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/" className="hover:text-blue-400">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>
            <Link href="/players" className="hover:text-blue-400">
              Players
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/" className="hover:text-blue-400">
              Home
            </Link>
            <Link href="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link href="/signup" className="hover:text-blue-400">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
