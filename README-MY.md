# Myanmar Live Studio — စတိတ်ရှိုးပုံစံ သုံးနည်း

အရင် စတိတ်ရှိုး TikTok LIVE လုပ်သလိုပဲ ဖုန်း Termux ကနေ run ပြီး သုံးရတဲ့ ပုံစံပါ။

## တစ်ခါပဲ setup

Termux မှာ:

```bash
pkg install nodejs
node -v
```

Node 22+ ဖြစ်ရပါမယ်။ Zip ကို Termux home ထဲမှာ ဖြေပြီး:

```bash
cd live-studio-mm
bash start.sh
```

`start.sh` က `npm install` လိုရင် အလိုလို လုပ်ပေးပြီး server စပေးပါတယ်။

## ဖုန်းနဲ့ LIVE လွှင့်နည်း

1. Browser မှာ `http://localhost:3000/control` ဖွင့်ပါ။
2. Browser tab နောက်တစ်ခုမှာ `http://localhost:3000/overlay` ဖွင့်ပြီး **အသံဖွင့်ရန်** နှိပ်ပါ။
3. Control မှာ Sim နဲ့ အရင် စမ်းပါ (Comment / Gift / Like)။
4. TikTok → **+** → **LIVE** → **Mobile gaming** → **Go LIVE** အရင် စပါ။
5. Control မှာ username `aicreater999` (@ မပါ) ထည့်ပြီး **TikTok ချိတ်မယ်** နှိပ်ပါ။
6. Overlay tab ကို ရှေ့မှာ ထားပါ။ Do Not Disturb ဖွင့်ထားပါ။

## ဒုတိယဖုန်း / PC ကနေ ထိန်းရန်

Server စတဲ့အခါ Termux မှာ LAN link ပြပါမယ်။ Wi-Fi တူရင် ဒုတိယဖုန်း/PC browser မှာ:

```text
http://ဖုန်း-IP:3000/control
```

ဖွင့်ပြီး ထိန်းနိုင်ပါတယ်။

## PC LIVE Studio / OBS

Overlay link ကို Add source → Link / Browser source ထဲ ထည့်ပါ:

```text
http://localhost:3000/overlay?ratio=16:9
```

## မှတ်ချက်

- TikTok password မလိုပါ။ Username နဲ့ public LIVE ကိုပဲ ဖတ်ပါတယ်။
- API key / license / watermark / အချိန်ကန့်သတ်ချက် မရှိပါ။
- မြန်မာ TTS အသံထွက်ဖို့ device မှာ မြန်မာ voice ရှိရပါမယ်။
- Graphics က 2D ပါ။
- Dashboard/control ကို public internet မှာ မဖွင့်ပါနဲ့ — ကိုယ့် Wi-Fi မှာပဲ သုံးပါ။
