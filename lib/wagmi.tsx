import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

const { connectors } = getDefaultWallets({
  appName: 'Base Rewards Dashboard',
  projectId: 'base-rewards-demo',
  chains,
});

const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

export function WagmiWrapper({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={wagmiConfig}><RainbowKitProvider chains={chains}>{children}</RainbowKitProvider></WagmiProvider>;
}
