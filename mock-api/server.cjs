const http = require('http');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const mockPayload = {
  status: {
    online: true,
    currentPlayers: 31,
    maxPlayers: 128,
    uptime: '5d 14h 22m',
    version: 'v0.3.8.1',
    serverIp: '185.124.44.22:8211',
    connectInstructions: 'Join using direct connect and set password: chadfi-2026',
    lastUpdated: '2026-09-07 11:10:03 UTC'
  },
  players: [
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
    }
  ],
  stats: {
    totalPlayers: 1824,
    totalGuilds: 36,
    totalCaptures: 12748,
    totalBossKills: 1982,
    totalPlayTime: 21480,
    playerCountHistory: [
      { timestamp: '2026-08-25', players: 34 },
      { timestamp: '2026-08-26', players: 39 },
      { timestamp: '2026-08-27', players: 41 },
      { timestamp: '2026-08-28', players: 44 },
      { timestamp: '2026-08-29', players: 46 },
      { timestamp: '2026-08-30', players: 51 },
      { timestamp: '2026-08-31', players: 48 },
      { timestamp: '2026-09-01', players: 50 },
      { timestamp: '2026-09-02', players: 57 },
      { timestamp: '2026-09-03', players: 60 },
      { timestamp: '2026-09-04', players: 58 },
      { timestamp: '2026-09-05', players: 63 },
      { timestamp: '2026-09-06', players: 66 },
      { timestamp: '2026-09-07', players: 69 }
    ],
    activityHistory: [
      { timestamp: '2026-08-25', logins: 20, logouts: 14, bossKills: 1, captures: 25 },
      { timestamp: '2026-08-26', logins: 22, logouts: 16, bossKills: 2, captures: 31 },
      { timestamp: '2026-08-27', logins: 25, logouts: 16, bossKills: 3, captures: 45 },
      { timestamp: '2026-08-28', logins: 27, logouts: 20, bossKills: 3, captures: 51 },
      { timestamp: '2026-08-29', logins: 28, logouts: 21, bossKills: 2, captures: 60 },
      { timestamp: '2026-08-30', logins: 24, logouts: 19, bossKills: 1, captures: 44 },
      { timestamp: '2026-08-31', logins: 26, logouts: 19, bossKills: 3, captures: 47 },
      { timestamp: '2026-09-01', logins: 30, logouts: 17, bossKills: 2, captures: 55 },
      { timestamp: '2026-09-02', logins: 33, logouts: 22, bossKills: 4, captures: 70 },
      { timestamp: '2026-09-03', logins: 35, logouts: 24, bossKills: 2, captures: 64 },
      { timestamp: '2026-09-04', logins: 38, logouts: 21, bossKills: 3, captures: 80 },
      { timestamp: '2026-09-05', logins: 39, logouts: 25, bossKills: 5, captures: 82 },
      { timestamp: '2026-09-06', logins: 42, logouts: 30, bossKills: 6, captures: 90 },
      { timestamp: '2026-09-07', logins: 46, logouts: 31, bossKills: 3, captures: 92 }
    ]
  },
  events: [
    {
      id: 'e2',
      timestamp: '2026-09-07 10:46:02',
      type: 'login',
      player: 'MoraShards',
      details: 'Connected from NA-West edge.'
    },
    {
      id: 'e1',
      timestamp: '2026-09-07 10:59:14',
      type: 'boss-kill',
      player: 'HexRunner',
      details: 'Defeated Alpha Pal boss at Ember Valley.'
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
      id: 'e9',
      timestamp: '2026-09-07 09:00:03',
      type: 'server-restart',
      details: 'Auto-maintenance restart triggered. Queue cleared.'
    }
  ],
  leaderboards: {
    highestLevel: [
      { name: 'LumenDrift', value: 82, label: 'Night Hounds' },
      { name: 'HexRunner', value: 90, label: 'Aether Bloom' },
      { name: 'KairoForge', value: 74, label: 'Night Hounds' }
    ],
    mostPlaytime: [
      { name: 'HexRunner', value: 640, label: 'Aether Bloom' },
      { name: 'LumenDrift', value: 512, label: 'Night Hounds' },
      { name: 'RiftAnchor', value: 590, label: 'Solar Pact' }
    ],
    mostPalsCaptured: [
      { name: 'HexRunner', value: 129, label: 'Aether Bloom' },
      { name: 'LumenDrift', value: 104, label: 'Night Hounds' },
      { name: 'KairoForge', value: 91, label: 'Night Hounds' }
    ],
    richestPlayers: [
      { name: 'HexRunner', value: 24780, label: 'Aether Bloom' },
      { name: 'RiftAnchor', value: 21100, label: 'Solar Pact' },
      { name: 'LumenDrift', value: 20210, label: 'Night Hounds' }
    ],
    largestGuilds: [
      { name: 'Night Hounds', value: 15200, label: '5 members' },
      { name: 'Aether Bloom', value: 13110, label: '4 members' },
      { name: 'Forgebound', value: 11400, label: '4 members' }
    ]
  },
  map: {
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
        id: 'boss-1',
        name: 'Stone Maw',
        type: 'boss',
        x: 27,
        y: 61,
        description: 'Boss encounter with recurring respawn cycles.'
      },
      {
        id: 'resource-1',
        name: 'Quartz Node',
        type: 'resource',
        x: 51,
        y: 19,
        description: 'Rich ore cluster used for end-game crafting.'
      }
    ]
  },
  serverInfo: {
    rules: [
      'No exploitative botting, macroing, or scripted capture loops.',
      'PvP is allowed only in designated arenas and approved raid zones.'
    ],
    mods: ['Performance Enhancements (client optional).', 'Server-side world telemetry collector.'],
    restartSchedule: ['Daily: 06:00 UTC', 'Manual restart if critical patch shipped.'],
    backupSchedule: ['Hourly incremental snapshots.', 'Full backup at 00:00 UTC.'],
    faq: [
      {
        question: 'Can I transfer my character from another server?',
        answer: 'Not yet. External migration is planned for later milestones.'
      },
      {
        question: 'How do I create a new guild base?',
        answer: 'Claim a safe plot away from active conflict zones and register in #guild-planning.'
      }
    ]
  }
};

const endpoints = new Map([
  ['/api/status', mockPayload.status],
  ['/api/players', mockPayload.players],
  ['/api/stats', mockPayload.stats],
  ['/api/events', mockPayload.events],
  ['/api/leaderboards', mockPayload.leaderboards],
  ['/api/map', mockPayload.map],
  ['/api/server-info', mockPayload.serverInfo]
]);

const setCors = (response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const server = http.createServer((request, response) => {
  setCors(response);
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const payload = endpoints.get(request.url || '');
  if (!payload || request.method !== 'GET') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Endpoint not found in mock API.' }));
    return;
  }

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(payload));
});

server.listen(PORT, () => {
  console.log(`mock-api listening on http://localhost:${PORT}`);
  console.log('Endpoints:');
  for (const key of endpoints.keys()) {
    console.log(`  ${key}`);
  }
});
