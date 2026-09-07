const DEFAULT_API_USERNAME = 'admin';

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

const parseJsonResponse = async (response, requestPath) => {
  const text = await response.text();
  if (!text || !text.trim()) {
    throw createHttpError(response.status || 500, `Empty response body from ${requestPath}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw createHttpError(
      response.status || 500,
      `Non-JSON response from ${requestPath}: ${text.slice(0, 160)}`
    );
  }
};

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const formatUptime = (secondsValue) => {
  const seconds = toNumber(secondsValue, 0);
  const total = Math.max(0, Math.floor(seconds));

  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (!parts.length && s >= 0) parts.push(`${s}s`);

  return parts.join(' ');
};

const toIsoUtcLabel = () => new Date().toISOString().replace('T', ' ').replace('Z', ' UTC').slice(0, 24);

const dedupe = (items) => [...new Set(items)];

const normalizeMetricValue = (payload, keys, fallback = null) => {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const map = Object.create(null);
  for (const [k, value] of Object.entries(payload)) {
    map[String(k).toLowerCase()] = value;
    map[String(k).replace(/_/g, '').toLowerCase()] = value;
  }

  for (const key of keys) {
    const normalized = String(key).toLowerCase();
    if (map[normalized] !== undefined) {
      return map[normalized];
    }
    const underscored = normalized.replace(/_/g, '');
    if (map[underscored] !== undefined) {
      return map[underscored];
    }
  }

  return fallback;
};

const normalizePlayerList = (payload) => {
  const rawList = Array.isArray(payload?.players) ? payload.players : Array.isArray(payload) ? payload : [];

  return rawList.map((player, index) => {
    const playerId =
      player?.steamid ||
      player?.SteamId ||
      player?.playerId ||
      player?.id ||
      player?.uid ||
      `${index + 1}`;
    const name =
      player?.name ||
      player?.playerName ||
      player?.playername ||
      player?.nickname ||
      `Player ${index + 1}`;
    const level = normalizeMetricValue(player, ['level', 'Level', 'characterlevel'], null);
    const ping = normalizeMetricValue(player, ['ping', 'Ping'], null);
    const guild = player?.guild || player?.guildName || '';
    const ip = player?.ip || player?.address || player?.addr || '';
    const connectedAt = player?.connectedAt || player?.connectTime || player?.lastConnect || '';
    const steamId = player?.steamid || player?.SteamId || '';

    return {
      id: String(playerId),
      name: String(name),
      steamId: steamId ? String(steamId) : undefined,
      level: level !== null ? toNumber(level, 0) : undefined,
      ping: ping !== null ? toNumber(ping, 0) : undefined,
      guild: guild ? String(guild) : undefined,
      ip: ip ? String(ip) : undefined,
      connectedAt: connectedAt ? String(connectedAt) : undefined
    };
  });
};

const normalizeSettings = (payload) => {
  const valueBag = payload?.settings ?? payload;
  if (Array.isArray(valueBag)) {
    return valueBag
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const key = entry.key || entry.name || entry.param || entry.id;
        const value = entry.value ?? entry.Value ?? entry.val ?? entry.current;
        if (!key) {
          return null;
        }
        return {
          key: String(key),
          value: value !== undefined ? String(value) : ''
        };
      })
      .filter(Boolean);
  }

  if (valueBag && typeof valueBag === 'object') {
    return Object.entries(valueBag).map(([key, value]) => ({
      key: key,
      value: value !== undefined ? String(value) : ''
    }));
  }

  return [];
};

const sanitizeApiBase = (baseUrl) => baseUrl.replace(/\/$/, '');

const buildCandidateBases = (baseUrl) => {
  const trimmed = baseUrl.replace(/\/$/, '');
  const rootFromBase = trimmed.replace(/\/(v1\/api|api\/v1|api)$/, '');

  const candidates = new Set([trimmed, rootFromBase, `${rootFromBase}/v1/api`, `${rootFromBase}/api/v1`, `${rootFromBase}/api`]);

  return dedupe([...candidates].filter((item) => !!item));
};

const getConfig = () => {
  const rawBaseUrl = (process.env.PALWORLD_API_BASE ?? '').replace(/\/$/, '');
  const baseUrl = sanitizeApiBase(rawBaseUrl);
  if (!baseUrl) {
    throw createHttpError(500, 'PALWORLD_API_BASE is not configured');
  }

  const password = process.env.PALWORLD_API_PASSWORD ?? '';
  if (!password) {
    throw createHttpError(500, 'PALWORLD_API_PASSWORD is not configured');
  }

  const connectHost =
    process.env.PALWORLD_CONNECT_HOST || new URL(baseUrl).host.replace(':8212', ':8211');
  const connectPassword = process.env.PALWORLD_CONNECT_PASSWORD || 'Set this in server settings';
  const apiUsername = process.env.PALWORLD_API_USERNAME || DEFAULT_API_USERNAME;

  return {
    baseUrl,
    apiUsername,
    password,
    connectHost,
    connectPassword
  };
};

const requestPalworld = async (path) => {
  const config = getConfig();
  const requestPath = path.startsWith('/') ? path : `/${path}`;
  const baseCandidates = buildCandidateBases(config.baseUrl);
  let lastError = null;
  for (const base of baseCandidates) {
    try {
      const response = await fetch(`${base}${requestPath}`, {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(`${config.apiUsername}:${config.password}`).toString('base64'),
          Accept: 'application/json'
        }
      });

      if (response.status === 404) {
        lastError = createHttpError(
          response.status,
          `Palworld API missing ${requestPath} on ${base}`
        );
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        throw createHttpError(
          response.status,
          `Palworld API failed ${response.status} ${response.statusText}: ${text || 'No response body'}`
        );
      }

      return parseJsonResponse(response, requestPath);
    } catch (error) {
      if (error?.statusCode === 404) {
        continue;
      }

      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
};

const requestPalworldRequired = async (path) => {
  const config = getConfig();
  const requestPath = path.startsWith('/') ? path : `/${path}`;
  const baseCandidates = buildCandidateBases(config.baseUrl);
  let lastError = null;

  for (const base of baseCandidates) {
    try {
      const response = await fetch(`${base}${requestPath}`, {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(`${config.apiUsername}:${config.password}`).toString('base64'),
          Accept: 'application/json'
        }
      });

      if (response.ok) {
      return parseJsonResponse(response, requestPath);
      }

      const text = await response.text();
      const error = createHttpError(
        response.status,
        `Palworld API failed ${response.status} ${response.statusText}: ${text || 'No response body'}`
      );

      if (response.status === 404) {
        lastError = error;
        continue;
      }

      throw error;
    } catch (error) {
      if (error?.statusCode === 404) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || createHttpError(500, `Palworld API failed for all candidate bases: ${baseCandidates.join(', ')}`);
};

const setCors = (context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  context.res = context.res || {};
  context.res.headers = { ...(context.res.headers || {}), ...headers };
  return context;
};

const getStatus = async () => {
  const config = getConfig();
  const [info, metrics] = await Promise.all([
    requestPalworldRequired('/info'),
    requestPalworld('/metrics').catch(() => null)
  ]);

  const maxPlayers =
    toNumber(metrics?.maxplayernum, 0) ||
    toNumber(metrics?.maxplayers, 0) ||
    toNumber(info?.MaxPlayerNum, 0) ||
    toNumber(info?.maxPlayerNum, 0) ||
    0;
  const currentPlayers =
    toNumber(metrics?.currentplayernum, 0) ||
    toNumber(metrics?.playernum, 0) ||
    0;

  const status = {
    online: true,
    currentPlayers,
    maxPlayers: maxPlayers || 0,
    uptime: metrics?.uptime ? formatUptime(metrics.uptime) : 'Unavailable',
    version: info.version || 'unknown',
    serverIp: `${config.connectHost}`,
    connectInstructions: `Join with ${config.connectPassword}`,
    lastUpdated: toIsoUtcLabel()
  };

  return status;
};

const getPlayers = async () => {
  const response = await requestPalworldRequired('/players');
  const players = normalizePlayerList(response);
  return players;
};

const getStats = async () => {
  const metrics = await requestPalworldRequired('/metrics');

  const frameRate = toNumber(normalizeMetricValue(metrics, ['fps', 'framerate', 'frameRate']), 0);
  const fps = toNumber(normalizeMetricValue(metrics, ['currentfps', 'serverfps', 'server_fps']), frameRate);
  const ping = toNumber(normalizeMetricValue(metrics, ['ping', 'avgping', 'averagePing']), 0);
  const tickRate = toNumber(normalizeMetricValue(metrics, ['tickrate', 'tick_rate']), 0);
  const currentPlayers = toNumber(
    normalizeMetricValue(metrics, ['currentplayernum', 'currentplayers', 'playernum', 'players', 'currentPlayerNum']),
    0
  );
  const maxPlayers = toNumber(
    normalizeMetricValue(metrics, ['maxplayernum', 'maxplayers', 'maxPlayerNum', 'PlayerLimit']),
    0
  );

  return {
    uptimeSeconds: toNumber(metrics?.uptime, 0),
    uptime: formatUptime(metrics?.uptime),
    frameRate,
    fps,
    playersCurrent: currentPlayers,
    playersMax: maxPlayers,
    tickRate: tickRate || undefined,
    ping: ping || undefined,
    raw: metrics
  };
};

const getServerInfo = async () => {
  const [info, settings] = await Promise.all([
    requestPalworldRequired('/info'),
    requestPalworldRequired('/settings')
  ]);
  const normalizedSettings = normalizeSettings(settings).slice(0, 200);

  return {
    serverName: info.servername || info.name || 'Chadfi Palworld',
    description: info.description || 'No server description configured.',
    version: info.version || 'unknown',
    worldGuid: info.worldguid || info.worldGuid || undefined,
    settings: normalizedSettings,
    infoRows: [
      `Server info endpoint: ${info.version ? '/v1/api/info' : '/v1/api/info'}`,
      `Current mode: ${info.bPublicServer ? 'Public' : 'Private / friends-only'}`,
      `Player max: ${toNumber(info.maxPlayerNum, toNumber(info.MaxPlayerNum, 0)) || 'unknown'}`
    ],
  };
};

module.exports = {
  setCors,
  getStatus,
  getPlayers,
  getStats,
  getServerInfo
};
