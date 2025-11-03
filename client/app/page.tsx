"use client"
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FadeIn, Pop } from '@/components/Motion'

export default function HomePage() {
  const token = useAuthStore((s) => s.token)
  const hydrate = useAuthStore((s) => s.hydrateFromStorage)
  const router = useRouter()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (token) router.replace('/dashboard')
  }, [token, router])

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <FadeIn className="text-center space-y-4">
        <h1 className="text-4xl font-bold">FileSure Referral & Credit System</h1>
        <p className="text-gray-600">Register, share your referral link, and earn credits when friends purchase.</p>
        <Pop className="mt-6 flex items-center justify-center gap-4">
          <Link className="btn btn-primary" href="/register">Get Started</Link>
          <Link className="btn btn-secondary" href="/login">I already have an account</Link>
        </Pop>
      </FadeIn>
    </main>
  )
}


