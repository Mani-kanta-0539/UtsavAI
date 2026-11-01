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
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-900 bg-amber-50/30 selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
