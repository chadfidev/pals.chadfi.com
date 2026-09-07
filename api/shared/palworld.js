const DEFAULT_API_USERNAME = 'admin';

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
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

const buildCandidateBases = (baseUrl) => {
  const trimmed = baseUrl.replace(/\/$/, '');
  const rootFromBase = trimmed.replace(/\/(v1\/api|api\/v1|api)$/, '');

  const candidates = new Set([trimmed, rootFromBase, `${rootFromBase}/v1/api`, `${rootFromBase}/api/v1`, `${rootFromBase}/api`]);

  return dedupe([...candidates].filter((item) => !!item));
};

const getConfig = () => {
  const baseUrl = (process.env.PALWORLD_API_BASE ?? '').replace(/\/$/, '');
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

      if (response.ok) {
        return response.json();
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

const buildSyntheticHistory = (value) =>
  Array.from({ length: 14 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - idx));
    return {
      timestamp: date.toLocaleDateString(),
      players: Math.max(0, value + (idx % 7) - 3)
    };
  });

const buildActivityHistory = (base) =>
  Array.from({ length: 14 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - idx));
    return {
      timestamp: date.toLocaleDateString(),
      logins: Math.max(0, Math.floor(base / 2) + (idx % 4)),
      logouts: Math.max(0, Math.floor(base / 3)),
      bossKills: idx % 5 === 0 ? 1 : 0,
      captures: 20 + ((idx + base) % 40)
    };
  });

const mapPlayers = (payload) =>
  (Array.isArray(payload?.players) ? payload.players : []).map((player, index) => ({
    id: player.playerId || player.userId || player.accountName || `p-${index + 1}`,
    name: player.name || player.accountName || `Player ${index + 1}`,
    characterLevel: toNumber(player.level, 0),
    guild: player.guild || 'Unassigned',
    playtimeHours: 0,
    palsCaptured: 0,
    richestPlayers: 0
  }));

const topBy = (players, metric, label = 'guild', top = 5) =>
  [...players]
    .sort((a, b) => (toNumber(b[metric], 0) - toNumber(a[metric], 0)))
    .slice(0, top)
    .map((player) => ({
      name: player.name,
      value: toNumber(player[metric], 0),
      label: player[label]
    }));

const largestGuilds = (players) => {
  const counts = {};
  for (const player of players) {
    const guild = player.guild || 'Unassigned';
    counts[guild] = (counts[guild] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, memberCount]) => ({
      name,
      value: memberCount,
      label: `${memberCount} member${memberCount === 1 ? '' : 's'}`
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

const getStatus = async () => {
  const config = getConfig();
  const [info, metrics] = await Promise.all([requestPalworld('/info'), requestPalworld('/metrics')]);
  const status = {
    online: true,
    currentPlayers: toNumber(metrics.currentplayernum, 0),
    maxPlayers: toNumber(metrics.maxplayernum, 32),
    uptime: formatUptime(metrics.uptime),
    version: info.version || 'unknown',
    serverIp: `${config.connectHost}`,
    connectInstructions: `Join with ${config.connectPassword}`,
    lastUpdated: toIsoUtcLabel()
  };

  return status;
};

const getPlayers = async () => {
  const response = await requestPalworld('/players');
  return mapPlayers(response);
};

const getStats = async () => {
  const metrics = await requestPalworld('/metrics');
  const currentPlayers = toNumber(metrics.currentplayernum, 0);

  return {
    totalPlayers: toNumber(metrics.currentplayernum, 0),
    totalGuilds: 0,
    totalCaptures: 0,
    totalBossKills: 0,
    totalPlayTime: Math.floor(toNumber(metrics.uptime, 0) / 3600),
    playerCountHistory: buildSyntheticHistory(currentPlayers),
    activityHistory: buildActivityHistory(currentPlayers)
  };
};

const getEvents = async () => {
  const now = toIsoUtcLabel();
  return [
    {
      id: `evt-${Date.now()}`,
      timestamp: now,
      type: 'server-restart',
      details: 'Live event feed is not yet exposed by Palworld REST API endpoints.'
    }
  ];
};

const getLeaderboards = async () => {
  const players = mapPlayers(await requestPalworld('/players'));
  return {
    highestLevel: topBy(players, 'characterLevel'),
    mostPlaytime: topBy(players, 'playtimeHours'),
    mostPalsCaptured: topBy(players, 'palsCaptured'),
    richestPlayers: topBy(players, 'richestPlayers'),
    largestGuilds: largestGuilds(players)
  };
};

const getMapData = async () => {
  return {
    features: []
  };
};

const getServerInfo = async () => {
  const info = await requestPalworld('/settings');
  return {
    rules: [
      `Server mode: ${info.bPublicServer ? 'Public' : 'Private'}`,
      `Player cap: ${toNumber(info.ServerPlayerMaxNum, 0) || 'not configured'}`,
      'Actions like kick/ban are disabled in this read-only dashboard.'
    ],
    mods: ['No additional mods surfaced through this dashboard API.'],
    restartSchedule: ['No scheduled restart endpoint configured yet.'],
    backupSchedule: ['Backups are managed on the server host.'],
    faq: [
      {
        question: 'Is this read-only mode?',
        answer: 'Yes. Actions are not enabled yet.'
      },
      {
        question: 'Why is uptime rounded to seconds?',
        answer: 'Current read model uses the server metrics endpoint directly.'
      }
    ]
  };
};

module.exports = {
  setCors,
  getStatus,
  getPlayers,
  getStats,
  getEvents,
  getLeaderboards,
  getMapData,
  getServerInfo
};
