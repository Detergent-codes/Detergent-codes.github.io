/**
 * ==============================================================================
 * MASTER PORTFOLIO CONFIGURATION FILE
 * ==============================================================================
 * This single configuration file controls EVERYTHING on the website:
 * - Personal Profile & Bios
 * - Terminal Widget Commands & Outputs
 * - Complete Theme Colors, Accents, Backgrounds, Transparencies & Blurs
 * - Parallax Speeds, Overlays, Image Paths
 * - Dot Matrix Grid Physics (Gas Spring, Floating Hover, Repulsion, Spacing)
 * - GitHub REST API & Profile PFP Settings
 * - Discord Server Widget API & Server Icon PFP Settings
 * - Contact Form & Direct Query Routing
 * - Skills, Pillars, Social Links & Badges
 * ==============================================================================
 */

const PORTFOLIO_CONFIG = {
  // ----------------------------------------------------------------------------
  // 1. Profile & Identity
  // ----------------------------------------------------------------------------
  profile: {
    name: "Aalok Arya",
    handle: "Detergent",
    title: "Student Builder, Software Developer & Hardware Tinkerer",
    heroSubtitle: "And I'm a tinkerer.",
    bio: "I'm a 13-year-old student builder based in Rajasthan, India. I spend my time coding software, tinkering with hardware, and crafting visual designs. I focus on building things that work well, look refined, and feel good to use.",
    motto: "Crafting with Precision",
    location: "Rajasthan, India",
    statusText: "Open for collabs and tinkering ideas!",
    logoText: "Aalok Arya",
    avatarUrl: "assets/images/logo.png",
    faviconUrl: "assets/images/logo.png",
    heroBackgroundUrl: "assets/images/hero-bg.jpg"
  },

  // ----------------------------------------------------------------------------
  // 2. Interactive Terminal Widget (Hero Section)
  // ----------------------------------------------------------------------------
  terminal: {
    title: "bash ~ aalok@tinkerer",
    badgeText: "LIVE",
    lines: [
      {
        prompt: "$",
        command: "whoami",
        response: "> Aalok Arya (Detergent)"
      },
      {
        prompt: "$",
        command: "cat core-focus.json",
        response: '> ["Programming", "Hardware Tinkering", "Visual Design"]'
      },
      {
        prompt: "$",
        command: "location",
        response: "> Rajasthan, India 🇮🇳"
      },
      {
        prompt: "$",
        command: "echo $MOTTO",
        response: '> "Playing with hardware and software."'
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // 3. Complete Design System & Theme Variables
  // ----------------------------------------------------------------------------
  theme: {
    // Accent Colors (Emerald / Mint Green)
    accentPrimary: "#10b981",
    accentHover: "#34d399",
    accentDim: "rgba(16, 185, 129, 0.12)",
    accentGlow: "rgba(16, 185, 129, 0.28)",
    accentBorder: "rgba(16, 185, 129, 0.35)",

    // Backgrounds & Surface Colors
    bgMain: "#090a0f",
    bgSubtle: "#0d0f17",
    bgCard: "rgba(18, 21, 31, 0.72)",
    bgCardHover: "rgba(24, 28, 42, 0.88)",
    bgInput: "rgba(13, 16, 26, 0.85)",
    bgGlass: "rgba(14, 17, 27, 0.75)",
    bgHeader: "rgba(9, 10, 15, 0.65)",
    bgHeaderScrolled: "rgba(9, 10, 15, 0.92)",

    // Text & Typography
    textPrimary: "#f3f4f6",
    textSecondary: "#9ca3af",
    textMuted: "#6b7280",
    textInverse: "#090a0f",

    // Borders & Geometry
    borderSubtle: "rgba(255, 255, 255, 0.08)",
    borderCard: "rgba(255, 255, 255, 0.12)",
    borderActive: "rgba(255, 255, 255, 0.25)",
    borderRadiusSm: "8px",
    borderRadiusMd: "14px",
    borderRadiusLg: "20px",

    // Blur / Glassmorphism
    cardBackdropBlur: "14px",
    headerBackdropBlur: "20px"
  },

  // ----------------------------------------------------------------------------
  // 4. Hero Parallax Controls
  // ----------------------------------------------------------------------------
  heroParallax: {
    enabled: true,
    scrollSpeed: 0.50, // Parallax translation speed on scroll
    mouseTiltFactor: 0.05, // Mouse position tilt responsiveness
    overlayTopOpacity: 0.45,
    overlayMidOpacity: 0.65,
    overlayBottomOpacity: 0.98
  },

  // ----------------------------------------------------------------------------
  // 5. Background Dot Matrix & Gas-Spring Physics
  // ----------------------------------------------------------------------------
  effects: {
    dotSpacing: 35, // Pixel distance between grid dots (desktop: 34, mobile: 40)
    baseDotSize: 1.5, // Normal resting dot radius (px)
    hoverDotSize: 2.5, // Max size when hovered (px)

    // Colors
    baseDotColor: { r: 156, g: 163, b: 175, a: 0.30 }, // Neutral Gray
    hoverDotColor: { r: 16, g: 185, b: 129, a: 0.95 }, // Emerald Green

    // Cursor Field & Slow Hover Floating
    proximityRadius: 120, // Interaction radius around cursor (px)
    repulsionForce: 4.0, // Gentle push force
    hoverFloatSpeed: 1.0, // Slow organic drift speed (smaller = slower)
    hoverFloatAmp: 1.5, // Float amplitude

    // Gas-Spring Physics (Smooth, Viscous, Damped, Linear-ish, No Rubber-Band)
    gasSpringStrength: 0.045, // Soft return force
    gasSpringDamping: 0.82, // Viscous fluid damping (0.80 - 0.85 = smooth gas spring)
    scrollInfluence: 0.10 // Smooth scroll resistance nudge
  },

  // ----------------------------------------------------------------------------
  // 6. GitHub API Integration
  // ----------------------------------------------------------------------------
  github: {
    username: "Detergent-codes",
    avatarUrl: "assets/images/logo.png", // GitHub PFP / Avatar image (put file in assets/images/ or use URL)
    defaultSort: "updated", // "updated", "stars", "forks", "name"
    perPage: 30
  },

  // ----------------------------------------------------------------------------
  // 7. Discord Community Widget API
  // ----------------------------------------------------------------------------
  discord: {
    serverId: "1532352162766524447",
    iconUrl: "assets/images/logo.png", // Discord Server PFP / Icon image (put file in assets/images/ or use URL)
    inviteUrl: "https://discord.gg/2b3FFn3t6R",
    serverName: "Detergent Community",
    fallbackOnlineCount: 28,
    fallbackChannelsCount: 3
  },

  // ----------------------------------------------------------------------------
  // 8. Contact Form & Direct Query Dispatch
  // ----------------------------------------------------------------------------
  contact: {
    email: "detergentcodes@gmail.com",
    formspreeEndpoint: "", // Optional Formspree/EmailJS endpoint
    phone: "",
    responseTime: "~48 Hours",
    locationDisplay: "Rajasthan, India 🇮🇳",
    subjectCategories: [
      "Support / Query",
      "Project Collaboration",
      "Hardware / Software Tinkering",
      "Visual Design Request",
      "General Hello"
    ]
  },

  // ----------------------------------------------------------------------------
  // 9. Core Skills & Pillars
  // ----------------------------------------------------------------------------
  skills: [
    {
      category: "💻 Software Engineering & Logic",
      items: [
        { name: "Python", level: "Proficient", icon: "🐍" },
        { name: "HTML5 & Modern CSS", level: "Advanced", icon: "🎨" },
        { name: "JavaScript / ES6+", level: "Proficient", icon: "⚡" },
        { name: "Automation & Scripting", level: "Advanced", icon: "⚙️" },
        { name: "Clean Architecture & Logic", level: "Advanced", icon: "🧩" }
      ]
    },
    {
      category: "🛠️ Hardware Tinkering & Electronics",
      items: [
        { name: "Microcontrollers & Circuits", level: "Intermediate", icon: "🔌" },
        { name: "Display Modules & Wiring", level: "Practical", icon: "💡" },
        { name: "Device Mods & Repurposing", level: "Skilled", icon: "🔧" },
        { name: "Custom Hardware Prototyping", level: "Passionate", icon: "🔋" }
      ]
    },
    {
      category: "🎨 Visual Design & Layouts",
      items: [
        { name: "GIMP Graphic Design", level: "Advanced", icon: "🖌️" },
        { name: "Color Grading & Effects", level: "Proficient", icon: "✨" },
        { name: "UI/UX Layouts & Hierarchy", level: "Refined", icon: "📐" },
        { name: "Typography & Alignment", level: "Precise", icon: "🖋️" }
      ]
    }
  ],

  // ----------------------------------------------------------------------------
  // 10. Social Links & Footer
  // ----------------------------------------------------------------------------
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/Detergent-codes",
      icon: "github"
    },
    {
      name: "Discord",
      url: "https://discord.gg/2b3FFn3t6R",
      icon: "discord"
    },
    {
      name: "Email",
      url: "mailto:detergentcodes@gmail.com?subject=Support%2FQuery",
      icon: "mail"
    }
  ]
};
