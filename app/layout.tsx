import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Roshan Bhagat — Hidden Leaf Command File',
  description: 'Special Jonin Robotics Engineer, Founder, E-Cell VP. Complete Naruto interactive graphic novel portfolio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Exo+2:ital,wght@0,200;0,400;0,700;1,200&family=Noto+Sans+JP:wght@400;700;900&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0A0A0F] text-[#F1F5F9] antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
