'use client';

import { useRouter } from 'next/navigation';

const tags = [
  { label: '코엑스 K-POP', hot: true },
  { label: '강남역' },
  { label: '명동' },
  { label: '지하철' },
  { label: '영화관' },
  { label: '버스' },
];

export default function QuickTags() {
  const router = useRouter();

  const handleClick = (label: string) => {
    router.push(`/map?q=${encodeURIComponent(label)}`);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '7px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '16px',
      maxWidth: '520px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      {tags.map((tag) => (
        <button
          key={tag.label}
          onClick={() => handleClick(tag.label)}
          style={{
            padding: '6px 13px',
            borderRadius: '100px',
            background: tag.hot ? '#FFF0F0' : '#F2F4F6',
            fontSize: '13px',
            color: tag.hot ? '#E8344E' : '#4E5968',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
            border: 'none',
            fontFamily: 'inherit',
          }}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
}
