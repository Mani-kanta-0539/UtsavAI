import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UtsavAI | Consequence-Aware Celebration & Event Planner',
  description:
    'GenAI-powered, consequence-aware event execution engine for Weddings, Milestone Birthdays, and Community Events. Built for Google PromptWars Challenge 5.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('utsav_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-purple-600 selection:text-white transition-colors duration-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
