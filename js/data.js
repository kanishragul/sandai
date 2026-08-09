const tournamentData = {
  tournamentName: 'Sandai League',
  tagline: 'A premium college tournament platform built for dynamic league action.',
  status: 'In Progress',
  description: 'A scalable league format for colleges and clubs, designed to support any number of teams with clean fixtures, live standings, and rich match detail.',
  venue: 'North Campus Arena',
  organizer: 'Student Sports Council',
  contactEmail: 'tournament@sdai.edu',
  contactPhone: '+1 (555) 014-2210',
  teams: [
    { id: 1, name: 'Phoenix United', shortName: 'PHX', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=160&q=80', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, status: 'Rising' },
    { id: 2, name: 'Apex Tigers', shortName: 'APT', logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=160&q=80', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, status: 'Hot' },
    { id: 3, name: 'Nova Falcons', shortName: 'NVF', logo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=160&q=80', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, status: 'Balanced' },
    { id: 4, name: 'Harbor Lions', shortName: 'HBL', logo: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=160&q=80', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, status: 'Solid' },
    { id: 5, name: 'Summit Stars', shortName: 'SMS', logo: 'https://images.unsplash.com/photo-1521417531039-7c4f9c1c5f2d?auto=format&fit=crop&w=160&q=80', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, status: 'Forming' },
    { id: 6, name: 'Atlas Wolves', shortName: 'ATW', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=160&q=80', played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, status: 'Ready' }
  ],
  matches: [
    { id: 1, teamA: 'Phoenix United', teamB: 'Apex Tigers', date: '2026-08-10', time: '18:30', venue: 'North Campus Arena', status: 'upcoming', scoreA: null, scoreB: null },
    { id: 2, teamA: 'Nova Falcons', teamB: 'Harbor Lions', date: '2026-08-10', time: '20:15', venue: 'West Field', status: 'live', scoreA: 2, scoreB: 1 },
    { id: 3, teamA: 'Summit Stars', teamB: 'Atlas Wolves', date: '2026-08-09', time: '19:00', venue: 'East Court', status: 'completed', scoreA: 1, scoreB: 1 },
    { id: 4, teamA: 'Phoenix United', teamB: 'Nova Falcons', date: '2026-08-12', time: '17:45', venue: 'North Campus Arena', status: 'upcoming', scoreA: null, scoreB: null },
    { id: 5, teamA: 'Harbor Lions', teamB: 'Summit Stars', date: '2026-08-11', time: '19:30', venue: 'South Ground', status: 'completed', scoreA: 3, scoreB: 1 },
    { id: 6, teamA: 'Atlas Wolves', teamB: 'Apex Tigers', date: '2026-08-13', time: '18:15', venue: 'West Field', status: 'upcoming', scoreA: null, scoreB: null }
  ],
  announcements: [
    { id: 1, title: 'League format updated', date: '2026-08-08', category: 'Update', description: 'The fixture generator now adapts to any team count with a flexible round-robin structure.' },
    { id: 2, title: 'Venue change', date: '2026-08-07', category: 'Schedule', description: 'The next fixture has moved to the West Field due to maintenance on the main court.' },
    { id: 3, title: 'Media day reminder', date: '2026-08-06', category: 'Notice', description: 'All participating teams must submit roster details before the next weekend fixture.' }
  ],
  gallery: [
    { id: 1, title: 'Opening night', image: 'https://images.unsplash.com/photo-1521417531039-7c4f9c1c5f2d?auto=format&fit=crop&w=900&q=80', category: 'Moments' },
    { id: 2, title: 'Training focus', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80', category: 'Training' },
    { id: 3, title: 'Crowd energy', image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80', category: 'Crowd' },
    { id: 4, title: 'Matchday setup', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80', category: 'Moments' }
  ],
  statistics: {
    totalGoals: 10,
    topScorer: 'Ava Morales',
    defensiveTeam: 'Atlas Wolves',
    recentForm: ['W', 'D', 'L', 'W']
  }
};

const rules = [
  'Each team plays every other team once in a round-robin league format.',
  'A win earns 3 points, a draw earns 1, and a loss earns 0.',
  'The league ranking is determined by points, then goal difference, then goals scored.'
];

const aboutSections = [
  { title: 'League Format', content: 'This tournament uses a flexible league system that scales from small to large team counts.' },
  { title: 'Scoring System', content: 'Teams are awarded 3 points for a win, 1 for a draw, and 0 for a loss.' },
  { title: 'Match Format', content: 'Every contest is played as a single fixture with a clear venue, time, and result log.' }
];
