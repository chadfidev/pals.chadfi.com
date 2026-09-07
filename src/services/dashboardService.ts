import {
  DashboardApi,
  DashboardStats,
  PlayerRecord,
  ServerInfo,
  ServerStatus
} from '../types/dashboard';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

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

  getServerInfo(): Promise<ServerInfo> {
    return this.get<ServerInfo>('/api/server-info');
  }
}

class DashboardService implements DashboardApi {
  private live = new HttpDashboardApi();

  getStatus(): Promise<ServerStatus> {
    return this.live.getStatus();
  }

  getPlayers(): Promise<PlayerRecord[]> {
    return this.live.getPlayers();
  }

  getStats(): Promise<DashboardStats> {
    return this.live.getStats();
  }

  getServerInfo(): Promise<ServerInfo> {
    return this.live.getServerInfo();
  }
}

export const dashboardApi: DashboardApi = new DashboardService();
