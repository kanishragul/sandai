document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const page = body.dataset.page || 'home';

  initNavigation();
  applyActiveNav(page);

  if (page === 'home') {
    renderHomepage();
  }

  if (page === 'teams') {
    renderTeams();
    bindTeamFilters();
  }

  if (page === 'fixtures' || page === 'schedule' || page === 'results') {
    renderMatchesPage(page);
    bindMatchFilters(page);
  }

  if (page === 'standings') {
    renderStandings();
  }

  if (page === 'statistics') {
    renderStatistics();
  }

  if (page === 'announcements') {
    renderAnnouncements();
  }

  if (page === 'gallery') {
    renderGallery();
  }

  if (page === 'about') {
    renderAbout();
  }

  if (page === 'contact') {
    initContactForm();
  }

  if (page === 'match') {
    renderMatchDetail();
  }
});

function initNavigation() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function applyActiveNav(page) {
  document.querySelectorAll('[data-site-nav] a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const targetPage = href.replace('./', '').replace('.html', '').replace('pages/', '');
    if (targetPage === page || (page === 'home' && targetPage === 'index')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderHomepage() {
  const leader = getStandings()[0];
  const nextMatch = getMatches().find((match) => match.status === 'upcoming');
  const recentResults = getMatches().filter((match) => match.status === 'completed').slice(0, 3);

  document.getElementById('hero-title').textContent = tournamentData.tournamentName;
  document.getElementById('hero-tagline').textContent = tournamentData.tagline;
  document.getElementById('hero-description').textContent = tournamentData.description;
  document.getElementById('hero-status').textContent = tournamentData.status;
  document.getElementById('hero-teams').textContent = `${tournamentData.teams.length} teams`;
  document.getElementById('hero-matches').textContent = `${getMatches().length} fixtures`;
  document.getElementById('hero-leader').textContent = leader ? leader.name : '—';
  document.getElementById('hero-next').textContent = nextMatch ? `${nextMatch.teamA} vs ${nextMatch.teamB}` : 'No upcoming fixtures';

  renderList('recent-results', recentResults.map(createRecentResultMarkup));
  renderList('featured-teams', tournamentData.teams.slice(0, 3).map(createFeaturedTeamMarkup));
  renderList('upcoming-home', getMatches().filter((match) => match.status === 'upcoming').slice(0, 3).map(createMatchMarkup));
  renderStandingsTable('standings-home', getStandings(), 5);

  document.getElementById('stats-total-teams').textContent = tournamentData.teams.length;
  document.getElementById('stats-total-matches').textContent = getMatches().length;
  document.getElementById('stats-completed').textContent = getMatches().filter((m) => m.status === 'completed').length;
  document.getElementById('stats-remaining').textContent = getMatches().filter((m) => m.status !== 'completed').length;
  document.getElementById('stats-goals').textContent = tournamentData.statistics.totalGoals;
  document.getElementById('stats-leader').textContent = leader ? leader.name : '—';
  document.getElementById('stats-top-scorer').textContent = tournamentData.statistics.topScorer;
  document.getElementById('stats-defensive').textContent = tournamentData.statistics.defensiveTeam;
}

function bindTeamFilters() {
  const searchInput = document.getElementById('team-search');
  const statusSelect = document.getElementById('team-status');
  const sortSelect = document.getElementById('team-sort');

  [searchInput, statusSelect, sortSelect].forEach((element) => {
    if (element) {
      element.addEventListener('input', renderTeams);
      element.addEventListener('change', renderTeams);
    }
  });
}

function renderTeams() {
  const container = document.getElementById('team-list');
  if (!container) return;

  const query = document.getElementById('team-search')?.value?.toLowerCase() || '';
  const statusFilter = document.getElementById('team-status')?.value || 'all';
  const sortValue = document.getElementById('team-sort')?.value || 'points';

  let teams = [...getStandings()];

  teams = teams.filter((team) => {
    const match = `${team.name} ${team.shortName} ${team.status}`.toLowerCase();
    const matchesQuery = match.includes(query);
    const statusMatch = statusFilter === 'all' || team.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesQuery && statusMatch;
  });

  teams.sort((a, b) => {
    if (sortValue === 'points') return b.points - a.points;
    if (sortValue === 'wins') return b.wins - a.wins;
    if (sortValue === 'goals') return b.goalsFor - a.goalsFor;
    return a.position - b.position;
  });

  container.innerHTML = teams.map((team) => `
    <article class="team-card">
      <div class="team-top">
        <img class="team-logo" src="${team.logo}" alt="${team.name} logo" />
        <div class="team-meta">
          <h3>${team.name}</h3>
          <div class="short">${team.shortName}</div>
        </div>
      </div>
      <div class="team-stats">
        <div class="team-stat"><strong>${team.played}</strong><span>Played</span></div>
        <div class="team-stat"><strong>${team.wins}</strong><span>Wins</span></div>
        <div class="team-stat"><strong>${team.points}</strong><span>Points</span></div>
      </div>
      <div class="card-header">
        <span class="badge">${team.status}</span>
        <span class="muted">#${team.position}</span>
      </div>
      <a class="btn btn-secondary" href="./match.html?team=${encodeURIComponent(team.name)}">View details</a>
    </article>
  `).join('');
}

function bindMatchFilters(page) {
  const searchInput = document.getElementById('match-search');
  const statusSelect = document.getElementById('match-status');
  const teamSelect = document.getElementById('match-team');

  [searchInput, statusSelect, teamSelect].forEach((element) => {
    if (element) {
      element.addEventListener('input', () => renderMatchesPage(page));
      element.addEventListener('change', () => renderMatchesPage(page));
    }
  });
}

function renderMatchesPage(page) {
  const container = document.getElementById('match-list');
  if (!container) return;

  const statusFilter = document.getElementById('match-status')?.value || 'all';
  const teamFilter = document.getElementById('match-team')?.value || 'all';
  const searchValue = document.getElementById('match-search')?.value?.toLowerCase() || '';

  let matches = [...getMatches()];
  matches = matches.filter((match) => {
    const statusMatch = statusFilter === 'all' || match.status === statusFilter;
    const teamMatch = teamFilter === 'all' || match.teamA === teamFilter || match.teamB === teamFilter;
    const searchMatch = `${match.teamA} ${match.teamB} ${match.venue}`.toLowerCase().includes(searchValue);
    return statusMatch && teamMatch && searchMatch;
  });

  const grouped = {
    upcoming: matches.filter((m) => m.status === 'upcoming'),
    live: matches.filter((m) => m.status === 'live'),
    completed: matches.filter((m) => m.status === 'completed')
  };

  const sections = [
    ['Upcoming', grouped.upcoming],
    ['Live', grouped.live],
    ['Completed', grouped.completed]
  ];

  const filteredSections = page === 'results'
    ? sections.filter(([title]) => title === 'Completed')
    : page === 'schedule'
      ? sections.filter(([title]) => title === 'Upcoming' || title === 'Live')
      : sections;

  container.innerHTML = filteredSections.map(([title, items]) => `
    <section class="panel">
      <div class="section-heading">
        <div>
          <h3>${title}</h3>
          <p>${items.length} ${title.toLowerCase()} fixtures</p>
        </div>
      </div>
      ${items.length ? items.map(createMatchMarkup).join('') : '<div class="empty-state">No fixtures in this category.</div>'}
    </section>
  `).join('');

  const teamOptions = ['all', ...tournamentData.teams.map((team) => team.name)];
  const teamSelect = document.getElementById('match-team');
  if (teamSelect && teamSelect.children.length <= 1) {
    teamSelect.innerHTML = teamOptions.map((team) => `<option value="${team}">${team === 'all' ? 'All teams' : team}</option>`).join('');
  }

  const pageTitle = document.querySelector('[data-page-title]');
  if (pageTitle) {
    pageTitle.textContent = page === 'results' ? 'Results' : page === 'schedule' ? 'Schedule' : 'Fixtures';
  }
}

function renderStandings() {
  const tableBody = document.getElementById('standings-table-body');
  if (!tableBody) return;
  renderStandingsTable('standings-table-body', getStandings(), 20);
}

function renderStandingsTable(containerId, standings, limit) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  const rows = standings.slice(0, limit).map((team) => `
    <tr class="${team.position === 1 ? 'current-leader' : ''}">
      <td>${team.position}</td>
      <td>${team.name}</td>
      <td>${team.played}</td>
      <td>${team.wins}</td>
      <td>${team.draws}</td>
      <td>${team.losses}</td>
      <td>${team.goalsFor}</td>
      <td>${team.goalsAgainst}</td>
      <td>${team.goalDifference}</td>
      <td>${team.points}</td>
    </tr>
  `).join('');

  container.innerHTML = rows;
}

function renderStatistics() {
  const standings = getStandings();
  const leader = standings[0];
  const topScorer = tournamentData.statistics.topScorer;
  const defensive = tournamentData.statistics.defensiveTeam;

  document.getElementById('stats-total-teams').textContent = tournamentData.teams.length;
  document.getElementById('stats-total-matches').textContent = getMatches().length;
  document.getElementById('stats-completed').textContent = getMatches().filter((m) => m.status === 'completed').length;
  document.getElementById('stats-remaining').textContent = getMatches().filter((m) => m.status !== 'completed').length;
  document.getElementById('stats-goals').textContent = tournamentData.statistics.totalGoals;
  document.getElementById('stats-leader').textContent = leader ? leader.name : '—';
  document.getElementById('stats-top-scorer').textContent = topScorer;
  document.getElementById('stats-defensive').textContent = defensive;

  const chart = document.getElementById('stats-chart');
  if (chart) {
    chart.innerHTML = standings.slice(0, 4).map((team) => `
      <div class="chart-row">
        <div class="card-header"><strong>${team.name}</strong><span>${team.points} pts</span></div>
        <div class="chart-bar"><span style="width:${Math.min(100, (team.points / 18) * 100)}%"></span></div>
      </div>
    `).join('');
  }
}

function renderAnnouncements() {
  const container = document.getElementById('announcement-list');
  if (!container) return;
  container.innerHTML = tournamentData.announcements.map((announcement) => `
    <article class="announcement-card">
      <div class="card-header">
        <span class="badge upcoming">${announcement.category}</span>
        <span class="muted">${announcement.date}</span>
      </div>
      <h3>${announcement.title}</h3>
      <p>${announcement.description}</p>
    </article>
  `).join('');
}

function renderGallery() {
  const container = document.getElementById('gallery-list');
  if (!container) return;
  container.innerHTML = tournamentData.gallery.map((item) => `
    <article class="gallery-card">
      <img src="${item.image}" alt="${item.title}" />
      <div class="card-header">
        <h3>${item.title}</h3>
        <span class="badge">${item.category}</span>
      </div>
      <button type="button" data-preview="${item.image}">Preview</button>
    </article>
  `).join('');

  container.querySelectorAll('[data-preview]').forEach((button) => {
    button.addEventListener('click', () => {
      const lightbox = document.getElementById('lightbox');
      const image = document.getElementById('lightbox-image');
      if (!lightbox || !image) return;
      image.src = button.getAttribute('data-preview');
      lightbox.classList.add('active');
    });
  });

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
  }
}

function renderAbout() {
  const container = document.getElementById('about-list');
  if (!container) return;
  container.innerHTML = aboutSections.map((section) => `
    <article class="detail-card">
      <h3>${section.title}</h3>
      <p class="muted">${section.content}</p>
    </article>
  `).join('');

  const rulesContainer = document.getElementById('rules-list');
  if (rulesContainer) {
    rulesContainer.innerHTML = rules.map((rule) => `<li>${rule}</li>`).join('');
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = ['contact-name', 'contact-email', 'contact-message'];
    let valid = true;

    fields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(`${fieldId}-error`);
      if (!field || !error) return;
      if (!field.value.trim()) {
        field.classList.add('input-error');
        error.textContent = 'This field is required.';
        valid = false;
      } else {
        field.classList.remove('input-error');
        error.textContent = '';
      }
    });

    const emailField = document.getElementById('contact-email');
    const emailError = document.getElementById('contact-email-error');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField && emailError && emailField.value && !emailPattern.test(emailField.value)) {
      emailField.classList.add('input-error');
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    if (valid) {
      document.getElementById('form-success').classList.remove('hidden');
      form.reset();
    }
  });
}

function renderMatchDetail() {
  const params = new URLSearchParams(window.location.search);
  const teamName = params.get('team');
  const heading = document.getElementById('match-detail-heading');
  const detail = document.getElementById('match-detail');
  if (!heading || !detail) return;

  const team = tournamentData.teams.find((entry) => entry.name === teamName) || tournamentData.teams[0];
  heading.textContent = `${team.name} profile`;
  detail.innerHTML = `
    <article class="detail-card">
      <div class="team-top">
        <img class="team-logo" src="${team.logo}" alt="${team.name} logo" />
        <div>
          <h3>${team.name}</h3>
          <p class="muted">${team.shortName} • ${team.status}</p>
        </div>
      </div>
      <div class="team-stats">
        <div class="team-stat"><strong>${team.played}</strong><span>Played</span></div>
        <div class="team-stat"><strong>${team.wins}</strong><span>Wins</span></div>
        <div class="team-stat"><strong>${team.points}</strong><span>Points</span></div>
      </div>
    </article>
    <article class="detail-card">
      <h3>Upcoming fixtures</h3>
      <div class="kicker-list">
        ${getMatches().filter((match) => match.status === 'upcoming' && (match.teamA === team.name || match.teamB === team.name)).slice(0, 2).map((match) => `<div><span>${match.teamA} vs ${match.teamB}</span><span>${match.date}</span></div>`).join('')}
      </div>
    </article>
  `;
}

function createMatchMarkup(match) {
  const score = match.status === 'completed' ? `${match.scoreA} - ${match.scoreB}` : 'VS';
  const badgeClass = match.status === 'live' ? 'live' : match.status === 'completed' ? 'done' : 'upcoming';
  return `
    <article class="match-card">
      <div class="match-top">
        <span class="badge ${badgeClass}">${match.status}</span>
        <span class="muted">#${match.id}</span>
      </div>
      <div class="match-teams">
        <div class="team-pill"><img src="${getTeamLogo(match.teamA)}" alt="${match.teamA} logo" /><span>${match.teamA}</span></div>
        <div class="score">${score}</div>
        <div class="team-pill"><img src="${getTeamLogo(match.teamB)}" alt="${match.teamB} logo" /><span>${match.teamB}</span></div>
      </div>
      <div class="match-bottom">
        <div>
          <div class="muted">${match.date} • ${match.time}</div>
          <div class="muted">${match.venue}</div>
        </div>
        <span class="result-chip">${match.status === 'completed' ? 'Result logged' : 'Schedule'}</span>
      </div>
    </article>
  `;
}

function createFeaturedTeamMarkup(team) {
  return `
    <article class="info-card">
      <div class="team-top">
        <img class="team-logo" src="${team.logo}" alt="${team.name} logo" />
        <div>
          <h3>${team.name}</h3>
          <p class="muted">${team.shortName}</p>
        </div>
      </div>
      <p class="muted">${team.status} • ${team.points} pts</p>
    </article>
  `;
}

function createRecentResultMarkup(match) {
  return `
    <article class="info-card">
      <div class="card-header">
        <strong>${match.teamA} vs ${match.teamB}</strong>
        <span class="badge done">Result</span>
      </div>
      <p class="muted">${match.scoreA} - ${match.scoreB} • ${match.date}</p>
    </article>
  `;
}

function getTeamLogo(teamName) {
  const team = tournamentData.teams.find((entry) => entry.name === teamName);
  return team ? team.logo : '';
}

function getMatches() {
  return tournamentData.matches;
}

function getStandings() {
  const standings = tournamentData.teams.map((team) => {
    const played = team.played || tournamentData.matches.filter((match) => match.status === 'completed' && (match.teamA === team.name || match.teamB === team.name)).length;
    const stats = tournamentData.matches.reduce((acc, match) => {
      if (match.status !== 'completed') return acc;
      if (match.teamA === team.name) {
        acc.goalsFor += match.scoreA || 0;
        acc.goalsAgainst += match.scoreB || 0;
        if ((match.scoreA || 0) > (match.scoreB || 0)) acc.wins += 1;
        else if ((match.scoreA || 0) < (match.scoreB || 0)) acc.losses += 1;
        else acc.draws += 1;
      }
      if (match.teamB === team.name) {
        acc.goalsFor += match.scoreB || 0;
        acc.goalsAgainst += match.scoreA || 0;
        if ((match.scoreB || 0) > (match.scoreA || 0)) acc.wins += 1;
        else if ((match.scoreB || 0) < (match.scoreA || 0)) acc.losses += 1;
        else acc.draws += 1;
      }
      return acc;
    }, { goalsFor: 0, goalsAgainst: 0, wins: 0, draws: 0, losses: 0 });

    return {
      ...team,
      ...stats,
      played: played || stats.wins + stats.draws + stats.losses,
      goalDifference: stats.goalsFor - stats.goalsAgainst,
      points: stats.wins * 3 + stats.draws,
      position: 0
    };
  });

  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  }).map((team, index) => ({ ...team, position: index + 1 }));
}

function renderList(id, html) {
  const container = document.getElementById(id);
  if (container) container.innerHTML = html.join('');
}
