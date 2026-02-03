'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/map?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/map');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      background: '#F2F4F6',
      borderRadius: '14px',
      padding: '5px 5px 5px 20px',
      transition: 'all 0.2s',
    }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="강남역 전광판, 지하철 2호선, 영화관..."
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontSize: '15px',
          fontFamily: 'inherit',
          color: '#191F28',
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '11px',
          background: '#3182F6',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#1B64DA')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#3182F6')}
      >
        <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24" width="17" height="17">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </div>
  );
}
