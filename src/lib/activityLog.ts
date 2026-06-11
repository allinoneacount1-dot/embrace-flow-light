import { MOCK_LOG, type LogEntry } from "@/components/numina/sanctum/mock";

const STORAGE_KEY = "numina:activity-log:v1";
const EVT = "numina:activity-log";
const MAX = 200;

type Listener = (entries: LogEntry[]) => void;
const listeners = new Set<Listener>();
let nextId = Math.max(0, ...MOCK_LOG.map((e) => e.id)) + 1;
let memory: LogEntry[] = [...MOCK_LOG];

function isBrowser() {
  return typeof window !== "undefined";
}

function hydrate() {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LogEntry[];
      if (Array.isArray(parsed) && parsed.length) {
        memory = parsed;
        nextId = Math.max(nextId, ...parsed.map((e) => e.id)) + 1;
      }
    }
  } catch {}
}
hydrate();

function persist() {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory.slice(0, MAX)));
  } catch {}
}

function emit() {
  const snap = [...memory];
  listeners.forEach((l) => l(snap));
  if (isBrowser()) window.dispatchEvent(new CustomEvent(EVT));
}

export function getActivityLog(): LogEntry[] {
  return [...memory];
}

export function pushActivity(entry: Omit<LogEntry, "id" | "at"> & { at?: string }): LogEntry {
  const created: LogEntry = { id: nextId++, at: entry.at ?? "now", ...entry };
  memory = [created, ...memory].slice(0, MAX);
  persist();
  emit();
  return created;
}

export function subscribeActivity(fn: Listener): () => void {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        memory = JSON.parse(e.newValue);
        fn([...memory]);
      } catch {}
    }
  };
  if (isBrowser()) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    if (isBrowser()) window.removeEventListener("storage", onStorage);
  };
}

// ---- Mock realtime stream: emits periodic ambient events ----
const AMBIENT: Array<Omit<LogEntry, "id" | "at">> = [
  { numen: "Ember of Pyth", kind: "decision", text: "Signal: 5m MA bullish cross" },
  { numen: "Watcher in the Liquidity", kind: "alert", text: "Whale tx · 218 SOL → Orca" },
  { numen: "Ember of Pyth", kind: "trade", text: "Buy 1.8 SOL · 142.04 USDC" },
  { numen: "Choir of Mean Reversion", kind: "decision", text: "Hold · z-score 0.4" },
  { numen: "Watcher in the Liquidity", kind: "decision", text: "Heartbeat · oracles green" },
  { numen: "Ember of Pyth", kind: "trade", text: "Sell 1.0 SOL · 142.91 · +0.87" },
];

let started = false;
export function startAmbientStream() {
  if (started || !isBrowser()) return;
  started = true;
  let i = Math.floor(Math.random() * AMBIENT.length);
  setInterval(() => {
    const e = AMBIENT[i++ % AMBIENT.length];
    pushActivity(e);
  }, 9000);
}

export function clearActivityLog() {
  memory = [...MOCK_LOG];
  persist();
  emit();
}