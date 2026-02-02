'use client'

import { Palette, Bell } from 'lucide-react'

export default function CreativePage() {
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, background: '#FFF8EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Palette style={{ width: 20, height: 20, color: '#F59E0B' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#191F28' }}>AI 시안 제작</h1>
        </div>
        <p style={{ fontSize: 15, color: '#8B95A1', marginLeft: 48 }}>디자이너 없이도, 시안은 완성됩니다</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0' }}>
        <div style={{ width: 80, height: 80, background: '#FFF8EB', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <Palette style={{ width: 40, height: 40, color: '#F59E0B' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>곧 만나요</h2>
        <p style={{ fontSize: 15, color: '#8B95A1', textAlign: 'center', maxWidth: 360, marginBottom: 32, lineHeight: 1.6 }}>
          매체 규격에 맞는 광고 시안을<br />AI가 자동으로 만들어주는 기능을 준비하고 있어요.
        </p>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px', background: '#FFF8EB', color: '#F59E0B', borderRadius: 12, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Bell style={{ width: 16, height: 16 }} /> 출시 알림 받기
        </button>
      </div>
    </div>
  )
}
