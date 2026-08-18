/**
 * GitHub Repositories API Integration
 * Dedicated to @Detergent-codes with customizable GitHub Avatar PFP
 */

const GITHUB_LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00'
};

// Fallback curated projects in case of API rate limit
const FALLBACK_REPOS = [
  {
    name: "hardware-hub-controller",
    html_url: "https://github.com/Detergent-codes",
    description: "Custom microcontroller firmware and circuit interface for managing display modules, sensor arrays, and physical button controls.",
    language: "Python",
    stargazers_count: 14,
    forks_count: 3,
    topics: ["microcontroller", "python", "hardware", "iot"],
    updated_at: "2026-08-16T12:00:00Z"
  },
  {
    name: "fluid-web-suite",
    html_url: "https://github.com/Detergent-codes",
    description: "Modern, high-performance web components built with pure HTML5, CSS3, and JavaScript with fluid micro-interactions and zero bloat.",
    language: "HTML",
    stargazers_count: 22,
    forks_count: 5,
    topics: ["web-design", "html5", "css3", "javascript"],
    updated_at: "2026-08-18T10:30:00Z"
  },
  {
    name: "system-automation-scripts",
    html_url: "https://github.com/Detergent-codes",
    description: "A collection of clean, structured automation scripts for workflow optimization, device maintenance, and data processing.",
    language: "Python",
    stargazers_count: 18,
    forks_count: 2,
    topics: ["automation", "scripts", "productivity", "python"],
    updated_at: "2026-08-14T15:20:00Z"
  },
  {
    name: "gimp-design-presets",
    html_url: "https://github.com/Detergent-codes",
    description: "Precision color grading LUTs, typography guidelines, and UI component design templates built in GIMP.",
    language: "CSS",
    stargazers_count: 9,
    forks_count: 1,
    topics: ["gimp", "visual-design", "color-grading", "presets"],
    updated_at: "2026-08-10T18:45:00Z"
  }
];

class GitHubExplorer {
  constructor() {
    const cfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.github) || {};
    this.username = cfg.username || 'Detergent-codes';
    this.avatarUrl = cfg.avatarUrl || 'assets/images/logo.png';
    this.repos = [];
    this.filteredRepos = [];
    this.selectedLanguage = 'all';
    this.searchQuery = '';
    this.sortBy = cfg.defaultSort || 'updated';

    this.container = document.getElementById('repos-grid');
    this.searchInput = document.getElementById('repo-search-input');
    this.langFilter = document.getElementById('repo-lang-filter');
    this.sortSelect = document.getElementById('repo-sort-select');
    this.repoCountBadge = document.getElementById('repos-count-badge');
    this.totalStarsBadge = document.getElementById('total-stars-badge');
    this.pfpImg = document.getElementById('github-pfp-img');

    this.init();
  }

  init() {
    if (this.pfpImg && this.avatarUrl) {
      this.pfpImg.src = this.avatarUrl;
    }

    this.bindEvents();
    this.fetchUserRepos(this.username);
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    if (this.langFilter) {
      this.langFilter.addEventListener('change', (e) => {
        this.selectedLanguage = e.target.value;
        this.applyFilters();
      });
    }

    if (this.sortSelect) {
      this.sortSelect.value = this.sortBy;
      this.sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.applyFilters();
      });
    }
  }

  renderSkeleton() {
    if (!this.container) return;
    this.container.innerHTML = Array(4).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line" style="width: 90%;"></div>
        <div class="skeleton-line" style="width: 75%;"></div>
        <div class="skeleton-line" style="width: 40%; margin-top: 1.5rem;"></div>
      </div>
    `).join('');
  }

  async fetchUserRepos(username) {
    this.renderSkeleton();
    try {
      const endpoint = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('GitHub API rate limit reached. Showing curated repositories.');
        } else if (response.status === 404) {
          throw new Error(`GitHub user "${username}" was not found.`);
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
      }

      const data = await response.json();
      this.repos = data
        .filter(r => !r.fork)
        .concat(data.filter(r => r.fork))
        .map(r => ({
          name: r.name,
          html_url: r.html_url,
          description: r.description || "Project repository by Aalok Arya (@Detergent-codes).",
          language: r.language || "Markdown",
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          topics: r.topics || [],
          updated_at: r.updated_at
        }));

      if (this.repos.length === 0) {
        this.repos = FALLBACK_REPOS;
      }

      this.populateLanguageFilter();
      this.applyFilters();
    } catch (err) {
      console.warn('GitHub fetch notice:', err.message);
      this.repos = FALLBACK_REPOS;
      this.populateLanguageFilter();
      this.applyFilters();
    }
  }

  populateLanguageFilter() {
    if (!this.langFilter) return;
    const langs = new Set();
    this.repos.forEach(r => {
      if (r.language) langs.add(r.language);
    });

    const currentVal = this.langFilter.value;
    this.langFilter.innerHTML = '<option value="all">All Languages</option>';
    Array.from(langs).sort().forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang;
      opt.textContent = lang;
      this.langFilter.appendChild(opt);
    });

    if (langs.has(currentVal)) {
      this.langFilter.value = currentVal;
    }
  }

  applyFilters() {
    let result = [...this.repos];

    // Language filter
    if (this.selectedLanguage !== 'all') {
      result = result.filter(r => r.language === this.selectedLanguage);
    }

    // Search query filter
    if (this.searchQuery) {
      result = result.filter(r => {
        const nameMatch = r.name.toLowerCase().includes(this.searchQuery);
        const descMatch = (r.description || '').toLowerCase().includes(this.searchQuery);
        const langMatch = (r.language || '').toLowerCase().includes(this.searchQuery);
        const topicMatch = (r.topics || []).some(t => t.toLowerCase().includes(this.searchQuery));
        return nameMatch || descMatch || langMatch || topicMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (this.sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (this.sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
      if (this.sortBy === 'forks') return b.forks_count - a.forks_count;
      if (this.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    this.filteredRepos = result;
    this.render();
    this.updateStats();
  }

  updateStats() {
    if (this.repoCountBadge) {
      this.repoCountBadge.textContent = `${this.filteredRepos.length} Repositories`;
    }
    if (this.totalStarsBadge) {
      const totalStars = this.repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      this.totalStarsBadge.textContent = `★ ${totalStars} Total Stars`;
    }
  }

  render() {
    if (!this.container) return;

    if (this.filteredRepos.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <p style="font-size: 1.2rem; font-family: var(--font-display); margin-bottom: 0.5rem;">No repositories matched your filters</p>
          <p style="font-size: 0.875rem; color: var(--text-muted);">Try adjusting your search query or selecting "All Languages".</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = this.filteredRepos.map(repo => {
      const langColor = GITHUB_LANG_COLORS[repo.language] || '#10b981';
      const topicsHtml = (repo.topics || []).slice(0, 3).map(t => `
        <span class="repo-topic">#${escapeHtml(t)}</span>
      `).join('');

      return `
        <div class="spotlight-card repo-card">
          <div>
            <div class="repo-card-top">
              <div class="repo-header">
                <svg class="repo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"></path>
                </svg>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                  ${escapeHtml(repo.name)}
                </a>
              </div>
              <span class="repo-visibility">Public</span>
            </div>
            
            <p class="repo-description">${escapeHtml(repo.description)}</p>

            ${topicsHtml ? `<div class="repo-topics">${topicsHtml}</div>` : ''}
          </div>

          <div class="repo-card-bottom">
            <div class="repo-lang">
              <span class="lang-dot" style="background-color: ${langColor};"></span>
              <span>${escapeHtml(repo.language)}</span>
            </div>

            <div class="repo-stats">
              <div class="repo-stat-item" title="${repo.stargazers_count} Stars">
                <svg class="repo-stat-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>${repo.stargazers_count}</span>
              </div>

              <div class="repo-stat-item" title="${repo.forks_count} Forks">
                <svg class="repo-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="18" cy="6" r="3"></circle>
                  <path d="M6 9v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"></path>
                  <path d="M12 12v3"></path>
                </svg>
                <span>${repo.forks_count}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
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
  window.githubExplorer = new GitHubExplorer();
});
