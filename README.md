<div align="center">

# ElderKeep

**A Warcraft III RoC-style chat client for friends, voice, and games.**

ElderKeep is a desktop group-chat app with built-in voice rooms, screen sharing, and a unified
game browser — wrapped in the classic Warcraft III Reign of Chaos / Battle.net look and feel.
Friends-first, self-hosting-friendly, and always up to date.

[**⬇ Download the latest release**](https://github.com/CandyManKillerZ/elderkeep-client/releases/latest)

</div>

---

## Download & Install

Grab the latest build from the [**Releases**](https://github.com/CandyManKillerZ/elderkeep-client/releases/latest) page.

| Platform | File |
|----------|------|
| **Windows 10/11** | `ElderKeep-Setup-<version>.exe` (one-click installer) — or the portable `.zip` |
| **Linux (x64)** | `ElderKeep-<version>-x64.AppImage` or the `.deb` package |

ElderKeep keeps itself current with a built-in **auto-updater**, so you only need to install once.

> **Windows SmartScreen / "nothing happens" on launch?** The installer isn't code-signed yet, so
> Windows may flag it with *Mark of the Web*. Right-click the downloaded `.exe` → **Properties** →
> tick **Unblock** → **OK**, then run it again.

## Getting Started

1. Install and launch ElderKeep.
2. New users **connect to the public server automatically** — no server address required.
3. Create an account and **save your one-time recovery codes** (you'll need them if you ever forget your password).
4. Join a channel, add some friends, and you're in.

## Features

### 💬 Chat
- Public channels and clan channels
- **End-to-end encrypted** private whispers (ECDH + AES-256-GCM)
- Emoji picker, Tenor GIFs, inline images, and rich link previews with a lightbox
- `/me` emotes and IRC-style moderation commands (kick, ban, op, whois, who, …)
- Daily chat logs kept locally

### 🎙️ Voice
- Low-latency peer-to-peer voice rooms
- **Push-to-talk** or voice-activation, with mute & deafen
- **RNNoise** background-noise suppression
- Automatic **game-audio ducking** while you talk
- Microphone test and full mic/speaker device selection
- Host-controlled calls — invite, add, remove, force-mute, and end for everyone

### 🖥️ Screen Sharing
- Share a full screen or a single window, with **system audio**
- Adjustable resolution, FPS, and bitrate, with an auto-FPS guard
- Native viewer window with per-viewer volume, fullscreen, and auto-reconnect
- Smart bandwidth budgeting across multiple viewers

### 👥 Friends & Clans
- Friends list with favorites and live online/offline status
- See what game friends are playing on **Steam**
- Clans with ranks, message-of-the-day, invites, and chat history

### 🎮 Play Games
A unified game browser built right into chat:
- **PC game servers** — browse, filter, and join via BattleMetrics + the Steam Web API
- **Roblox** — game and server browser, friends lookup, and one-click join
- **Warcraft III** — LAN lobby browser, plus games hosted straight from chat via the w3bot

### 🔒 Accounts & Security
- One-time backup **recovery codes** and self-service password reset
- Optional **saved password**, encrypted with your OS credential vault (Windows DPAPI) — never stored in plain text
- **Auto-connect** on launch, once the update check confirms you're on the latest build

### 🎨 Polish
- Themes, accent colors, and custom backgrounds (with an animated battlefield canvas)
- Profiles with icons, plus XP and level badges
- Floating chat-bubble overlay and system-tray support
- Live in-app patch notes

## Platforms

Windows 10/11 and Linux (x64). A mobile/web build is also available via Capacitor.

## Self-Hosting

ElderKeep ships pointed at the public server, but you can run your own. Enter any server in the
**Server Address** field — prefix it with `wss://` (or `https://`) to use TLS, or use a bare
`host:port` for a plain connection. The server is distributed separately.

## License

ElderKeep is **proprietary software** — © 2026 Mark van der Sluis. All rights reserved.
See [LICENSE](https://github.com/CandyManKillerZ/elderkeep-client/blob/main/LICENSE) for details.
Third-party open-source components remain under their own respective licenses.

For licensing inquiries, contact **noreply@elderkeep.app**.
