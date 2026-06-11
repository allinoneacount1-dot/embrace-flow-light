export type MockNumen = {
  id: string;
  name: string;
  seed: string;
  purpose: "trading" | "monitor" | "task";
  status: "awake" | "silence" | "failed";
  pnl: number;
  winRate: number;
  actions: number;
  uptime: number;
  lastAction: string;
};

export const MOCK_NUMINA: MockNumen[] = [
  {
    id: "0001",
    name: "Ember of Pyth",
    seed: "wallet-ember-pyth",
    purpose: "trading",
    status: "awake",
    pnl: 124.32,
    winRate: 0.71,
    actions: 184,
    uptime: 0.992,
    lastAction: "Bought 4.2 SOL @ 142.31 · 12s ago",
  },
  {
    id: "0002",
    name: "Watcher in the Liquidity",
    seed: "wallet-watcher-liquidity",
    purpose: "monitor",
    status: "awake",
    pnl: 0,
    winRate: 0,
    actions: 904,
    uptime: 0.999,
    lastAction: "Pinged · whale tx 312 SOL · 1m ago",
  },
  {
    id: "0003",
    name: "Choir of Mean Reversion",
    seed: "wallet-choir-mean-reversion",
    purpose: "trading",
    status: "silence",
    pnl: -8.7,
    winRate: 0.58,
    actions: 42,
    uptime: 0.84,
    lastAction: "Paused — risk ceiling reached · 2h ago",
  },
  {
    id: "0004",
    name: "Daemon of the Breakout",
    seed: "wallet-daemon-breakout",
    purpose: "trading",
    status: "failed",
    pnl: -2.1,
    winRate: 0.31,
    actions: 11,
    uptime: 0.42,
    lastAction: "Failed — oracle stale · 4h ago",
  },
];

export type LogEntry = {
  id: number;
  numen: string;
  kind: "decision" | "trade" | "alert" | "error";
  text: string;
  at: string;
};

export const MOCK_LOG: LogEntry[] = [
  { id: 9, numen: "Ember of Pyth", kind: "trade", text: "Buy 4.2 SOL · 142.31 USDC", at: "12s" },
  { id: 8, numen: "Watcher in the Liquidity", kind: "alert", text: "Whale tx detected · 312 SOL → Raydium", at: "1m" },
  { id: 7, numen: "Ember of Pyth", kind: "decision", text: "Signal: bullish cross on 5m MA", at: "1m" },
  { id: 6, numen: "Watcher in the Liquidity", kind: "decision", text: "Skip — confidence 0.41 < 0.6", at: "3m" },
  { id: 5, numen: "Ember of Pyth", kind: "trade", text: "Sell 2.0 SOL · 141.04 USDC · +0.83", at: "8m" },
  { id: 4, numen: "Daemon of the Breakout", kind: "error", text: "Oracle stale > 30s — entering Silence", at: "4h" },
  { id: 3, numen: "Choir of Mean Reversion", kind: "alert", text: "Daily loss limit reached — paused", at: "2h" },
  { id: 2, numen: "Ember of Pyth", kind: "trade", text: "Buy 3.0 SOL · 140.88 USDC", at: "9m" },
  { id: 1, numen: "Watcher in the Liquidity", kind: "decision", text: "Heartbeat · 12 oracles green", at: "11m" },
];