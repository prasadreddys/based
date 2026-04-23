import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseSepolia, base],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Base Rewards Dashboard',
  projectId: 'base-rewards-demo',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function WagmiWrapper({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={wagmiConfig}><RainbowKitProvider chains={chains}>{children}</RainbowKitProvider></WagmiProvider>;
}
