# Live Arena MM — Web Version သုံးနည်း

live.premiumrecap.uk ပုံစံ TikTok LIVE interactive game studio ကို ကိုယ်ပိုင် web link နဲ့ သုံးဖို့ပါ။ Termux / APK မလိုပါ — browser ကနေ link ဖွင့်ရုံပါပဲ။ Key / trial limit မရှိပါ၊ အခမဲ့ပါ။

## Web ပေါ် တင်နည်း (တစ်ခါပဲ)

Render (အခမဲ့) နဲ့ တင်တာက အလွယ်ဆုံးပါ:

1. Deploy link ကို နှိပ်ပါ: https://render.com/deploy?repo=https://github.com/devluuking-ai/live-arena-mm
2. GitHub account နဲ့ Render ကို ဝင်ပါ (account မရှိသေးရင် GitHub နဲ့ အသစ်ဖွင့်ပါ)။
3. **Apply / Deploy** နှိပ်ပါ။ မိနစ်အနည်းငယ်အတွင်း `https://live-arena-mm.onrender.com` လို link ရပါမယ်။
4. Render dashboard → **Environment** မှာ `CONTROL_TOKEN` တန်ဖိုးကို ကူးထားပါ (deploy တုန်းက အလိုလို ထုတ်ပေးထားတာပါ)။ Demo/ဂိမ်းပြောင်းတာက token မလိုဘဲ တန်းသုံးလို့ရပါတယ် — token က real TikTok LIVE ချိတ်ဖို့နဲ့ settings သိမ်းဖို့ပဲ လိုတာပါ။

မှတ်ချက်: Render free plan က အသုံးမပြုတာ ကြာရင် အိပ်ပျော်တတ်လို့ LIVE မစခင် link ကို တစ်ခါ ကြိုဖွင့်ထားပါ (ပထမဆုံး ဖွင့်ရင် စက္ကန့် ၃၀–၆၀ ကြာနိုင်ပါတယ်)။

## LIVE လွှင့်နည်း

1. Web link ကို browser မှာ ဖွင့်ပါ — Studio card တွေ ပေါ်ပါမယ်။
2. ကြိုက်တဲ့ Studio ကို ဖွင့်ပါ။ အဆင့် ၄ ဆင့် ပါပါတယ်: **Scene / Audio / Rules & Text / Go Live**။
3. **Auto-Demo** နဲ့ အရင် စမ်းကြည့်ပါ (Comment/Gift/Like အတုတွေနဲ့ ဂိမ်း လှုပ်ရှားတာ မြင်ရပါမယ်)။
4. **Go Live** tab မှာ Control Token ကို တစ်ခါ ထည့်ပါ (browser က မှတ်ထားပေးပါမယ်)။
5. TikTok မှာ **+ → LIVE → Mobile gaming → Go LIVE** အရင် စပါ။
6. Go Live tab မှာ username `aicreater999` (@ မပါ) ထည့်ပြီး **TikTok LIVE ချိတ်မယ်** နှိပ်ပါ။ Status `connected` ဖြစ်ရင် ရပါပြီ။
7. **Fullscreen Broadcast စမယ်** နှိပ်ပြီး broadcast screen ကို ရှေ့မှာ ထားပါ။ Do Not Disturb ဖွင့်ထားပါ။

## PC LIVE Studio / OBS

Overlay link ကို Add source → Link / Browser source ထဲ ထည့်ပါ:

```text
https://ကိုယ့်-link/o/main?ratio=16:9
```

## ကိုယ့်စက်မှာ run ချင်ရင်

Node 22+ လိုပါတယ်:

```bash
npm install
npm start
```

`http://localhost:3000` ဖွင့်ပါ။ Docker နဲ့လည်း ရပါတယ်: `docker build -t live-arena-mm . && docker run -p 3000:3000 live-arena-mm`

## မှတ်ချက်

- TikTok password မလိုပါ။ Username နဲ့ public LIVE ကိုပဲ ဖတ်ပါတယ်။
- API key / license / watermark / အချိန်ကန့်သတ်ချက် မရှိပါ။
- Control Token ထည့်ထားရင် ကိုယ်ပဲ ထိန်းနိုင်ပါတယ် — token ကို သူများကို မပေးပါနဲ့။
- မြန်မာ TTS အသံထွက်ဖို့ device မှာ မြန်မာ voice ရှိရပါမယ်။
- Graphics က 2D ပါ။
- ဂိမ်း ၂၅ မျိုး ပါပါတယ်: နိုင်ငံအလံ တိုက်ပွဲ၊ ဥယျာဉ် ကာကွယ်ပွဲ၊ လက်ဝှေ့၊ ပါးရိုက်၊ ကားပြိုင်၊ အသံထရပ်၊ လွန်ဆွဲ၊ ပွဲတော် ထရပ်၊ ဘီလူးကြီး၊ အင်းလေး လှေပြိုင် အပါအဝင် အခြားဂိမ်းများ။
