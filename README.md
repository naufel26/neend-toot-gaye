# Neend Toot Gayi — Snooze Blaster 😴🔫

An endless doodle stick-shooter for the browser. You're asleep in bed, and stickmen with
your friends' faces keep flying in to wake you up. Hold to aim, release to fire the laser.
Don't let them reach your head.

## How to play

| Action | Touch / mouse | Keyboard |
| --- | --- | --- |
| Aim (the line sweeps back and forth) | Hold the screen | Hold `Space` |
| Fire | Release | Release `Space` |
| Pause | ⏸ button | `P` / `Esc` |

- You have **5 lives** (hearts, top left).
- A single laser goes through everything, so line up several enemies for a **DOUBLE / TRIPLE** combo (points × number of kills).
- Enemies get faster and come more often the longer you survive. Fast zig-zagging stickmen show up at ~15 s, and big 3-hit ones at ~40 s.
- Make the **global top 10** and you'll be asked for your name. Each name keeps its best score.

### Power-ups

Glowing bubbles drift across the sky every ~20 seconds. Shoot one to collect it:

| Bubble | Effect |
| --- | --- |
| ⚡ | Triple laser for 8 s |
| ☕ | Slow-mo enemies for 6 s |
| ❤️ | +1 life (only appears when you've lost one) |

## Features

- Single `index.html`, plain JavaScript and canvas. No build step.
- Global top-10 leaderboard (🏆 button), served by a Vercel function backed by Upstash Redis.
- Built-in synthesized background music (oom-pah tuba, kazoo, slide whistle) that speeds up as the game gets harder.
- Hit freeze and squash on every kill, screen shake, and particles.
- **Share score** button on the game-over screen (native share sheet on phones, WhatsApp link elsewhere).
- Installable on phones as an app (add to home screen), and works offline once loaded.
- Best score is saved in the browser.

## Project structure

```
├── index.html            # The whole game: canvas, UI, audio, leaderboard dialog
├── api/
│   └── leaderboard.js    # Vercel function: GET top 10, POST a score (Upstash Redis)
├── dev-server.mjs        # Local server: static files + runs /api like Vercel does
├── assets/               # Player head, enemy faces, app icons
├── sounds/               # Custom sound clips + sounds.json
├── manifest.webmanifest  # Install-as-app settings
└── sw.js                 # Offline support
```

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5178. Locally the leaderboard keeps scores **in memory**, so they reset when the server restarts and no database is needed. To use the real database locally, run `vercel env pull .env.local` and restart.

## Deploy to Vercel

1. Import this repository in Vercel (**Add New → Project**). There's no build step and no settings to change.
2. Add the leaderboard database: in the project, go to **Storage → Create Database → Upstash Redis** and connect it to the project. This adds the connection environment variables.
3. Redeploy. Without the database the game still works, but the leaderboard shows "Couldn't load the leaderboard."

## Leaderboard API

`GET /api/leaderboard` returns the top 10:

```json
{ "entries": [{ "name": "Naufel", "score": 42 }] }
```

`POST /api/leaderboard` with `{ "name": "Naufel", "score": 42 }` submits a score and returns the updated top 10.

- Names are trimmed, stripped of control characters, and capped at 16 characters.
- Scores must be whole numbers from 1 to 99999.
- Each name keeps only its highest score (Redis `ZADD GT`). The stored set is capped at 1000 entries.

> **Note:** the browser reports the score, so a determined player could submit a fake one with dev tools. That's normal for casual web games. To remove an entry, run `ZREM neend-toot-gayi:leaderboard "<name>"` in the Upstash console. The scores live under their own key, so this game can share an Upstash database with other games.

## Customising

### Faces

- **Player head:** `assets/head.png`
- **Enemy faces:** `assets/enemy1.png`, `enemy2.png`, `enemy3.png`. To add more, drop in cut-out PNGs (transparent background) and list them in `ENEMY_FACES` near the top of the script in `index.html`.

### Sounds

Put audio files in `sounds/` and list them in `sounds/sounds.json` under the moment they should play:

| Key | Plays when |
| --- | --- |
| `start` | A game starts |
| `enemy` | An enemy appears |
| `fire` | You shoot |
| `hit` | A shot hits something |
| `miss` | A shot hits nothing |
| `combo` | You get a multi-kill |
| `power` | You collect a power-up |
| `hurt` | You lose a life |
| `over` | Game over |
| `music` | Background music (loops; replaces the built-in tune) |

If you list several files for one key, they play in turn. An empty list uses the built-in synth sound.

### Tuning

These constants in `index.html` control the game:

- `MAX_LIVES`: starting lives
- `COOLDOWN`: time between shots
- `AIM_SPEED`: how fast the aim line sweeps
- `TYPES`: enemy size, speed, health and points
- `POWERS`: power-up durations
