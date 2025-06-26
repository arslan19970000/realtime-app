'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'


export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user',
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard') // or wherever you want
    }
  }

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto p-4 space-y-4 border rounded mt-8">
      <h2 className="text-xl font-bold">📝 Register New Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border p-2"
        required
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Account
      </button>
    </form>
  )
}
