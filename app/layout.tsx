import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "DOOH Analytics - 옥외광고, 데이터로 가볍게",
  description: "AI 리포트, 매체 추천, 시안 제작, 시뮬레이션까지 하나의 플랫폼에서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
