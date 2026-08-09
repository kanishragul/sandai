const tournamentData = {
  tournamentName: 'Sandai League',
  tagline: 'A premium college tournament platform built for dynamic league action.',
  status: 'In Progress',
  description: 'A scalable league format for colleges and clubs, designed to support any number of teams with clean fixtures, live standings, and rich match detail.',
  venue: 'North Campus Arena',
  organizer: 'Student Sports Council',
  contactEmail: 'tournament@sdai.edu',
  contactPhone: '+1 (555) 014-2210',
  teams: [],
  matches: [],
  announcements: [],
  statistics: {
    totalGoals: 0,
    topScorer: 'TBD',
    defensiveTeam: 'TBD',
    recentForm: []
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
