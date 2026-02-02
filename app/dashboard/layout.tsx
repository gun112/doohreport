'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Target, Palette, Eye, Package, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: '대시보드', exact: true },
  { href: '/dashboard/report', label: 'DOOH Report' },
  { href: '/dashboard/recommend', label: 'AI 매체추천' },
  { href: '/dashboard/creative', label: 'AI 시안' },
  { href: '/dashboard/simulate', label: 'AI 시뮬레이션' },
  { href: '/dashboard/media', label: '매체관리' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E5E8EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          {/* 상단 로고 + 버튼 */}
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: '#3182F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 style={{ width: 16, height: 16, color: 'white' }} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#191F28' }}>DOOH Analytics</span>
            </Link>
            <Link href="/" style={{ fontSize: 14, color: '#8B95A1', textDecoration: 'none' }}>
              홈으로
            </Link>
          </div>

          {/* 탭 네비게이션 */}
          <div style={{ display: 'flex', gap: 4, borderTop: '1px solid #F2F4F6' }}>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '14px 20px',
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#3182F6' : '#8B95A1',
                    textDecoration: 'none',
                    borderBottom: active ? '2px solid #3182F6' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'all 0.15s',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        {children}
      </main>
    </div>
  )
}
