# Based Rewards Dashboard
<!-- spell-checker: disable -->

A modern Web3 dApp scaffold built for the Base network with wallet connect, task rewards, on-chain claim flow, and tokenomics.

## Project Overview

- Frontend: Next.js + Tailwind CSS
- Wallet: RainbowKit + Wagmi
- Web3: ethers.js + viem
- Smart Contracts: Solidity + Hardhat
- Network: Base Sepolia (testnet)

## What is included

- Wallet connect / disconnect using RainbowKit
- Base Sepolia balance display
- ERC-20 reward contract with claim protection and owner reward assignment
- Task dashboard UI with manual onboarding workflow
- Tokenomics section, claim button, and contract read state
- Hardhat deploy script for `baseSepolia`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Add your Base Sepolia RPC endpoint and deployer key in `.env`.

4. Deploy the contract:

```bash
npm run deploy:sepolia
```

5. Update `NEXT_PUBLIC_REWARD_TOKEN_ADDRESS` with the deployed contract address.

6. Run the frontend:

```bash
npm run dev
```

## Hardhat Commands

- `npm run deploy:sepolia` — deploy the `BaseRewardToken` contract to Base Sepolia
- `npm run hardhat -- compile` — compile contracts

## Notes

- The reward verification workflow is demonstrated in the UI and can be extended to API-based or manual verification.
- For a production-ready release, add backend task verification, leaderboard logic, and stablecoin swap integration.
