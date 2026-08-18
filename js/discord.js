/**
 * Discord Server & Community Integration
 * Dedicated to Aalok Arya's Discord Guild: 1532352162766524447
 */

class DiscordWidget {
  constructor() {
    const cfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.discord) || {};
    this.serverId = cfg.serverId || '1532352162766524447';
    this.inviteUrl = cfg.inviteUrl || 'https://discord.gg/2b3FFn3t6R';
    this.serverName = cfg.serverName || 'Detergent Community';
    this.fallbackOnline = cfg.fallbackOnlineCount || 28;
    this.iconUrl = cfg.iconUrl || 'assets/images/logo.png';

    this.serverNameEl = document.getElementById('discord-server-name');
    this.onlineCountEl = document.getElementById('discord-online-count');
    this.voiceChannelsEl = document.getElementById('discord-channels-count');
    this.joinBtn = document.getElementById('discord-join-btn');
    this.copyInviteBtn = document.getElementById('discord-copy-invite-btn');
    this.serverIconEl = document.getElementById('discord-server-icon');

    this.init();
  }

  init() {
    this.bindEvents();
    this.fetchWidgetData(this.serverId);
  }

  bindEvents() {
    if (this.joinBtn) {
      this.joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(this.inviteUrl, '_blank');
      });
    }

    if (this.copyInviteBtn) {
      this.copyInviteBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(this.inviteUrl).then(() => {
          window.toast && window.toast('Discord invite link copied to clipboard!', 'success');
        }).catch(() => {
          window.toast && window.toast(`Invite: ${this.inviteUrl}`, 'info');
        });
      });
    }
  }

  async fetchWidgetData(guildId) {
    try {
      const endpoint = `https://discord.com/api/guilds/${encodeURIComponent(guildId)}/widget.json`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Discord API status: ${response.status}`);
      }

      const data = await response.json();

      this.serverName = data.name || this.serverName;
      if (data.instant_invite) {
        this.inviteUrl = data.instant_invite;
      }

      const onlineMembers = data.presence_count || (data.members ? data.members.length : this.fallbackOnline);
      const voiceChannelsCount = data.channels ? data.channels.length : 3;

      this.updateUI({
        name: this.serverName,
        online: onlineMembers,
        channels: voiceChannelsCount,
        isLive: true
      });
    } catch (err) {
      // Clean fallback display
      this.updateUI({
        name: this.serverName,
        online: this.fallbackOnline,
        channels: 3,
        isLive: true
      });
    }
  }

  updateUI(state) {
    if (this.serverNameEl) {
      this.serverNameEl.textContent = state.name;
    }
    if (this.onlineCountEl) {
      this.onlineCountEl.textContent = Number(state.online).toLocaleString();
    }
    if (this.voiceChannelsEl) {
      this.voiceChannelsEl.textContent = state.channels;
    }
    if (this.serverIconEl) {
      if (this.iconUrl) {
        this.serverIconEl.innerHTML = `<img src="${this.iconUrl}" alt="${state.name} Icon" style="width: 100%; height: 100%; object-fit: contain; border-radius: inherit;">`;
      } else {
        this.serverIconEl.textContent = 'DC';
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.discordWidget = new DiscordWidget();
});
