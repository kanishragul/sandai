const AUTH_USER_KEY = 'sandai-user';
const AUTH_SESSION_KEY = 'sandai-session';
const DUMMY_CREDENTIALS = {
  username: 'player',
  password: 'play1234',
  name: 'Guest Player'
};

function getStoredUser() {
  return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
}

function saveUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function saveSession(username) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ loggedIn: true, username }));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function getSession() {
  return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
}

function redirectTo(path) {
  window.location.href = path;
}

function rootPath() {
  return window.location.pathname.includes('/pages/') ? '../index.html' : './index.html';
}

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

      const user = getStoredUser();
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if ((user && username === user.username && password === user.password) ||
          (username === DUMMY_CREDENTIALS.username && password === DUMMY_CREDENTIALS.password)) {
        saveSession(username);
        redirectTo('./pages/dashboard.html');
        return;
      }

      passwordInput.classList.add('input-error');
      passwordError.textContent = 'Invalid credentials. Try player / play1234 or sign up.';
    });
  }

  if (page === 'signup') {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameField = document.getElementById('signup-name');
      const usernameField = document.getElementById('signup-username');
      const passwordField = document.getElementById('signup-password');
      const fields = [
        { field: nameField, errorId: 'signup-name-error', message: 'Enter your full name.' },
        { field: usernameField, errorId: 'signup-username-error', message: 'Create a username.' },
        { field: passwordField, errorId: 'signup-password-error', message: 'Create a password.' }
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

      const newUser = {
        name: nameField.value.trim(),
        username: usernameField.value.trim(),
        password: passwordField.value.trim()
      };

      saveUser(newUser);
      saveSession(newUser.username);
      redirectTo('./pages/dashboard.html');
    });
  }

  if (page === 'dashboard') {
    const session = getSession();
    if (!session || !session.loggedIn) {
      redirectTo('../index.html');
      return;
    }

    const user = getStoredUser();
    const playerName = user?.name || DUMMY_CREDENTIALS.name;
    const title = document.getElementById('hero-title');
    const tagline = document.getElementById('hero-tagline');
    const description = document.getElementById('hero-description');

    if (title) title.textContent = `Welcome, ${playerName}`;
    if (tagline) tagline.textContent = `Your tournament hub is ready.`;
    if (description) description.textContent = 'Browse your tournament overview and keep track of matches, standings, and announcements.';

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        clearSession();
        redirectTo('../index.html');
      });
    }
  }

  if (!['login', 'signup', 'dashboard'].includes(page)) {
    const session = getSession();
    if (!session || !session.loggedIn) {
      redirectTo(rootPath());
    }
  }
}
