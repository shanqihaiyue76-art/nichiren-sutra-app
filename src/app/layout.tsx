import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "../styles/globals.css";

// Android等でHiragino Mincho ProN/游明朝が無い環境向けの明朝体フォールバック。
// next/font/googleでビルド時に自前ホストするため、システムフォント依存を回避する。
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "読経練習",
  title: "読経練習",
  description: "日蓮宗の読経を聞きながら見て覚える練習アプリ",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "読経練習",
    statusBarStyle: "black-translucent",
  },
  // Next.js 15 は mobile-web-app-capable のみ出力するため、iOS全画面用に旧meta も明示追加
  other: { "apple-mobile-web-app-capable": "yes" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#1a1410",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSerifJP.variable}>
      <body>{children}</body>
    </html>
  );
}
