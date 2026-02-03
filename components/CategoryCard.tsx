'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CategoryCardProps {
  name: string;
  count: number;
  category: string;
  isMapCard?: boolean;
}

export default function CategoryCard({ name, count, category, isMapCard }: CategoryCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (isMapCard) {
      router.push('/map');
    } else {
      router.push(`/map?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isMapCard ? '#F8FAFC' : '#fff',
        borderRadius: '14px',
        padding: '20px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: `1px solid ${hovered ? '#3182F6' : isMapCard ? '#E5E8EB' : '#F2F4F6'}`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 20px rgba(49,130,246,0.07)' : 'none',
      }}
    >
      <h3 style={{
        fontSize: '15px',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        marginBottom: '3px',
        color: isMapCard ? '#3182F6' : '#191F28',
      }}>
        {isMapCard ? '지도로 찾기 →' : name}
      </h3>
      <span style={{
        fontSize: '12px',
        color: isMapCard ? '#8B95A1' : '#B0B8C1',
        fontWeight: 400,
      }}>
        {isMapCard ? '전체 매체 보기' : `${count}개 매체`}
      </span>
    </div>
  );
}
