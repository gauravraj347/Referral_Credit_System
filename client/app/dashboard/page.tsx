"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { apiAuth } from '@/lib/api'
import { FadeIn, Pop } from '@/components/Motion'

type DashboardData = {
  referralCode: string
  totalReferredUsers: number
  convertedUsers: number
  totalCredits: number
}

export default function DashboardPage() {
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const hydrate = useAuthStore((s) => s.hydrateFromStorage)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>('9.99')
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await apiAuth(token).get('/dashboard')
        setData(res.data)
      } catch (err: any) {
        const msg = err?.response?.data?.error || 'Failed to load dashboard'
        setError(typeof msg === 'string' ? msg : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  useEffect(() => {
    if (!token && !loading) router.replace('/login')
  }, [token, loading, router])

  const referralLink = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com'
    const code = data?.referralCode ?? ''
    return `${base}/register?r=${encodeURIComponent(code)}`
  }, [data?.referralCode])

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink)
    alert('Referral link copied to clipboard')
  }

  async function shareLink() {
    const text = `Join me on FileSure and earn credits: ${referralLink}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FileSure Referral', text, url: referralLink })
      } catch {
        // ignore cancellation
      }
    } else {
      await copyLink()
    }
  }

  async function makePurchase() {
    setPurchasing(true)
    setError(null)
    try {
      const amtNum = Number(amount)
      if (!Number.isFinite(amtNum) || amtNum <= 0) throw new Error('Enter a valid amount')
      const resp = await apiAuth(token!).post('/purchase', { amount: amtNum })
      const res = await apiAuth(token!).get('/dashboard')
      setData(res.data)
      if (resp?.data?.isFirstPurchase) setSuccess('Congrats! First purchase credited.')
      else setSuccess('Purchase completed. No additional credits awarded.')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Purchase failed'
      setError(typeof msg === 'string' ? msg : 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  if (!token) return null

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <header className="flex items-center justify-between">
        <FadeIn>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Signed in as {user?.email}</p>
        </FadeIn>
        <button className="btn btn-secondary" onClick={logout}>Log out</button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Pop className="card p-5">
          <p className="text-sm text-gray-500">Total Referred Users</p>
          <p className="text-3xl font-semibold">{loading ? '—' : data?.totalReferredUsers ?? 0}</p>
        </Pop>
        <Pop className="card p-5">
          <p className="text-sm text-gray-500">Converted Users</p>
          <p className="text-3xl font-semibold">{loading ? '—' : data?.convertedUsers ?? 0}</p>
        </Pop>
        <Pop className="card p-5">
          <p className="text-sm text-gray-500">Total Credits</p>
          <p className="text-3xl font-semibold">{loading ? '—' : data?.totalCredits ?? 0}</p>
        </Pop>
        <Pop className="card p-5">
          <p className="text-sm text-gray-500">Referral Code</p>
          <p className="text-xl font-mono">{loading ? '—' : data?.referralCode}</p>
        </Pop>
      </section>

      <Pop className="card p-6 space-y-3">
        <h2 className="text-lg font-semibold">Your referral link</h2>
        <div className="flex items-center gap-2">
          <input className="input" value={referralLink} readOnly />
          <button onClick={copyLink} className="btn btn-secondary">Copy</button>
          <button onClick={shareLink} className="btn btn-primary">Share</button>
        </div>
      </Pop>

      <section className="card p-6 space-y-3">
        <h2 className="text-lg font-semibold">Simulate a purchase</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="input sm:max-w-xs" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="btn btn-primary sm:w-40" onClick={makePurchase} disabled={purchasing}>
            {purchasing ? 'Processing…' : 'Buy'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        <p className="text-xs text-gray-500">Only the first purchase of a referred user awards credits.</p>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="text-lg font-semibold">How referrals work</h2>
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          <li>Share your unique link with friends.</li>
          <li>If they register via your link or enter your code, they are referred by you.</li>
          <li>When a referred user completes their first purchase, you and they each earn 2 credits.</li>
          <li>Future purchases by the same user don’t award extra credits.</li>
        </ul>
      </section>
    </main>
  )
}


