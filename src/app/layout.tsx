import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Startup Life: Khởi nghiệp từ số không',
  description: 'Trò chơi mô phỏng kinh doanh tích hợp Kinh tế chính trị Mác - Lênin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
