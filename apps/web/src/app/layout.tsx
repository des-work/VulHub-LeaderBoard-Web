import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../lib/auth/context';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { SkipLink } from '../components/accessibility/SkipLink';
import { QueryProvider } from '../lib/data/QueryProvider';
import './matrix-unified.css';
import './styles/accessibility.css';
import './styles/responsive.css';

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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} data-app-shell data-theme="matrix">
        <SkipLink targetId="main-content" label="Skip to main content" />
        <QueryProvider>
          <AuthProvider>
            <ErrorBoundary>
              <main id="main-content" tabIndex={-1} role="main">
                {children}
              </main>
            </ErrorBoundary>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
