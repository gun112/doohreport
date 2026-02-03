'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '매체 찾기', href: '/map' },
  { label: '리포트', href: '/report' },
  { label: 'AI 추천', href: '/recommend' },
  { label: '시뮬레이션', href: '/simulate' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #F2F4F6',
      padding: '0 40px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: '#191F28',
        }}>
          <span style={{ color: '#3182F6' }}>ideal</span> DOOH
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              fontSize: '14px',
              color: pathname === item.href ? '#191F28' : '#B0B8C1',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
