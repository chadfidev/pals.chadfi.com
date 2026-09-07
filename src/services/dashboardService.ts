import {
  DashboardApi,
  DashboardStats,
  Leaderboards,
  MapData,
  PlayerRecord,
  ServerEvent,
  ServerInfo,
  ServerStatus
} from '../types/dashboard';
import { mockLeaderboards, mockMapData, mockPlayers, mockEvents, mockServerInfo, mockStatus, mockStats } from '../data/mockData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const SIMULATED_DELAY_MS = 320;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class HttpDashboardApi implements DashboardApi {
  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Request to ${path} failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  getStatus(): Promise<ServerStatus> {
    return this.get<ServerStatus>('/api/status');
  }

  getPlayers(): Promise<PlayerRecord[]> {
    return this.get<PlayerRecord[]>('/api/players');
  }

  getStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>('/api/stats');
  }

  getEvents(): Promise<ServerEvent[]> {
    return this.get<ServerEvent[]>('/api/events');
  }

  getLeaderboards(): Promise<Leaderboards> {
    return this.get<Leaderboards>('/api/leaderboards');
  }

  getMapData(): Promise<MapData> {
    return this.get<MapData>('/api/map');
  }

  getServerInfo(): Promise<ServerInfo> {
    return this.get<ServerInfo>('/api/server-info');
  }
}

class MockDashboardApi implements DashboardApi {
  async getStatus(): Promise<ServerStatus> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockStatus);
  }

  async getPlayers(): Promise<PlayerRecord[]> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockPlayers);
  }

  async getStats(): Promise<DashboardStats> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockStats);
  }

  async getEvents(): Promise<ServerEvent[]> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockEvents);
  }

  async getLeaderboards(): Promise<Leaderboards> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockLeaderboards);
  }

  async getMapData(): Promise<MapData> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockMapData);
  }

  async getServerInfo(): Promise<ServerInfo> {
    await sleep(SIMULATED_DELAY_MS);
    return clone(mockServerInfo);
  }
}

class DashboardService implements DashboardApi {
  private live = new HttpDashboardApi();

  private async resolveLiveOrMock<T>(request: () => Promise<T>, fallback: T): Promise<T> {
    try {
      return await request();
    } catch {
      return clone(fallback);
    }
  }

  getStatus(): Promise<ServerStatus> {
    return this.resolveLiveOrMock(() => this.live.getStatus(), mockStatus);
  }

  getPlayers(): Promise<PlayerRecord[]> {
    return this.resolveLiveOrMock(() => this.live.getPlayers(), mockPlayers);
  }

  getStats(): Promise<DashboardStats> {
    return this.resolveLiveOrMock(() => this.live.getStats(), mockStats);
  }

  getEvents(): Promise<ServerEvent[]> {
    return this.resolveLiveOrMock(() => this.live.getEvents(), mockEvents);
  }

  getLeaderboards(): Promise<Leaderboards> {
    return this.resolveLiveOrMock(() => this.live.getLeaderboards(), mockLeaderboards);
  }

  getMapData(): Promise<MapData> {
    return this.resolveLiveOrMock(() => this.live.getMapData(), mockMapData);
  }

  getServerInfo(): Promise<ServerInfo> {
    return this.resolveLiveOrMock(() => this.live.getServerInfo(), mockServerInfo);
  }
}

export const dashboardApi: DashboardApi = new DashboardService();
