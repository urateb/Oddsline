import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppProviders } from '@/components/providers/app-providers';
import { Toaster } from '@/components/ui/sonner';
import { SiteHeader } from '@/features/layout/site-header';
import { SiteFooter } from '@/features/layout/site-footer';
import { RgBanner } from '@/features/responsible-gambling/rg-banner';
import { BetSlipPanel } from '@/features/bet-slip/bet-slip-panel';
import {
  getBetSlipConfig,
  getResponsibleGambling,
} from '@/features/sportsbook/api';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Oddsline',
  description: 'Oddsline — live sports, events, and odds',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [betSlipConfig, responsibleGambling] = await Promise.all([
    getBetSlipConfig(),
    getResponsibleGambling(),
  ]);

  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=localStorage.getItem('sportsbook-theme');var t=r?JSON.parse(r).state.theme:'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <SiteHeader />
          <RgBanner
            message={responsibleGambling.messages.banner}
            helplineUrl={responsibleGambling.helplineUrl}
            helplinePhone={responsibleGambling.helplinePhone}
          />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col pb-20 lg:pb-0">{children}</div>
            <SiteFooter />
            <BetSlipPanel config={betSlipConfig} />
          </div>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
