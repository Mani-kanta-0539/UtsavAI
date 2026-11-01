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
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#07060b] text-white selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
