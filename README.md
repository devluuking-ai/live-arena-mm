# Live Arena MM (Myanmar Live Studio v3.1 — Web Version)

## မြန်မာလို အမြန်သုံးနည်း

GitHub က code သိမ်းတဲ့နေရာပဲမို့ GitHub link ကနေ တိုက်ရိုက် LIVE သုံးလို့မရပါ။ Web link ရဖို့ Render မှာ တစ်ခါပဲ deploy လုပ်ရပါမယ်:

1. ဒီ link ကိုနှိပ်ပါ: https://render.com/deploy?repo=https://github.com/devluuking-ai/live-arena-mm
2. GitHub account နဲ့ Render ကိုဝင်ပြီး **Apply / Deploy** နှိပ်ပါ။
3. Deploy ပြီးရင် `https://live-arena-mm.onrender.com` လို ကိုယ်ပိုင် web link ရပါမယ်။
4. Render dashboard → **Environment** မှာ `CONTROL_TOKEN` ကိုကူးပြီး studio ရဲ့ **Go Live** tab မှာ တစ်ခါထည့်ပါ။
5. TikTok မှာ Mobile gaming LIVE အရင်စပြီး Go Live tab မှာ username ထည့်ကာ **TikTok LIVE ချိတ်မယ်** နှိပ်ပါ။

အသေးစိတ် မြန်မာလမ်းညွှန်: [README-MY.md](README-MY.md)

Open-source TikTok LIVE interactive games studio for Myanmar creators, in the style of hosted live-game studios (hub of studio cards, 4-step Scene/Audio/Rules/Go Live settings, fullscreen broadcast): viewers play with comment, like and gift while the host streams. Free — no activation key, no trial limit.

Web version — deploy once and use it from any browser link, no Termux or APK needed. Also runs on a PC, a VPS, or a phone (Termux).

## Deploy the web version (Render, free)

1. Open https://render.com/deploy?repo=https://github.com/devluuking-ai/live-arena-mm
2. Sign in to Render with GitHub and click **Apply / Deploy**.
3. You get a public URL like `https://live-arena-mm.onrender.com`.
4. Copy the generated `CONTROL_TOKEN` from Render → Environment and paste it once into the studio's Go Live tab (the browser remembers it). Only the token holder can drive the show.

Render's free plan sleeps when idle — open the link once a minute before going live.

## Features

- Dashboard: create a room from a TikTok username, get one overlay link (`/o/<room>`)
- Overlay works in TikTok LIVE Studio (Add source → Link), OBS/Streamlabs (Browser source), and phone Mobile gaming (9:16; add `?ratio=16:9` for PC)
- Switch games mid-live from the dashboard without changing the link
- 25 games/scenes: country flag battle, garden defence, lethwei, slap battle, car race, sound truck, tug of war, party truck, monster raid, Inle boat race, temple, pagoda, run/horse/boat/marble races, quiz, number guess, climb, penalty, boss battle, peacock, Thingyan, region contest, survival
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
- On a public web deploy, set `CONTROL_TOKEN` (the Render blueprint generates one) so only you can control the show; overlay/state reads stay open for OBS and viewers. Locally, leaving it unset keeps control open.
- Not affiliated with TikTok. Stay present on camera/voice and keep safe mode on.

## License

MIT. The bundled `ttl-live/` connector is MIT-licensed (see `ttl-live/README.md`).
