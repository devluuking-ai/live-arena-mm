# Live Arena MM (Myanmar Live Studio v3)

Open-source TikTok LIVE interactive games studio for Myanmar creators, in the style of hosted live-game studios (hub of studio cards, 4-step Scene/Audio/Rules/Go Live settings, fullscreen broadcast): viewers play with comment, like and gift while the host streams. Free — no activation key, no trial limit.

Self-hosted — no Google login, no license key, no watermark, no daily time limit. Run it on a PC, a VPS, or a phone (Termux).

## Features

- Dashboard: create a room from a TikTok username, get one overlay link (`/o/<room>`)
- Overlay works in TikTok LIVE Studio (Add source → Link), OBS/Streamlabs (Browser source), and phone Mobile gaming (9:16; add `?ratio=16:9` for PC)
- Switch games mid-live from the dashboard without changing the link
- 17 games/scenes: tug of war, temple, pagoda (day/night), run/car/horse/boat/marble races, quiz, number guess, climb, penalty, boss battle, peacock, Thingyan, region contest, survival
- Viewer = character (name + avatar), gift effects, goal bar with celebration, top-5 donors, like milestones every 1,000, follow/share thanks
- Myanmar voice announcements via the device voice (needs a Myanmar TTS voice on the device)
- Synthesized BGM + sound pad (gong, clap, fanfare, splash, bell)
- TikTok LIVE events (chat, gift, like, member, follow, share) via the bundled `ttl-live` connector — self-signing, no sign server, no API key, no TikTok password; reads the public live only
- Sim panel + demo bots for testing without going live; demo overlay at `/o/demo`
- TikTok safe mode toggle (on by default)

## Run

Requires Node 22+ (`node -v`).

```bash
npm install
npm start
```

Open `http://localhost:3000/dashboard`, create a room, put the overlay link into LIVE Studio/OBS or open it on the phone, start the TikTok LIVE, then press “TikTok ချိတ်မယ်” in the dashboard.

Phone (Termux): `pkg install nodejs`, then `npm install && npm start` in this folder, open the dashboard in the browser, then TikTok → LIVE → Mobile gaming → Go LIVE with the overlay tab in front.

## Test

```bash
npm test
```

## Notes

- Graphics are 2D. Real TikTok connection needs an actually-live room; the sim path exercises the same event engine.
- Keep the dashboard on your own machine/LAN — do not expose it to the public internet.
- Not affiliated with TikTok. Stay present on camera/voice and keep safe mode on.

## License

MIT. The bundled `ttl-live/` connector is MIT-licensed (see `ttl-live/README.md`).
