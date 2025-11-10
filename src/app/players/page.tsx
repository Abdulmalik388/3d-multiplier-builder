'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PlayersPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      // Get currently signed-in user
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error)
      } else {
        setEmail(data.user?.email || null)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Active Player</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : email ? (
        <div className="flex items-center gap-3 bg-white shadow p-4 rounded-lg">
          {/* Green status circle */}
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-800 font-medium">{email}</span>
        </div>
      ) : (
        <p className="text-gray-500">
          No user logged in. Please sign in first.
        </p>
      )}
    </div>
  )
}
