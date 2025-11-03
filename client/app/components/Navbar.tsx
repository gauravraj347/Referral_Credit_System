"use client"
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const pathname = usePathname()
  const router = useRouter()

  function onLogout() {
    logout()
    if (pathname?.startsWith('/dashboard')) router.push('/')
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">FileSure</Link>
        <div className="flex items-center gap-2">
          {!token ? (
            <>
              <Link href="/register" className="btn btn-primary">Register</Link>
              <Link href="/login" className="btn btn-secondary">Login</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <button onClick={onLogout} className="btn btn-primary">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}


