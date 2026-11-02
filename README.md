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

### Power-ups

Glowing bubbles drift across the sky every ~20 seconds. Shoot one to collect it:

| Bubble | Effect |
| --- | --- |
| ⚡ | Triple laser for 8 s |
| ☕ | Slow-mo enemies for 6 s |
| ❤️ | +1 life (only appears when you've lost one) |

## Features

- Single `index.html`, plain JavaScript and canvas. No build step, no dependencies.
- Built-in synthesized background music (oom-pah tuba, kazoo, slide whistle) that speeds up as the game gets harder.
- Hit freeze and squash on every kill, screen shake, and particles.
- **Share score** button on the game-over screen (native share sheet on phones, WhatsApp link elsewhere).
- Installable on phones as an app (add to home screen), and works offline once loaded.
- Best score is saved in the browser.

## Run locally

Any static file server works:

```bash
python3 -m http.server 5178
```

Then open http://localhost:5178.

## Deploy

It's a static site, so deploy the folder as-is to Vercel, Netlify or GitHub Pages:

```bash
npx vercel --prod
```

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
