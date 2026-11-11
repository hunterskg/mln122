import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kinh Tế Chính Trị Mác - Lênin | Quiz & Diagnostic Engine',
  description: 'Nền tảng trắc nghiệm tình huống thực tế và chẩn đoán tư duy kinh tế chính trị theo chuẩn Giáo trình 2021 Bộ GD&ĐT.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased selection:bg-rose-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
