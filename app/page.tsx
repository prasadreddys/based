'use client';

import { useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { rewardTokenAbi } from '@/lib/contracts';

const contractAddress = process.env.NEXT_PUBLIC_REWARD_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000';

const taskDefinitions = [
  { id: 1, title: 'Follow on X', reward: 50, description: 'Follow our Base token launch profile on X.' },
  { id: 2, title: 'Like + Retweet', reward: 90, description: 'Like and retweet the launch announcement post.' },
  { id: 3, title: 'Submit Tweet Link', reward: 60, description: 'Paste your tweet link for reward verification.' }
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [tweetLink, setTweetLink] = useState('');

  const { data: balance } = useBalance({ address, chainId: 84531 });
  const { data: totalSupply } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: rewardTokenAbi,
    functionName: 'totalSupply',
    chainId: 84531,
  });
  const { data: userReward } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: rewardTokenAbi,
    functionName: 'rewards',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    enabled: Boolean(address),
    chainId: 84531,
  });
  const claimWrite = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: rewardTokenAbi,
    functionName: 'claimReward',
    chainId: 84531,
  });
  const claimTx = useWaitForTransaction({ hash: claimWrite.data?.hash, enabled: Boolean(claimWrite.data?.hash) });

  const completedReward = useMemo(
    () => taskDefinitions.reduce((sum, task) => completedTasks.includes(task.id) ? sum + task.reward : sum, 0),
    [completedTasks]
  );

  const canClaim = completedTasks.length === taskDefinitions.length;
  const claimStatus = claimTx.isLoading ? 'Claiming...' : claimTx.isSuccess ? 'Claim successful!' : claimTx.isError ? 'Claim failed' : undefined;

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Base Network Rewards</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Build, reward, and claim on Base.</h1>
              <p className="mt-2 max-w-2xl text-slate-300">Connect your wallet, complete onboarding tasks, and claim reward tokens on Base Sepolia.</p>
            </div>
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Connected Wallet</p>
              <p className="mt-2 text-lg font-semibold text-white">{address ?? 'Not connected'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Base Sepolia Balance</p>
              <p className="mt-2 text-lg font-semibold text-white">{balance?.formatted ? `${balance.formatted} ${balance.symbol}` : '—'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Total Supply</p>
              <p className="mt-2 text-lg font-semibold text-white">{totalSupply ? `${Number(totalSupply) / 1e18} BRT` : 'Loading...'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Pending Rewards</p>
              <p className="mt-2 text-lg font-semibold text-white">{userReward ? `${Number(userReward) / 1e18} BRT` : '—'}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Task Board</h2>
                <p className="mt-1 text-slate-400">Complete these actions to earn reward tokens.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 px-4 py-2 text-sm text-sky-300">Reward pool: {completedReward} BRT</div>
            </div>
            <div className="grid gap-4">
              {taskDefinitions.map((task) => (
                <div key={task.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{task.title}</p>
                      <p className="mt-2 text-sm text-slate-400">{task.description}</p>
                    </div>
                    <div className="rounded-full bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-300">{task.reward} BRT</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCompletedTasks((current) =>
                        current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id]
                      );
                    }}
                    className={`mt-5 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                      completedTasks.includes(task.id)
                        ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {completedTasks.includes(task.id) ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              ))}
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <label className="text-sm font-semibold text-slate-300">Tweet Link</label>
              <input
                value={tweetLink}
                onChange={(event) => setTweetLink(event.target.value)}
                placeholder="Paste your tweet URL"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
              />
              <p className="text-sm text-slate-400">This is a UI placeholder for off-chain verification and rewards issuance.</p>
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">Claim Rewards</h2>
              <p className="text-slate-400">Reward claims are mintable on-chain and prevent double claims.</p>
            </div>
            <button
              type="button"
              disabled={!isConnected || !canClaim || claimWrite.isLoading}
              onClick={() => claimWrite.write?.()}
              className="w-full rounded-3xl bg-sky-500 px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {claimWrite.isLoading ? 'Submitting...' : 'Claim Reward'}
            </button>
            {claimStatus ? <p className="text-sm text-slate-300">{claimStatus}</p> : null}
            <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Claim requirement</span>
                <span>{canClaim ? 'Ready' : 'Pending'}</span>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                Complete all tasks, submit your tweet link, and connect your wallet. Claim is only enabled after task completion.
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="text-xl font-semibold text-white">Tokenomics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Community</p>
              <p className="mt-3 text-3xl font-semibold text-white">50%</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Team</p>
              <p className="mt-3 text-3xl font-semibold text-white">20%</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Liquidity</p>
              <p className="mt-3 text-3xl font-semibold text-white">30%</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
