import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      padding: '32px 40px',
      borderTop: '1px solid #F2F4F6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '960px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '12px', color: '#B0B8C1' }}>
        © 2026 아이디얼
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        {['문의하기', '이용약관', '개인정보처리방침'].map((text) => (
          <Link
            key={text}
            href="#"
            style={{
              fontSize: '12px',
              color: '#8B95A1',
              textDecoration: 'none',
            }}
          >
            {text}
          </Link>
        ))}
      </div>
    </footer>
  );
}
