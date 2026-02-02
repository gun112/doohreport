'use client'

import { Eye, Bell } from 'lucide-react'

export default function SimulatePage() {
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, background: '#FFF1F2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye style={{ width: 20, height: 20, color: '#F43F5E' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#191F28' }}>AI 시뮬레이션</h1>
        </div>
        <p style={{ fontSize: 15, color: '#8B95A1', marginLeft: 48 }}>설치 전에, 현장에서 미리 확인하세요</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0' }}>
        <div style={{ width: 80, height: 80, background: '#FFF1F2', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <Eye style={{ width: 40, height: 40, color: '#F43F5E' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>곧 만나요</h2>
        <p style={{ fontSize: 15, color: '#8B95A1', textAlign: 'center', maxWidth: 360, marginBottom: 32, lineHeight: 1.6 }}>
          실제 매체 위치에 시안을 합성해<br />현장감 있는 프레젠테이션을 제공하는 기능을 준비하고 있어요.
        </p>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px', background: '#FFF1F2', color: '#F43F5E', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Bell style={{ width: 16, height: 16 }} /> 출시 알림 받기
        </button>
      </div>
    </div>
  )
}
