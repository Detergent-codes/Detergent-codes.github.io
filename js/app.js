/**
 * Main Application Controller & UI Coordinator
 * Reads and applies all variables from PORTFOLIO_CONFIG dynamically.
 */

// Global Toast Notification Helper
window.toast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    warning: '!',
    info: 'ℹ',
    error: '✕'
  };

  toastEl.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${iconMap[type] || '•'}</span>
      <span class="toast-text">${escapeHtml(message)}</span>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  const closeBtn = toastEl.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toastEl.remove();
  });

  container.appendChild(toastEl);

  setTimeout(() => {
    if (toastEl.parentElement) {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(10px)';
      toastEl.style.transition = 'all 0.3s ease';
      setTimeout(() => toastEl.remove(), 300);
    }
  }, 4000);
};

class AppController {
  constructor() {
    this.init();
  }

  init() {
    this.applyThemeVariables();
    this.initNavigation();
    this.populateProfileData();
    this.renderTerminalWidget();
    this.renderSkillsSection();
    this.populateContactData();
    this.initLiveClock();
  }

  /**
   * Dynamically applies theme and styling variables from config.js to CSS Custom Properties
   */
  applyThemeVariables() {
    if (!PORTFOLIO_CONFIG.theme) return;
    const root = document.documentElement;
    const t = PORTFOLIO_CONFIG.theme;

    // Accent Colors
    if (t.accentPrimary) root.style.setProperty('--accent-primary', t.accentPrimary);
    if (t.accentHover) root.style.setProperty('--accent-hover', t.accentHover);
    if (t.accentDim) root.style.setProperty('--accent-dim', t.accentDim);
    if (t.accentGlow) root.style.setProperty('--accent-glow', t.accentGlow);
    if (t.accentBorder) root.style.setProperty('--accent-border', t.accentBorder);

    // Backgrounds
    if (t.bgMain) root.style.setProperty('--bg-main', t.bgMain);
    if (t.bgSubtle) root.style.setProperty('--bg-subtle', t.bgSubtle);
    if (t.bgCard) root.style.setProperty('--bg-card', t.bgCard);
    if (t.bgCardHover) root.style.setProperty('--bg-card-hover', t.bgCardHover);
    if (t.bgInput) root.style.setProperty('--bg-input', t.bgInput);
    if (t.bgGlass) root.style.setProperty('--bg-glass', t.bgGlass);

    // Text
    if (t.textPrimary) root.style.setProperty('--text-primary', t.textPrimary);
    if (t.textSecondary) root.style.setProperty('--text-secondary', t.textSecondary);
    if (t.textMuted) root.style.setProperty('--text-muted', t.textMuted);

    // Borders & Radii
    if (t.borderSubtle) root.style.setProperty('--border-subtle', t.borderSubtle);
    if (t.borderCard) root.style.setProperty('--border-card', t.borderCard);
    if (t.borderRadiusSm) root.style.setProperty('--border-radius-sm', t.borderRadiusSm);
    if (t.borderRadiusMd) root.style.setProperty('--border-radius-md', t.borderRadiusMd);
    if (t.borderRadiusLg) root.style.setProperty('--border-radius-lg', t.borderRadiusLg);
  }

  initNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }

    // Scrollspy for active nav link
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          current = sectionId;
        }
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  populateProfileData() {
    const p = PORTFOLIO_CONFIG.profile || {};

    const heroName = document.getElementById('hero-user-name');
    const heroTitle = document.getElementById('hero-user-title');
    const heroBio = document.getElementById('hero-user-bio');
    const heroStatus = document.getElementById('hero-status-text');
    const logoText = document.getElementById('logo-text');
    const logoImg = document.getElementById('logo-img');
    const footerName = document.getElementById('footer-name');
    const parallaxBg = document.querySelector('.hero-parallax-bg');

    if (heroName && p.name) heroName.textContent = p.name;
    if (heroTitle && p.heroSubtitle) heroTitle.textContent = p.heroSubtitle;
    if (heroBio && p.bio) heroBio.textContent = p.bio;
    if (heroStatus && p.statusText) heroStatus.textContent = p.statusText;
    if (logoText && p.logoText) logoText.textContent = p.logoText;
    if (logoImg && p.avatarUrl) logoImg.src = p.avatarUrl;
    if (footerName && p.name) footerName.textContent = `${p.name} (${p.handle || ''})`;
    if (parallaxBg && p.heroBackgroundUrl) parallaxBg.style.backgroundImage = `url('${p.heroBackgroundUrl}')`;

    // Footer Socials
    const footerSocials = document.getElementById('footer-socials');
    if (footerSocials && PORTFOLIO_CONFIG.socials) {
      footerSocials.innerHTML = PORTFOLIO_CONFIG.socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" title="${s.name}">
          <span>${s.name.charAt(0)}</span>
        </a>
      `).join('');
    }
  }

  renderTerminalWidget() {
    const termBody = document.getElementById('terminal-lines-container');
    const termTitle = document.getElementById('terminal-title-text');
    if (!termBody || !PORTFOLIO_CONFIG.terminal) return;

    if (termTitle && PORTFOLIO_CONFIG.terminal.title) {
      termTitle.textContent = PORTFOLIO_CONFIG.terminal.title;
    }

    const lines = PORTFOLIO_CONFIG.terminal.lines || [];
    termBody.innerHTML = lines.map(line => `
      <div class="terminal-line">
        <span class="terminal-prompt">${escapeHtml(line.prompt || '$')}</span>
        <span class="terminal-command">${escapeHtml(line.command)}</span>
      </div>
      <div class="terminal-response">${escapeHtml(line.response)}</div>
    `).join('') + `
      <div class="terminal-line" style="margin-top: 0.75rem;">
        <span class="terminal-prompt">$</span>
        <span class="terminal-cursor"></span>
      </div>
    `;
  }

  renderSkillsSection() {
    const skillsContainer = document.getElementById('skills-categories-grid');
    if (!skillsContainer || !PORTFOLIO_CONFIG.skills) return;

    skillsContainer.innerHTML = PORTFOLIO_CONFIG.skills.map(cat => `
      <div class="spotlight-card skill-card">
        <h3 class="skill-category-title">
          <span class="skill-category-icon">✦</span>
          <span>${escapeHtml(cat.category)}</span>
        </h3>
        <div class="skills-list">
          ${cat.items.map(item => `
            <div class="skill-item">
              <div class="skill-name-wrap">
                <span class="skill-icon">${item.icon || '⚡'}</span>
                <span class="skill-name">${escapeHtml(item.name)}</span>
              </div>
              <span class="skill-badge">${escapeHtml(item.level)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  populateContactData() {
    const c = PORTFOLIO_CONFIG.contact || {};
    const directEmail = document.getElementById('direct-email-val');
    const directEmailLink = document.getElementById('direct-email-link');
    const responseTimeEl = document.getElementById('direct-response-time');
    const locationEl = document.getElementById('direct-location-val');
    const subjectSelect = document.getElementById('contact-subject');

    if (directEmail && c.email) directEmail.textContent = c.email;
    if (directEmailLink && c.email) directEmailLink.href = `mailto:${c.email}?subject=Support%2FQuery`;
    if (responseTimeEl && c.responseTime) responseTimeEl.textContent = c.responseTime;
    if (locationEl && c.locationDisplay) locationEl.textContent = c.locationDisplay;

    if (subjectSelect && c.subjectCategories && c.subjectCategories.length > 0) {
      subjectSelect.innerHTML = c.subjectCategories.map(cat => `
        <option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>
      `).join('');
    }
  }

  initLiveClock() {
    const clockEl = document.getElementById('footer-clock');
    if (!clockEl) return;

    const updateTime = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    updateTime();
    setInterval(updateTime, 1000);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});
