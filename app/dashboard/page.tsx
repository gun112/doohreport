'use client'

import Link from 'next/link'
import { BarChart3, Target, Palette, Eye, ArrowRight, Plus, Clock, FileText } from 'lucide-react'

const services = [
  { href: '/dashboard/report', icon: BarChart3, title: 'DOOH Report', description: '캠페인이 끝나면, 리포트는 자동으로.', color: '#3182F6', bg: '#EBF4FF', ready: true },
  { href: '/dashboard/recommend', icon: Target, title: 'AI 매체 추천', description: '감이 아닌, 데이터로 매체를 고르세요.', color: '#01B488', bg: '#E8FAF5', ready: false },
  { href: '/dashboard/creative', icon: Palette, title: 'AI 시안 제작', description: '디자이너 없이도, 시안은 완성됩니다.', color: '#F59E0B', bg: '#FFF8EB', ready: false },
  { href: '/dashboard/simulate', icon: Eye, title: 'AI 시뮬레이션', description: '설치 전에, 현장에서 미리 확인하세요.', color: '#F43F5E', bg: '#FFF1F2', ready: false },
]

const recentActivities = [
  { text: '강남 그린스마트존 리포트 생성', time: '방금 전' },
  { text: '코엑스 LED 매체 등록', time: '2시간 전' },
]

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#191F28', marginBottom: 4 }}>대시보드</h1>
        <p style={{ fontSize: 15, color: '#8B95A1' }}>모든 서비스를 한 곳에서 관리하세요</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        <Link href="/dashboard/report/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 20px', background: '#3182F6', color: 'white', borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          <Plus style={{ width: 16, height: 16 }} /> 새 리포트
        </Link>
        <Link href="/dashboard/media" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 20px', background: 'white', color: '#4E5968', borderRadius: 12, fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid #E5E8EB' }}>
          <Plus style={{ width: 16, height: 16 }} /> 매체 등록
        </Link>
      </div>

      {/* Service Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Link key={service.href} href={service.href} style={{ background: 'white', borderRadius: 24, padding: 28, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', display: 'block', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, background: service.bg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 24, height: 24, color: service.color }} />
                </div>
                {!service.ready && (
                  <span style={{ padding: '4px 10px', background: '#F2F4F6', color: '#8B95A1', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>SOON</span>
                )}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#191F28', marginBottom: 4 }}>{service.title}</h3>
              <p style={{ fontSize: 14, color: '#8B95A1', marginBottom: 20 }}>{service.description}</p>
              <ArrowRight style={{ width: 16, height: 16, color: '#D1D6DB' }} />
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#8B95A1', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock style={{ width: 16, height: 16 }} /> 최근 활동
        </h2>
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {recentActivities.map((activity, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < recentActivities.length - 1 ? '1px solid #F2F4F6' : 'none' }}>
              <div style={{ width: 36, height: 36, background: '#F2F4F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText style={{ width: 16, height: 16, color: '#8B95A1' }} />
              </div>
              <span style={{ fontSize: 14, color: '#4E5968', flex: 1 }}>{activity.text}</span>
              <span style={{ fontSize: 13, color: '#D1D6DB', flexShrink: 0 }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
