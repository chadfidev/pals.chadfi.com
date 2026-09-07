import {
  ActivityHistoryPoint,
  DashboardStats,
  EventType,
  LeaderboardRow,
  Leaderboards,
  MapData,
  PlayerRecord,
  ServerEvent,
  ServerInfo,
  ServerStatus
} from '../types/dashboard';

export const mockStatus: ServerStatus = {
  online: true,
  currentPlayers: 31,
  maxPlayers: 128,
  uptime: '5d 14h 22m',
  version: 'v0.3.8.1',
  serverIp: '185.124.44.22:8211',
  connectInstructions: 'Join using direct connect and set password: chadfi-2026',
  lastUpdated: '2026-09-07 11:10:03 UTC'
};

export const mockPlayers: PlayerRecord[] = [
  {
    id: 'p-001',
    name: 'KairoForge',
    characterLevel: 74,
    guild: 'Night Hounds',
    playtimeHours: 421,
    palsCaptured: 91,
    richestPlayers: 18420
  },
  {
    id: 'p-002',
    name: 'VoltRaven',
    characterLevel: 69,
    guild: 'Aether Bloom',
    playtimeHours: 388,
    palsCaptured: 78,
    richestPlayers: 16890
  },
  {
    id: 'p-003',
    name: 'LumenDrift',
    characterLevel: 82,
    guild: 'Night Hounds',
    playtimeHours: 512,
    palsCaptured: 104,
    richestPlayers: 20210
  },
  {
    id: 'p-004',
    name: 'IronClaw',
    characterLevel: 55,
    guild: 'Forgebound',
    playtimeHours: 260,
    palsCaptured: 47,
    richestPlayers: 12650
  },
  {
    id: 'p-005',
    name: 'MoraShards',
    characterLevel: 62,
    guild: 'Solar Pact',
    playtimeHours: 302,
    palsCaptured: 63,
    richestPlayers: 15800
  },
  {
    id: 'p-006',
    name: 'HexRunner',
    characterLevel: 90,
    guild: 'Aether Bloom',
    playtimeHours: 640,
    palsCaptured: 129,
    richestPlayers: 24780
  },
  {
    id: 'p-007',
    name: 'GloamStitch',
    characterLevel: 43,
    guild: 'Forgebound',
    playtimeHours: 179,
    palsCaptured: 36,
    richestPlayers: 10110
  },
  {
    id: 'p-008',
    name: 'SkyLance',
    characterLevel: 77,
    guild: 'Dusk Cartel',
    playtimeHours: 447,
    palsCaptured: 97,
    richestPlayers: 19270
  },
  {
    id: 'p-009',
    name: 'NeonWisp',
    characterLevel: 58,
    guild: 'Dusk Cartel',
    playtimeHours: 234,
    palsCaptured: 57,
    richestPlayers: 13420
  },
  {
    id: 'p-010',
    name: 'RiftAnchor',
    characterLevel: 84,
    guild: 'Solar Pact',
    playtimeHours: 590,
    palsCaptured: 113,
    richestPlayers: 21100
  }
];

const now = Date.now();
const day = 1000 * 60 * 60 * 24;

export const mockStats: DashboardStats = {
  totalPlayers: 1824,
  totalGuilds: 36,
  totalCaptures: 12748,
  totalBossKills: 1982,
  totalPlayTime: 21480,
  playerCountHistory: Array.from({ length: 14 }).map((_, idx) => {
    const timestamp = new Date(now - (13 - idx) * day).toLocaleDateString();
    return {
      timestamp,
      players: 18 + Math.floor(26 * Math.sin((idx + 3) / 4)) + idx
    };
  }),
  activityHistory: Array.from({ length: 14 }).map((_, idx) => {
    const timestamp = new Date(now - (13 - idx) * day).toLocaleDateString();
    return {
      timestamp,
      logins: 20 + (idx % 5) + Math.floor(Math.random() * 8),
      logouts: 14 + (idx % 4) + Math.floor(Math.random() * 7),
      bossKills: 1 + Math.floor(Math.random() * 4),
      captures: 25 + Math.floor(Math.random() * 40)
    } as ActivityHistoryPoint;
  })
};

const eventTypes: EventType[] = [
  'login',
  'logout',
  'boss-kill',
  'capture',
  'guild-event',
  'server-restart'
];

export const mockEvents: ServerEvent[] = [
  {
    id: 'e1',
    timestamp: '2026-09-07 10:59:14',
    type: 'boss-kill',
    player: 'HexRunner',
    details: 'Defeated Alpha Pal boss at Ember Valley.'
  },
  {
    id: 'e2',
    timestamp: '2026-09-07 10:46:02',
    type: 'login',
    player: 'MoraShards',
    details: 'Connected from NA-West edge.'
  },
  {
    id: 'e3',
    timestamp: '2026-09-07 10:41:11',
    type: 'capture',
    player: 'NeonWisp',
    details: 'Captured Firefang at Frost Ridge.'
  },
  {
    id: 'e4',
    timestamp: '2026-09-07 10:28:39',
    type: 'guild-event',
    details: 'Night Hounds secured a new base in Iron Mesa.'
  },
  {
    id: 'e5',
    timestamp: '2026-09-07 09:57:00',
    type: 'logout',
    player: 'SkyLance',
    details: 'Session ended after late-night raid.'
  },
  {
    id: 'e6',
    timestamp: '2026-09-07 09:45:21',
    type: 'login',
    player: 'RiftAnchor',
    details: 'Joined from mobile reconnect.'
  },
  {
    id: 'e7',
    timestamp: '2026-09-07 09:32:15',
    type: 'capture',
    player: 'KairoForge',
    details: 'Captured Waterwing near Dawn Cliffs.'
  },
  {
    id: 'e8',
    timestamp: '2026-09-07 09:17:44',
    type: 'boss-kill',
    player: 'LumenDrift',
    details: 'Team-downed Crystal Serpent in Cinder Hollows.'
  },
  {
    id: 'e9',
    timestamp: '2026-09-07 09:00:03',
    type: 'server-restart',
    details: 'Auto-maintenance restart triggered. Queue cleared.'
  },
  {
    id: 'e10',
    timestamp: '2026-09-07 08:56:18',
    type: 'login',
    player: mockPlayers[Math.floor(Math.random() * mockPlayers.length)].name,
    details: `Connected using ${eventTypes[Math.floor(Math.random() * eventTypes.length)]} profile sync.`
  }
];

const topByName = (metric: keyof Pick<PlayerRecord, 'characterLevel' | 'playtimeHours' | 'palsCaptured' | 'richestPlayers'>) =>
  [...mockPlayers]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 5)
    .map((player) => ({
      name: player.name,
      value: player[metric],
      label: player.guild
    }));

const topGuilds = (): LeaderboardRow[] =>
  ['Night Hounds', 'Aether Bloom', 'Forgebound', 'Solar Pact', 'Dusk Cartel'].map((guild, index) => {
    const scores = [15200, 13110, 11400, 12640, 11870];
    return { name: guild, value: scores[index], label: `${5 + index} members` };
  });

export const mockLeaderboards: Leaderboards = {
  highestLevel: topByName('characterLevel'),
  mostPlaytime: topByName('playtimeHours'),
  mostPalsCaptured: topByName('palsCaptured'),
  richestPlayers: topByName('richestPlayers'),
  largestGuilds: topGuilds()
};

export const mockMapData: MapData = {
  features: [
    {
      id: 'base-1',
      name: 'Neon Bastion',
      type: 'base',
      x: 13,
      y: 35,
      description: 'Primary fortress for the Night Hounds guild.'
    },
    {
      id: 'base-2',
      name: 'Solar Keep',
      type: 'base',
      x: 63,
      y: 22,
      description: 'Solar Pact trading hub and staging base.'
    },
    {
      id: 'tower-1',
      name: 'Aegis Relay',
      type: 'tower',
      x: 38,
      y: 50,
      description: 'High-speed fast-travel tower with wide visibility.'
    },
    {
      id: 'tower-2',
      name: 'Crimson Spire',
      type: 'tower',
      x: 72,
      y: 58,
      description: 'Primary route gateway to eastern zones.'
    },
    {
      id: 'tower-3',
      name: 'Iron Crossing',
      type: 'tower',
      x: 45,
      y: 77,
      description: 'Used by merchants for quick transfers.'
    },
    {
      id: 'boss-1',
      name: 'Stone Maw',
      type: 'boss',
      x: 27,
      y: 61,
      description: 'Boss encounter with recurring respawn cycles.'
    },
    {
      id: 'boss-2',
      name: 'Frost Warden',
      type: 'boss',
      x: 84,
      y: 34,
      description: 'High difficulty event near frozen escarpment.'
    },
    {
      id: 'resource-1',
      name: 'Quartz Node',
      type: 'resource',
      x: 51,
      y: 19,
      description: 'Rich ore cluster used for end-game crafting.'
    },
    {
      id: 'resource-2',
      name: 'Blue Lotus Field',
      type: 'resource',
      x: 68,
      y: 45,
      description: 'Resource point with repeated harvest rotation.'
    },
    {
      id: 'resource-3',
      name: 'Moonroot Basin',
      type: 'resource',
      x: 22,
      y: 21,
      description: 'High concentration of moonroot and medicinal nodes.'
    }
  ]
};

export const mockServerInfo: ServerInfo = {
  rules: [
    'No exploitative botting, macroing, or scripted capture loops.',
    'PvP is allowed only in designated arenas and approved raid zones.',
    'Respect shared resources; rotate base placements after 72h cooldown.',
    'No harassment in chat; guild disputes are resolved by Moderation + GM review.'
  ],
  mods: [
    'Performance Enhancements (client optional) for smooth 60 FPS.',
    'Custom logging mod for uptime and event capture.',
    'Server-side world telemetry collector (read-only).'
  ],
  restartSchedule: [
    'Daily: 06:00 UTC (15-minute maintenance window).',
    'Manual rolling restart when critical patch deployed.',
    'Event mode can request forced restart every Sunday 03:00 UTC.'
  ],
  backupSchedule: [
    'Hourly incremental snapshots.',
    'Full backup at 00:00 UTC.',
    'Pre-restart backup retained for 30 days.'
  ],
  faq: [
    {
      question: 'Can I transfer my character from another server?',
      answer:
        'Not yet. External migration is planned for Season 2 and will require manual ticket verification.'
    },
    {
      question: 'How do I create a new guild base?',
      answer:
        'Claim a safe plot away from active conflict zones, build perimeter defenses, and register your territory in #guild-planning.'
    },
    {
      question: 'Is there an economy limit?',
      answer:
        'Large trade contracts above 100,000 gold are reviewed by moderation for fairness and anti-exploit checks.'
    },
    {
      question: 'What happens when server restarts?',
      answer:
        'You receive a 2-minute warning, and all active sessions are safely queued before maintenance begins.'
    }
  ]
};
