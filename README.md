# Minimalist Obsidian Developer Portfolio

A state-of-the-art, high-performance portfolio website built with modern HTML5, CSS3, and JavaScript. Zero build step, zero dependencies, and instant load times.

## ✨ Features

- **Live GitHub REST API Integration**:
  - Dynamically fetches repositories from GitHub.
  - Live search by keyword, repository name, language, or topic.
  - Filter by language and sort by Stars, Recently Updated, or Name.
  - Live in-browser GitHub username switcher to test any profile instantly.
- **Discord Community & Widget API**:
  - Real-time online member count and active voice channels via Discord's Widget JSON API.
  - Instant server invite trigger & copy-to-clipboard button.
  - Built-in widget tester for your own Discord Server ID.
- **Contact Me Form & Query Dispatcher**:
  - Floating label inputs with live client-side validation (email regex, minimum length, error states).
  - Character counter and non-intrusive toast notifications.
  - Automatic `mailto:` query formatting with zero backend required, or optional Formspree/EmailJS endpoint support.
- **Crafted Obsidian Dark Aesthetic**:
  - Deep black obsidian color scheme with customizable electric accents (Cyber Cyan, Emerald Pulse, Hyper Violet, Electric Amber).
  - Smooth interactive spotlight hover glow that tracks cursor coordinates (`radial-gradient`).
  - Fluid background particle constellation canvas at 60 FPS.
  - Smooth trailing cursor rings.

---

## 🚀 Quick Start (Local Usage)

1. **Open Directly in Browser**:
   - Double-click `index.html` to open it in any web browser.
   
2. **Or Run a Local Server** (Optional):
   - With Python: `python -m http.server 8000`
   - Or with VS Code: Use the *Live Server* extension.

---

## ⚙️ Customization Guide

All personal configuration is centralized in [`config.js`](file:///C:/Users/Saharan/.gemini/antigravity/scratch/portfolio/config.js).

### 1. Update Your Details
Open `config.js` and modify your name, title, bio, and email:
```javascript
const PORTFOLIO_CONFIG = {
  name: "Your Name",
  title: "Full-Stack Developer & Software Craftsman",
  bio: "Your personal elevator pitch...",
  contact: {
    email: "your.email@example.com",
    formspreeEndpoint: "" // Optional Formspree endpoint URL
  }
};
```

### 2. Connect Your GitHub Repositories
Change `username` to your GitHub username:
```javascript
github: {
  username: "your-github-username",
  defaultSort: "stars"
}
```

### 3. Connect Your Discord Server
1. In Discord: Go to **Server Settings** &rarr; **Widget**.
2. Enable **Enable Server Widget**.
3. Copy the **Server ID** and paste it into `config.js`:
```javascript
discord: {
  serverId: "YOUR_SERVER_ID",
  inviteUrl: "https://discord.gg/your-invite",
  serverName: "Your Community Name"
}
```

### 4. Customize Skills
Edit the `skills` array in `config.js` to add, remove, or reorganize your tech stack.

---

## 🌐 Free Deployment

### GitHub Pages
1. Create a repository on GitHub (e.g. `yourname.github.io`).
2. Push all the portfolio files directly into the repository root.
3. In GitHub repo settings &rarr; **Pages**, select the `main` branch.
4. Your website will be live at `https://yourname.github.io`!

### Vercel / Netlify
- Drag and drop the `portfolio` folder directly into [Netlify Drop](https://app.netlify.com/drop) or import from GitHub on [Vercel](https://vercel.com).
