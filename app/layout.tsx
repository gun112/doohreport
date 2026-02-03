import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ideal DOOH — 가장 효과적인 OOH 매체를 데이터로 찾아보세요',
  description: 'AI 기반 DOOH 매체 검색, 비교, 사후리포트 자동 생성 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#191F28',
        WebkitFontSmoothing: 'antialiased',
        background: '#fff',
      }}>
        {children}
      </body>
    </html>
  );
}
