const matches = tournament.matches;

function standings() {
  const table = Object.fromEntries(tournament.teams.map((name) => [name, { name, played: 0, points: 0, difference: 0 }]));
  matches.filter((match) => match.status === 'completed').forEach((match) => {
    const home = table[match.home]; const away = table[match.away];
    home.played += 1; away.played += 1;
    home.difference += match.homeScore - match.awayScore; away.difference += match.awayScore - match.homeScore;
    if (match.homeScore > match.awayScore) home.points += 3;
    else if (match.awayScore > match.homeScore) away.points += 3;
    else { home.points += 1; away.points += 1; }
  });
  return Object.values(table).sort((a, b) => b.points - a.points || b.difference - a.difference || a.name.localeCompare(b.name));
}

function renderMatches(filter = 'all') {
  const visible = filter === 'all' ? matches : matches.filter((match) => match.status === filter);
  document.querySelector('#match-list').innerHTML = visible.map((match) => {
    const completed = match.status === 'completed'; const score = completed ? `${match.homeScore} – ${match.awayScore}` : 'vs';
    return `<article class="match ${match.status}"><div><span class="status">${completed ? 'Result' : 'Upcoming'}</span><p>${match.date} · ${match.time}</p></div><div class="fixture"><strong>${match.home}</strong><b>${score}</b><strong>${match.away}</strong></div><p class="venue">${match.venue}</p></article>`;
  }).join('') || '<p class="empty">No matches to show.</p>';
}

function renderStandings() {
  const ranked = standings();
  document.querySelector('#standings-list').innerHTML = ranked.map((team, index) => `<tr${index === 0 ? ' class="leader"' : ''}><td>${index + 1}</td><td>${team.name}</td><td>${team.played}</td><td>${team.difference > 0 ? '+' : ''}${team.difference}</td><td><strong>${team.points}</strong></td></tr>`).join('');
  document.querySelector('#leader-name').textContent = ranked[0].name;
}

function renderTeams() {
  document.querySelector('#team-list').innerHTML = standings().map((team, index) => `<article class="team"><span>${String(index + 1).padStart(2, '0')}</span><h3>${team.name}</h3><p>${team.points} pts · ${team.played} played</p></article>`).join('');
}

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active'); renderMatches(button.dataset.filter);
}));
document.querySelector('#team-count').textContent = tournament.teams.length;
document.querySelector('#match-count').textContent = matches.length;
document.querySelector('#played-count').textContent = matches.filter((match) => match.status === 'completed').length;
renderMatches(); renderStandings(); renderTeams();
