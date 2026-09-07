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
  level?: number;
  ping?: number;
  ip?: string;
  guild?: string;
  steamId?: string;
  connectedAt?: string;
}

export interface DashboardStats {
  uptimeSeconds: number;
  uptime: string;
  frameRate: number;
  fps: number;
  playersCurrent: number;
  playersMax: number;
  tickRate?: number;
  ping?: number;
  raw: Record<string, unknown>;
}

export interface ServerInfo {
  serverName: string;
  description: string;
  version: string;
  worldGuid?: string;
  settings: Array<{ key: string; value: string }>;
  infoRows: string[];
}

export interface DashboardApi {
  getStatus(): Promise<ServerStatus>;
  getPlayers(): Promise<PlayerRecord[]>;
  getStats(): Promise<DashboardStats>;
  getServerInfo(): Promise<ServerInfo>;
}
