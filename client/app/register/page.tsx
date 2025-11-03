"use client"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const schema = z.object({ email: z.string().email(), password: z.string().min(6) })

export default function RegisterPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const referredByCode = params.get('r') || undefined
  const [referralCode, setReferralCode] = useState<string>(referredByCode || '')
  const setAuth = useAuthStore((s) => s.setAuth)
  const token = useAuthStore((s) => s.token)
  const hydrate = useAuthStore((s) => s.hydrateFromStorage)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  useEffect(() => { hydrate() }, [hydrate])
  useEffect(() => { if (token) router.replace('/dashboard') }, [token, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      setError('Please enter a valid email and a password of at least 6 characters.')
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
      const res = await api.post('/auth/register', { email, password, referredByCode: referralCode || undefined })
      setAuth(res.data.token, res.data.user)
      router.replace('/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed'
      setError(typeof msg === 'string' ? msg : 'Invalid input')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-1">Create your account</h2>
        {referredByCode ? (
          <p className="text-sm text-green-700 mb-4">Referral code detected: <span className="font-mono">{referredByCode}</span></p>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Have a referral code? Add it below (optional).</p>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Referral code (optional)</label>
            <input
              className="input mt-1 font-mono"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="e.g. LINA123"
              readOnly={Boolean(referredByCode)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <a className="text-brand-700 underline" href="/login">Log in</a>
        </p>
      </div>
    </main>
  )
}


