"use client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const schema = z.object({ 
  email: z.string().email(), 
  password: z.string().min(6) 
})

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  
  // Move all hooks inside the component
  const token = useAuthStore((s) => s.token)
  const hydrate = useAuthStore((s) => s.hydrateFromStorage)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (token) router.replace('/dashboard')
  }, [token, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      setError('Please enter a valid email and password.')
      const fe: { email?: string; password?: string } = {}
      const issues = parsed.error.flatten().fieldErrors
      if (issues.email?.[0]) fe.email = issues.email[0]
      if (issues.password?.[0]) fe.password = issues.password[0]
      setFieldErrors(fe)
      return
    }
    setFieldErrors({})
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setAuth(res.data.token, res.data.user)
      router.replace('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Login failed'
      setError(typeof msg === 'string' ? msg : 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
        <p className="text-sm text-gray-600 mb-4">Log in to access your dashboard.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input 
              className="input mt-1" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input 
              className="input mt-1" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          New here? <a className="text-brand-700 underline" href="/register">Create an account</a>
        </p>
      </div>
    </main>
  )
}