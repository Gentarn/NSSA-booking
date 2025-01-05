import './globals.css'
import { Inter, Noto_Sans_JP } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

export const metadata = {
  title: '商品受け取り予約',
  description: '商品の受け取り時間を予約する',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${notoSansJP.className}`}>{children}</body>
    </html>
  )
}

