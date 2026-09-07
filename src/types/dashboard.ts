export type EventType =
  | 'login'
  | 'logout'
  | 'boss-kill'
  | 'capture'
  | 'guild-event'
  | 'server-restart';

export type MapFeatureType = 'base' | 'tower' | 'boss' | 'resource';

export interface ServerStatus {
  online: boolean;
  currentPlayers: number;
  maxPlayers: number;
  uptime: string;
  version: string;
  serverIp: string;
  connectInstructions: string;
  lastUpdated: string;
}

export interface PlayerRecord {
  id: string;
  name: string;
  characterLevel: number;
  guild: string;
  playtimeHours: number;
  palsCaptured: number;
  richestPlayers: number;
}

export interface StatsHistoryPoint {
  timestamp: string;
  players: number;
}

export interface ActivityHistoryPoint {
  timestamp: string;
  logins: number;
  logouts: number;
  bossKills: number;
  captures: number;
}

export interface DashboardStats {
  totalPlayers: number;
  totalGuilds: number;
  totalCaptures: number;
  totalBossKills: number;
  totalPlayTime: number;
  playerCountHistory: StatsHistoryPoint[];
  activityHistory: ActivityHistoryPoint[];
}

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: EventType;
  player?: string;
  details: string;
}

export interface LeaderboardRow {
  name: string;
  value: number;
  label?: string;
}

export interface Leaderboards {
  highestLevel: LeaderboardRow[];
  mostPlaytime: LeaderboardRow[];
  mostPalsCaptured: LeaderboardRow[];
  richestPlayers: LeaderboardRow[];
  largestGuilds: LeaderboardRow[];
}

export interface MapFeature {
  id: string;
  name: string;
  type: MapFeatureType;
  x: number;
  y: number;
  description: string;
}

export interface MapData {
  features: MapFeature[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServerInfo {
  rules: string[];
  mods: string[];
  restartSchedule: string[];
  backupSchedule: string[];
  faq: FaqItem[];
}

export interface DashboardApi {
  getStatus(): Promise<ServerStatus>;
  getPlayers(): Promise<PlayerRecord[]>;
  getStats(): Promise<DashboardStats>;
  getEvents(): Promise<ServerEvent[]>;
  getLeaderboards(): Promise<Leaderboards>;
  getMapData(): Promise<MapData>;
  getServerInfo(): Promise<ServerInfo>;
}
