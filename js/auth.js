const DUMMY_CREDENTIALS = {
  username: 'player',
  password: 'play1234'
};

function initAuth(page) {
  if (page === 'login') {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');
      const usernameError = document.getElementById('login-username-error');
      const passwordError = document.getElementById('login-password-error');

      let valid = true;
      [
        { field: usernameInput, error: usernameError, message: 'Username is required.' },
        { field: passwordInput, error: passwordError, message: 'Password is required.' }
      ].forEach(({ field, error, message }) => {
        if (!field || !error) return;
        if (!field.value.trim()) {
          field.classList.add('input-error');
          error.textContent = message;
          valid = false;
        } else {
          field.classList.remove('input-error');
          error.textContent = '';
        }
      });

      if (!valid) return;

      if (usernameInput.value === DUMMY_CREDENTIALS.username && passwordInput.value === DUMMY_CREDENTIALS.password) {
        localStorage.setItem('sandai-session', JSON.stringify({ loggedIn: true }));
        window.location.href = './join.html';
      } else {
        passwordInput.classList.add('input-error');
        passwordError.textContent = 'Invalid credentials. Try player / play1234.';
      }
    });
  }

  if (page === 'join') {
    const form = document.getElementById('join-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameField = document.getElementById('join-name');
      const teamField = document.getElementById('join-team');
      const gameField = document.getElementById('join-game');
      const fields = [
        { field: nameField, errorId: 'join-name-error', message: 'Enter your name.' },
        { field: teamField, errorId: 'join-team-error', message: 'Enter your team name.' },
        { field: gameField, errorId: 'join-game-error', message: 'Enter your game or sport.' }
      ];
      let valid = true;

      fields.forEach(({ field, errorId, message }) => {
        const error = document.getElementById(errorId);
        if (!field || !error) return;
        if (!field.value.trim()) {
          field.classList.add('input-error');
          error.textContent = message;
          valid = false;
        } else {
          field.classList.remove('input-error');
          error.textContent = '';
        }
      });

      if (!valid) return;

      localStorage.setItem('sandai-player', JSON.stringify({
        name: nameField.value.trim(),
        team: teamField.value.trim(),
        game: gameField.value.trim(),
        joinedAt: new Date().toISOString()
      }));
      window.location.href = './pages/dashboard.html';
    });
  }

  if (page === 'dashboard') {
    const session = localStorage.getItem('sandai-player');
    if (!session) {
      window.location.href = '../login.html';
      return;
    }

    const player = JSON.parse(session);
    document.getElementById('hero-title').textContent = `Welcome, ${player.name}`;
    document.getElementById('hero-tagline').textContent = `Ready to follow ${player.team} in the ${player.game} league.`;
    document.getElementById('hero-description').textContent = 'Browse your tournament overview and keep track of matches, standings, and announcements.';
  }
}
