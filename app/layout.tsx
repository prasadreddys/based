import './globals.css';
import { WagmiWrapper } from '@/lib/wagmi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Based Rewards Dashboard',
  description: 'Web3 reward dApp for Base network with wallet connect and reward claims.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiWrapper>{children}</WagmiWrapper>
      </body>
    </html>
  );
}
