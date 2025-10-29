import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Themes } from '@vulhub/ui';
import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';
import './globals.css';
import './loading.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VulHub Leaderboard',
  description: 'A gamified platform for cybersecurity students to practice, compete, and grow.',
  keywords: ['cybersecurity', 'education', 'leaderboard', 'vulhub', 'competition'],
  authors: [{ name: 'CSUSB Cybersecurity Program' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Themes.Provider
          defaultTheme="light"
          storageKey="vulhub-theme"
        >
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </Themes.Provider>
      </body>
    </html>
  );
}
