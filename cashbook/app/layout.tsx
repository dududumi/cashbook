import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '나만의 가계부',
  description: '가치관과 돈의 흐름을 기록합니다',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
