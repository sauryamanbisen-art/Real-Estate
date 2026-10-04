'use strict';

/**
 * MONTGOMERY Real Estate — Authentication Script
 * Handles Sign In, Registration, Password Strength Meter, Form Validation,
 * Visibility Toggles, and LocalStorage Session State.
 */

/* ==========================================
   DEFAULT DEMO USERS SEED
   ========================================== */

const DEFAULT_DEMO_USER = {
  name: 'Demo User',
  email: 'demo@montgomery.com',
  password: 'password123',
  registeredAt: new Date().toISOString()
};

function getRegisteredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem('montgomery_users'));
    if (Array.isArray(users) && users.length > 0) {
      return users;
    }
  } catch (e) {
    console.error('Failed to parse montgomery_users', e);
  }
  // Initialize with demo user if empty
  const defaultList = [DEFAULT_DEMO_USER];
  localStorage.setItem('montgomery_users', JSON.stringify(defaultList));
  return defaultList;
}

function saveRegisteredUsers(users) {
  localStorage.setItem('montgomery_users', JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('montgomery_current_user') || 'null');
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('montgomery_current_user', JSON.stringify({
      name: user.name,
      email: user.email,
      loggedInAt: new Date().toISOString()
    }));
  } else {
    localStorage.removeItem('montgomery_current_user');
  }
  updateHeaderAuthUI();
}

function signOut() {
  setCurrentUser(null);
  window.location.reload();
}

/* ==========================================
   DOM INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initSignInForm();
  initRegisterForm();
  updateHeaderAuthUI();
});

/* ==========================================
   HEADER AUTH STATE
   ========================================== */

function updateHeaderAuthUI() {
  const user = getCurrentUser();
  const navbarActions = document.querySelector('.navbar-actions');
  if (!navbarActions) return;

  if (user) {
    const firstName = user.name ? user.name.split(' ')[0] : 'Member';
    navbarActions.innerHTML = `
      <span class="user-greeting" style="color: var(--color-gold); font-size: var(--fs-small); font-weight: var(--fw-medium); display: flex; align-items: center; gap: 4px;">
        <span class="material-symbols-rounded" style="font-size: 18px;" aria-hidden="true">account_circle</span>
        <span>${escapeHtml(firstName)}</span>
      </span>
      <button type="button" class="nav-action-link" id="signOutBtn" style="background:none; border:none; cursor:pointer; color: var(--color-text-secondary); font-size: var(--fs-small); transition: color var(--transition-fast);">
        Sign Out
      </button>
    `;

    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut();
      });
    }
  }
}

/* ==========================================
   PASSWORD VISIBILITY TOGGLE
   ========================================== */

function initPasswordToggles() {
  const toggles = document.querySelectorAll('[data-toggle-password]');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-toggle-password');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('.material-symbols-rounded');

      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.textContent = 'visibility_off';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        if (icon) icon.textContent = 'visibility';
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });
}

/* ==========================================
   SIGN IN LOGIC
   ========================================== */

function initSignInForm() {
  const form = document.getElementById('signinForm');
  if (!form) return;

  const emailInput = document.getElementById('signinEmail');
  const passwordInput = document.getElementById('signinPassword');
  const emailError = document.getElementById('signinEmailError');
  const passwordError = document.getElementById('signinPasswordError');
  const statusEl = document.getElementById('signinStatus');
  const submitBtn = document.getElementById('signinSubmit');

  // Clear errors on input
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('error');
      if (emailError) emailError.textContent = '';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      passwordInput.classList.remove('error');
      if (passwordError) passwordError.textContent = '';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    // Validate email
    if (!email) {
      setFieldError(emailInput, emailError, 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setFieldError(passwordInput, passwordError, 'Password is required.');
      isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    setButtonLoading(submitBtn, true);
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }

    // Simulate verification delay
    setTimeout(() => {
      const users = getRegisteredUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user && user.password === password) {
        // Successful sign in
        setCurrentUser(user);
        if (statusEl) {
          statusEl.textContent = `Welcome back, ${user.name}! Redirecting...`;
          statusEl.className = 'form-status success';
        }

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } else {
        // Failed sign in
        setButtonLoading(submitBtn, false);
        if (statusEl) {
          statusEl.textContent = 'Invalid email or password. Demo login: demo@montgomery.com / password123';
          statusEl.className = 'form-status error';
        }
        if (passwordInput) passwordInput.classList.add('error');
      }
    }, 600);
  });
}

/* ==========================================
   REGISTRATION LOGIC
   ========================================== */

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const nameInput = document.getElementById('registerName');
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const confirmInput = document.getElementById('registerConfirm');

  const nameError = document.getElementById('registerNameError');
  const emailError = document.getElementById('registerEmailError');
  const passwordError = document.getElementById('registerPasswordError');
  const confirmError = document.getElementById('registerConfirmError');

  const statusEl = document.getElementById('registerStatus');
  const submitBtn = document.getElementById('registerSubmit');

  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');

  // Password strength meter
  if (passwordInput && strengthFill && strengthText) {
    passwordInput.addEventListener('input', () => {
      passwordInput.classList.remove('error');
      if (passwordError) passwordError.textContent = '';

      const val = passwordInput.value;
      const strength = calculatePasswordStrength(val);

      strengthFill.style.width = strength.percent + '%';
      strengthFill.style.backgroundColor = strength.color;
      strengthText.textContent = val ? strength.label : '';
    });
  }

  // Clear inputs on change
  [nameInput, emailInput, confirmInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        inp.classList.remove('error');
        const err = document.getElementById(inp.id + 'Error');
        if (err) err.textContent = '';
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = 'form-status';
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const confirm = confirmInput ? confirmInput.value : '';

    // Validate Name
    if (!name) {
      setFieldError(nameInput, nameError, 'Full name is required.');
      isValid = false;
    } else if (name.length < 2) {
      setFieldError(nameInput, nameError, 'Please enter at least 2 characters.');
      isValid = false;
    }

    // Validate Email
    if (!email) {
      setFieldError(emailInput, emailError, 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Password
    if (!password) {
      setFieldError(passwordInput, passwordError, 'Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setFieldError(passwordInput, passwordError, 'Password must be at least 8 characters.');
      isValid = false;
    }

    // Validate Confirm Password
    if (!confirm) {
      setFieldError(confirmInput, confirmError, 'Please confirm your password.');
      isValid = false;
    } else if (password !== confirm) {
      setFieldError(confirmInput, confirmError, 'Passwords do not match.');
      isValid = false;
    }

    if (!isValid) return;

    // Check if email already registered
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setFieldError(emailInput, emailError, 'An account with this email already exists.');
      return;
    }

    // Show loading state
    setButtonLoading(submitBtn, true);
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }

    // Simulate account creation delay
    setTimeout(() => {
      const newUser = {
        name,
        email,
        password,
        registeredAt: new Date().toISOString()
      };

      users.push(newUser);
      saveRegisteredUsers(users);
      setCurrentUser(newUser);

      if (statusEl) {
        statusEl.textContent = `Welcome, ${name}! Your account has been created. Redirecting...`;
        statusEl.className = 'form-status success';
      }

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1400);
    }, 700);
  });
}

/* ==========================================
   PASSWORD STRENGTH CALCULATOR
   ========================================== */

function calculatePasswordStrength(password) {
  if (!password) return { percent: 0, color: 'transparent', label: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { percent: 25, color: '#ef5350', label: 'Weak' };
  } else if (score === 2) {
    return { percent: 50, color: '#ff9800', label: 'Fair' };
  } else if (score === 3 || score === 4) {
    return { percent: 75, color: '#c9a84c', label: 'Good' };
  } else {
    return { percent: 100, color: '#4caf50', label: 'Strong' };
  }
}

/* ==========================================
   HELPERS
   ========================================== */

function setFieldError(input, errorEl, message) {
  if (input) input.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function setButtonLoading(btn, isLoading) {
  if (!btn) return;
  const textEl = btn.querySelector('.btn-text');
  const loaderEl = btn.querySelector('.btn-loader');

  btn.disabled = isLoading;
  if (textEl) textEl.style.opacity = isLoading ? '0' : '1';
  if (loaderEl) loaderEl.style.display = isLoading ? 'inline-block' : 'none';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
