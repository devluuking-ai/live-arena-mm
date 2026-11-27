'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const page = document.body.dataset.page || 'hub';
const qs = new URLSearchParams(location.search);
const roomId = (location.pathname.match(/^\/o\/([^/]+)/)?.[1]) || qs.get('room') || 'main';
let lang = localStorage.getItem('la_lang') || 'my';
const T = {
  my: { studios:'ကစားနိုင်တဲ့ Studio များ', open:'Studio ဖွင့်မယ်', free:'Auto-Demo အခမဲ့ • Real LIVE အတွက် Token', back:'← Hub သို့ပြန်', scene:'1. Scene', audio:'2. Audio', rules:'3. Rules & Text', golive:'4. Go Live', demo:'Auto-Demo စမယ်', stopDemo:'Auto-Demo ရပ်မယ်', launch:'Fullscreen Broadcast စမယ်', connect:'TikTok LIVE ချိတ်မယ်', disconnect:'ချိတ်ဆက်မှု ဖြတ်မယ်', username:'TikTok @username (password မလိုပါ)', backdrop:'Scene နောက်ခံ ရွေးပါ', teamA:'ဘယ်အသင်း', teamB:'ညာအသင်း', roundSec:'အလှည့်အချိန် (စက္ကန့်)', winScore:'အနိုင်ရမှတ်', banner:'အပေါ် Banner စာ', guideBox:'Viewer Guide Box', overlayText:'Live Text Overlay', mapping:'Gift & Comment → Action Mapping', save:'သိမ်းမယ်', songs:'Built-in သီချင်းများ', upload:'ကိုယ်ပိုင် MP3 / WAV တင်မယ်', musicVol:'Music အသံ', sfxVol:'SFX အသံ', announcer:'အသံဖတ်ပြသူ', off:'ပိတ်', browserTts:'Browser TTS (အခမဲ့)', overlayLink:'Overlay link (OBS / LIVE Studio)', copy:'ကူးမယ်', controls:'Controls', pause:'ရပ်', restart:'အသစ်စ', mute:'အသံပိတ်', exit:'ထွက်', sim:'Simulator (Offline စမ်းရန်)', done:'ပြီးပြီ', more:'အခြားဂိမ်းများ', soon:'မကြာမီ', upcoming:'နောက်လာမည့် Studio များ (PHASE 2)', status:'အခြေအနေ', token:'Control Token (Web deploy မှာ သတ်မှတ်ထားရင် တစ်ခါထည့်ပါ)', tokenNeed:'Real LIVE ချိတ်ဖို့ Control Token ထည့်ပါ (Render → Environment မှာ ရှိတယ်) — Demo ကတော့ token မလိုဘဲ သုံးလို့ရတယ်', tokenSave:'Token သိမ်းမယ်', soundOn:'အသံဖွင့်ရန်' },
  en: { studios:'PLAYABLE STUDIOS', open:'Open Studio', free:'Free Auto-Demo • Token for LIVE', back:'← Back to Hub', scene:'1. Scene', audio:'2. Audio', rules:'3. Rules & Text', golive:'4. Go Live', demo:'Start Auto-Demo', stopDemo:'Stop Auto-Demo', launch:'Launch Fullscreen Broadcast', connect:'Connect TikTok LIVE', disconnect:'Disconnect', username:'TikTok @username (no password needed)', backdrop:'CHOOSE SCENE BACKDROP', teamA:'Left side', teamB:'Right side', roundSec:'Round length (seconds)', winScore:'Winning score', banner:'Top Live Banner', guideBox:'Viewer Guide Box', overlayText:'Live Text Overlay', mapping:'Gift & Comment → Action Mapping', save:'Save', songs:'Built-in songs', upload:'Upload Custom MP3 / WAV', musicVol:'Music Vol', sfxVol:'SFX Vol', announcer:'AI Announcer / Voice Readout', off:'Off', browserTts:'Browser TTS (Free)', overlayLink:'Overlay link (OBS / LIVE Studio)', copy:'Copy', controls:'Open Controls', pause:'Pause', restart:'Restart', mute:'Mute', exit:'Exit', sim:'Quick Simulator Deck (Test Offline)', done:'Done', more:'MORE GAMES', soon:'Soon', upcoming:'UPCOMING STUDIOS (PHASE 2)', status:'Status', token:'Control Token (enter once if set on the web deploy)', tokenNeed:'Enter the Control Token to connect a real LIVE (Render → Environment) — Demo works without it', tokenSave:'Save token', soundOn:'Tap for sound' }
};
const t = k => (T[lang] && T[lang][k]) || T.my[k] || k;
const FEATURED = [
  { id:'flagbattle', chip:'3D LIVE', my:'နိုင်ငံအလံ တိုက်ပွဲ 3D', en:'Country Flag Battle 3D', meta:'9:16 & 16:9 • Comment နိုင်ငံကုဒ်', dmy:'နိုင်ငံ ၁၀ နိုင်ငံ အလံဘောလုံးတွေ ကွင်းထဲ တိုက်ကြမယ်။ Gift နဲ့ ကြီးလာ၊ TITAN MODE ဝင်နိုင်တယ်။', den:'Ten country flag balls battle in an arena. Gifts grow your ball and trigger TITAN MODE.', backs:['3D Floating Arena','Neon Arena'], song:'arena' },
  { id:'garden', chip:'3D LIVE', my:'ဥယျာဉ် ကာကွယ်ပွဲ 3D', en:'Garden Defence 3D', meta:'9:16 & 16:9 • Gift = လက်နက်', dmy:'ရွာဥယျာဉ်ကို ဘီလူးတွေဆီက ကာကွယ်ပါ။ Comment 1–5 တန်းရွေး၊ Gift နဲ့ ပစ်ခတ်ပါ။', den:'Defend the village garden from bilus. Comment 1–5 to pick a row, gifts shoot.', backs:['Village Garden','Night Garden'], song:'garden' },
  { id:'lethwei', chip:'LIVE GAME', my:'လက်ဝှေ့ပွဲ', en:'Lethwei Boxing', meta:'9:16 & 16:9 • Gift = ထိုးချက်', dmy:'ရန်ကုန် vs မန္တလေး လက်ဝှေ့။ Gift နဲ့ ထိုး၊ ကန်၊ ဒူး၊ ခေါင်းတိုက် — KO ရရင် အနိုင်။', den:'Yangon vs Mandalay lethwei. Gifts punch, kick, knee and headbutt. KO wins.', backs:['Festival Ring','Night Ring'], song:'fight', versus:true },
  { id:'slap', chip:'LIVE GAME', my:'ပါးရိုက်ပွဲ', en:'Slap Battle', meta:'9:16 & 16:9 • Gift = ပါးရိုက်', dmy:'ရယ်စရာ ပါးရိုက်ပြိုင်ပွဲ။ ကိုယ့်အသင်း Gift က ပြိုင်ဘက်ကို ပါးရိုက်မယ်။', den:'Comedy slap contest. Your team gifts slap the opponent.', backs:['Festival Stage','Neon Stage'], song:'funny', versus:true },
  { id:'car', chip:'3D LIVE', my:'ကားပြိုင် 3D', en:'Car Race', meta:'9:16 & 16:9 • Gift = Nitro', dmy:'အမြန်လမ်းပေါ် ကားပြိုင်။ Gift နဲ့ အရှိန်တင်၊ ပန်းတိုင်အရင်ရောက်သူ အနိုင်။', den:'Highway car race. Gifts add speed and nitro, first to finish wins.', backs:['Neon Expressway','Sunset Highway'], song:'arena' },
  { id:'soundtruck', chip:'3D LIVE', my:'အသံထရပ် တိုက်ပွဲ', en:'Sound Truck Battle', meta:'9:16 & 16:9 • Gift = စပီကာ', dmy:'အသံထရပ် ၂ စီး ထိပ်တိုက်။ Gift နဲ့ စပီကာ ထပ်၊ ကွင်းထဲ ကပါ။', den:'Two speaker trucks face off. Gifts stack speakers and start the dance.', backs:['Festival Night Field','Neon Field'], song:'edm', versus:true },
  { id:'tug', chip:'LIVE GAME', my:'လွန်ဆွဲပွဲ', en:'Tug-of-War Arena', meta:'9:16 & 16:9 • Gift = ဆွဲအား', dmy:'အသင်း ၂ သင်း လွန်ဆွဲ။ Comment +1၊ Gift +5/+10 ဆွဲအား။', den:'Two-team rope pull. Comments +1, gifts pull harder.', backs:['Village Field','Thingyan Street','Sunset Riverbank'], song:'march', versus:true },
  { id:'partytruck', chip:'LIVE GAME', my:'ပွဲတော် ထရပ်', en:'Village Party Truck', meta:'9:16 & 16:9 • Comment = တက်က', dmy:'Comment ရေးရင် ထရပ်ပေါ် တက်ကမယ်။ Gift နဲ့ VIP ရွှေအကသမား ဖြစ်မယ်။', den:'Comment to ride and dance on the party truck. Gifts make VIP dancers.', backs:['Sunny Village','Sunset Road','Night Neon Party'], song:'festival' },
  { id:'monster', chip:'LIVE GAME', my:'ဘီလူးကြီး တိုက်ပွဲ', en:'Monster Raid', meta:'9:16 & 16:9 • Gift = ထိချက်', dmy:'LIVE တစ်ခုလုံး ဘီလူးကြီးကို အတူချကြမယ်။ HP ကုန်ရင် အနိုင်။', den:'The whole LIVE attacks the giant ogre before time runs out.', backs:['Dusk Village','Blood Moon'], song:'boss' },
  { id:'boatrace', chip:'LIVE GAME', my:'အင်းလေး လှေပြိုင်', en:'Inle Boat Race', meta:'9:16 & 16:9 • Comment 1–4', dmy:'ခြေထောက်လှော်လှေ ၄ စီး ပြိုင်။ Comment 1–4 နဲ့ လှေရွေး၊ Gift နဲ့ တွန်းပါ။', den:'Four leg-rowing boats race. Comment 1–4 to join, gifts boost.', backs:['Morning Lake','Sunset Lake'], song:'rowing' }
];
const feat = id => FEATURED.find(f => f.id === id);
const titleOf = g => { const f = feat(g.id); return f ? (lang === 'en' ? f.en : f.my) : g.label; };
const LEGACY = [
  { id:'temple', label:'ဘုရားဖူး', how:'Comment ရေးရင် ခုံနေရာ ရမယ်၊ Gift ပို့ရင် ပူဇော်မှု ပေါ်မယ်' },
  { id:'pagoda', label:'စေတီဖူး', how:'နေ့/ည အလိုက် scene ပြောင်းတယ်၊ Comment ရေးပြီး ဝင်ထိုင်ပါ' },
  { id:'race', label:'အပြေးပြိုင်', how:'Comment / Like နဲ့ ကိုယ့်အပြေးသမားကို ရှေ့တိုးပါ' },
  { id:'horse', label:'မြင်းပြိုင်', how:'Comment / Like နဲ့ မြင်းကို အားဖြည့်ပါ' },
  { id:'boat', label:'လှေပြိုင်', how:'Comment / Like နဲ့ လှေကို ရှေ့တွန်းပါ' },
  { id:'marble', label:'ဂေါ်လီပြိုင်', how:'Comment / Like နဲ့ ဂေါ်လီကို လှိမ့်ပါ' },
  { id:'quiz', label:'မေးခွန်း', how:'အဖြေမှန်ကို Comment ရေးပါ — အရင်ဆုံးမှန်သူ အနိုင်ရမယ်' },
  { id:'number', label:'ဂဏန်းခန့်မှန်း', how:'1 မှ 100 ကြား ဂဏန်းတစ်ခုကို Comment ရေးပါ' },
  { id:'climb', label:'တောင်တက်', how:'Comment ရေးရင် တစ်ဆင့်တက်မယ်၊ Gift ဆို ပိုတက်မယ်' },
  { id:'penalty', label:'ပင်နယ်တီ', how:'ဘယ် / လယ် / ညာ တစ်ခုကို Comment ရေးပြီး ကန်ပါ' },
  { id:'boss', label:'Boss တိုက်ပွဲ', how:'Comment = ထိချက် ၁၊ Gift = ထိချက်အကြီး — Boss ကို အတူချကြမယ်' },
  { id:'peacock', label:'ဒေါင်းအက', how:'Like နဲ့ Comment တွေက ဒေါင်းအမွှေးတွေ ဖွင့်ပေးမယ်' },
  { id:'thingyan', label:'သင်္ကြန်', how:'Comment နဲ့ ရေပက်၊ Gift နဲ့ ရေအကြီးပက်ပါ' },
  { id:'region', label:'ဒေသပြိုင်', how:'ကိုယ့်ဒေသနာမည်ကို Comment ရေးပါ — ဥပမာ ရန်ကုန်၊ မန္တလေး၊ ရှမ်း' },
  { id:'survival', label:'အသက်ရှင်ကျန်', how:'Comment ဆက်ရေးနေသူပဲ ကျန်မယ် — အလှည့်တိုင်း အနည်းဆုံးသူ ထွက်ရမယ်' }
];
const ALL_GAMES = [...FEATURED.map(f => ({ id:f.id, label:f.my, how:f.dmy })), ...LEGACY];
const COUNTRY_LIST = ['MM','TH','SG','JP','KR','MY','CN','US','UK','AE'].map(code => ({ code, name:code }));
function makePreviewState(gameId) {
  const f = feat(gameId);
  const viewers = DEMO_NAMES_PREVIEW.map((name, i) => ({ id:'pv'+i, name, score: 40 - i*4, gifts: i<3 ? 120 - i*30 : 0, vip: i===0, climb: 8 - i, alive: true }));
  return {
    id: roomId, username:'', game: gameId, games: ALL_GAMES, safeMode:true, tts:true, bgm:false,
    scores:{ a:12, b:9 }, likes:1234, follows:56, shares:12,
    goal:{ label:'ပန်းတိုင်', target:1000, current:350, celebrated:false },
    viewers, donors: viewers.filter(v=>v.gifts>0).map(v=>({ name:v.name, gifts:v.gifts })), feed:[],
    lanes:['အနီ','အပြာ','အစိမ်း','အဝါ','ခရမ်း','လိမ္မော်'].map((name,i)=>({ name, pos: 14 + ((i*9)%34), i })),
    regions:{ 'ရန်ကုန်':42, 'မန္တလေး':35, 'ရှမ်း':21, 'ဧရာဝတီ':16, 'မွန်':11, 'စစ်ကိုင်း':8 },
    quiz:{ question:'မြန်မာနိုင်ငံရဲ့ မြို့တော်က ဘယ်မြို့လဲ?', choices:['ရန်ကုန်','နေပြည်တော်','မန္တလေး'], answer:'နေပြည်တော်', open:true, winner:'' },
    number:{ best:{ name:'မေသူ', guess:48, dist:3 }, lastHint:'ပိုကြီးတဲ့ ဂဏန်း' },
    boss:{ hp:320, max:500 }, feathers:12, penalty:{ goals:3, saves:2, last:'' },
    countries:{ MM:42, TH:30, SG:18, JP:25, KR:21, MY:12, CN:16, US:14, UK:8, AE:6 }, countryList: COUNTRY_LIST,
    garden:{ hp:86, kills:24, wave:2 },
    settings:{ banner:'Gift ပို့ပြီး ကိုယ့်အသင်းကို အားပေးပါ', teamA:'ရန်ကုန်', teamB:'မန္တလေး', roundSec:120, winScore:30, backdrop: f ? f.backs[0] : '' },
    mapping:{ gifts:{}, chatA:['1'], chatB:['2'] }, round:1,
    tiktok:{ status:'idle', username:'', error:'' }
  };
}
const DEMO_NAMES_PREVIEW = ['မေသူ','ကိုဖြိုး','အေးမြတ်','သက်ထား','ကျော်ကျော်','နှင်းနှင်း'];
const SIDES = ['ရန်ကုန်','မန္တလေး','နေပြည်တော်','ဧရာဝတီ','စစ်ကိုင်း','ပဲခူး','မကွေး','ရှမ်း','မွန်','ရခိုင်','ကချင်','ကရင်','တနင်္သာရီ','ချင်း','ကယား','Singapore','Thailand','Malaysia','Japan','Korea','USA','Dubai','Myanmar'];
const SONGS = [ {id:'festival',n:'Village Festival'}, {id:'edm',n:'Sound Truck EDM'}, {id:'fight',n:'Lethwei Fight'}, {id:'funny',n:'Funny Bounce'}, {id:'march',n:'Heave-Ho March'}, {id:'rowing',n:'Rowing Groove'}, {id:'boss',n:'Boss Battle'}, {id:'arena',n:'Arena Anthem'}, {id:'garden',n:'Happy Garden'} ];
const DEFAULT_MAP = [ ['Rose',5],['နှင်းဆီ',5],['Finger Heart',5],['GG',5],['Ice Cream Cone',10],['Doughnut',30],['Perfume',50],['Money Gun',100],['Galaxy',300],['Lion',500],['Universe',1000] ];
let S = null; // server state
let demoTimer = null, paused = false, muted = false, showGuide = true, showBanner = true, showAlerts = true, showCounts = true;
let roundLeft = 120, lastRound = 1, winnerText = '', winnerUntil = 0, toastText = '', toastUntil = 0, roundResetting = false;
const particles = [], floats = [];
const api = p => `/api/rooms/${encodeURIComponent(roomId)}${p}`;
async function post(path, body) { try { const tok = localStorage.getItem('la_token') || ''; const r = await fetch(path, { method:'POST', headers:{'content-type':'application/json', ...(tok ? {'x-control-token': tok} : {})}, body: JSON.stringify(body || {}) }); const j = await r.json().catch(() => ({})); if (r.status === 401) { showTokenBanner(j.error); const e = $('tkErr'); if (e) e.textContent = j.error || 'Control Token လိုပါတယ်'; } return j; } catch { return {}; } }
function control(body) { return post(api('/control'), body); }
function sim(body) { return post(api('/sim'), body); }
function simCountry(cd, gift) { sim({ kind:'chat', id:'sim_me', name:'Host Test', text:cd }); if (gift) setTimeout(() => sim({ kind:'gift', id:'sim_me', name:'Host Test', gift:'Rose', diamonds:5, count:1 }), 180); }
function tokenBannerHTML() { return `<div class="tokenbanner hidden" id="tokenBanner"><div>${t('tokenNeed')}</div><div class="row" style="margin-top:8px"><input id="bannerToken" type="password" placeholder="CONTROL_TOKEN"><button class="primary narrow" id="bannerTokenSave">${t('tokenSave')}</button></div></div>`; }
function showTokenBanner(msg) { const b = $('tokenBanner'); if (!b) return; b.classList.remove('hidden'); const liveTab = document.querySelector('[data-tab="live"]'); if (liveTab && !liveTab.classList.contains('on')) liveTab.click(); if (msg) { const d = b.querySelector('div'); if (d) d.textContent = msg; } const inp = $('bannerToken'); if (inp && document.activeElement !== inp) inp.focus(); }
function bindTokenBanner() {
  const save = $('bannerTokenSave'); const inp = $('bannerToken');
  if (save && inp) save.onclick = () => { localStorage.setItem('la_token', inp.value.trim()); const g = $('ctlToken'); if (g) g.value = inp.value.trim(); $('tokenBanner').classList.add('hidden'); };
  fetch('/api/config').then(r => r.json()).then(cfg => { if (cfg.tokenRequired && !localStorage.getItem('la_token')) showTokenBanner(); }).catch(() => {});
}
function speak(text) {
  if (!text || muted) return;
  const mode = localStorage.getItem('la_tts') || 'browser';
  if (mode === 'off') return;
  try { if (window.AndroidBridge && AndroidBridge.speak) { AndroidBridge.speak(text); return; } } catch {}
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'my-MM'; speechSynthesis.speak(u); } catch {}
}
/* ---------- audio (synthesized, copyright-free) ---------- */
let AC = null, bgmTimer = null, curSong = '', customAudio = null;
const musicVol = () => Number(localStorage.getItem('la_mvol') || 65) / 100;
const sfxVol = () => Number(localStorage.getItem('la_svol') || 85) / 100;
function ac() { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; }
function tone(f, dur = .18, vol = .2, type = 'triangle', when = 0) {
  if (muted) return; const c = ac(), o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol * sfxVol(), c.currentTime + when);
  g.gain.exponentialRampToValueAtTime(.001, c.currentTime + when + dur);
  o.connect(g).connect(c.destination); o.start(c.currentTime + when); o.stop(c.currentTime + when + dur);
}
function sfx(name) { if (name === 'gift') { tone(880,.15,.25); tone(1320,.2,.2,'triangle',.08); } else if (name === 'hit') tone(160,.12,.3,'square'); else if (name === 'win') [523,659,784,1047].forEach((f,i)=>tone(f,.25,.25,'triangle',i*.12)); else if (name === 'chat') tone(660,.06,.08); }
const SONG_NOTES = { festival:[262,330,392,523,392,330], edm:[110,110,165,110,196,165], fight:[98,98,147,98,131,147], funny:[392,494,587,494,392,330], march:[196,262,196,262,330,262], rowing:[220,262,330,262,220,196], boss:[87,87,104,87,98,87], arena:[262,262,392,523,392,262], garden:[330,392,440,392,330,262] };
function playSong(id) {
  stopSong(); curSong = id;
  if (customAudio) { customAudio.volume = musicVol(); customAudio.play().catch(()=>{}); return; }
  const notes = SONG_NOTES[id] || SONG_NOTES.festival; let i = 0;
  bgmTimer = setInterval(() => { if (!muted) tone(notes[i % notes.length], .3, .12 * musicVol() / Math.max(.01, sfxVol()), 'triangle'); i++; }, 340);
}
function stopSong() { if (bgmTimer) clearInterval(bgmTimer); bgmTimer = null; if (customAudio) customAudio.pause(); }
/* ---------- demo bots ---------- */
const DEMO_NAMES = ['မေသူ','ကိုဖြိုး','အေးမြတ်','သက်ထား','ကျော်ကျော်','နှင်းနှင်း','စိုးစိုး','မင်းမင်း'];
function demoEvent() {
  if (!S) return;
  const name = DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)];
  const id = 'demo_' + DEMO_NAMES.indexOf(name);
  const r = Math.random();
  if (r < .45) {
    let text = '1';
    if (S.game === 'flagbattle') text = ['MM','TH','SG','JP','KR','US'][Math.floor(Math.random()*6)];
    else if (S.game === 'garden') text = String(1 + Math.floor(Math.random()*5));
    else if (S.game === 'boatrace') text = String(1 + Math.floor(Math.random()*4));
    else if (S.game === 'partytruck') text = 'ကမယ်';
    else if (S.game === 'quiz') text = S.quiz.choices[Math.floor(Math.random()*S.quiz.choices.length)] || '1';
    else if (S.game === 'number') text = String(1 + Math.floor(Math.random()*100));
    else if (S.game === 'region') text = ['ရန်ကုန်','မန္တလေး','ရှမ်း'][Math.floor(Math.random()*3)];
    else text = Math.random() < .5 ? '1' : '2';
    sim({ kind:'chat', id, name, text });
  } else if (r < .75) {
    const g = DEFAULT_MAP[Math.floor(Math.random()*6)];
    sim({ kind:'gift', id, name, gift:g[0], diamonds:g[1], count:1 });
  } else if (r < .9) sim({ kind:'like', id, name, count: 20 + Math.floor(Math.random()*80) });
  else sim({ kind:'follow', id, name });
}
function setDemo(on) {
  if (on && !demoTimer) { demoTimer = setInterval(demoEvent, 1600); demoEvent(); }
  if (!on && demoTimer) { clearInterval(demoTimer); demoTimer = null; }
  document.querySelectorAll('[data-demo]').forEach(b => { b.textContent = demoTimer ? t('stopDemo') : t('demo'); b.classList.toggle('demo-on', !!demoTimer); });
  const badge = $('demoBadge'); if (badge) badge.classList.toggle('hidden', !demoTimer);
}
function onFx(f) {
  if (!f) return;
  if (f.say) speak(f.say);
  if (f.kind === 'gift') { sfx('gift'); if (showAlerts) { toastText = `${f.name} • ${f.gift} +${f.value}`; toastUntil = Date.now() + 2600; } burst(); }
  if (f.kind === 'chat') { sfx('chat'); floats.push({ x: Math.random(), y: .75, txt: `${f.name}: ${f.text}`, until: Date.now() + 2200 }); }
  if (f.kind === 'titan') { sfx('win'); toastText = 'TITAN MODE — ' + f.name; toastUntil = Date.now() + 3000; }
  if (['raceWin','quizWin','numberWin','bossDown','goalReached'].includes(f.kind)) { sfx('win'); winnerText = f.say || f.name || 'WIN'; winnerUntil = Date.now() + 4000; }
}
function burst() { for (let i = 0; i < 18; i++) particles.push({ x: .5 + (Math.random()-.5)*.3, y: .5, vx: (Math.random()-.5)*.01, vy: -Math.random()*.012, life: 60, hue: Math.floor(Math.random()*360) }); }
function connectSSE(onState) {
  const es = new EventSource(api('/events'));
  es.onmessage = e => { try { const m = JSON.parse(e.data); if (m.type === 'state') { S = m.state; if (S.round !== lastRound) { lastRound = S.round; roundLeft = S.settings.roundSec; winnerText = ''; roundResetting = false; } onState && onState(S); } else if (m.type === 'fx') onFx(m.fx); } catch {} };
}
/* ---------- canvas game renderers ---------- */
const COLORS = ['#ff5252','#42a5f5','#66bb6a','#ffee58','#ab47bc','#ffa726'];
const pagodaImg = new Image(); let pagodaReady = false;
pagodaImg.onload = () => { pagodaReady = true; document.querySelectorAll('[data-preview]').forEach(cv => { const keep = S; S = makePreviewState(cv.dataset.preview); drawGame(cv); S = keep; }); };
pagodaImg.src = '/public/pagoda-bg.jpg';
function drawCover(c, img, w, h) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  c.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
const FLAG_COLORS = { MM:'#f9d616', TH:'#2d2a4a', SG:'#ef3340', JP:'#ffffff', KR:'#0047a0', MY:'#010066', CN:'#de2910', US:'#3c3b6e', UK:'#012169', AE:'#00732f' };
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h);c.fill();}
function txt(c,s,x,y,size=20,color='#fff',align='center',bold=true){c.fillStyle=color;c.font=`${bold?'700 ':''}${size}px system-ui,'Noto Sans Myanmar',sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
function bar(c,x,y,w,h,pct,color){c.fillStyle='rgba(255,255,255,.18)';rr(c,x,y,w,h,h/2);c.fillStyle=color;rr(c,x,y,Math.max(h,w*Math.min(1,Math.max(0,pct))),h,h/2);}
function backdrop(c,w,h,game){
  if ((game==='temple'||game==='pagoda') && pagodaReady) { drawCover(c, pagodaImg, w, h); return; }
  const b = (S && S.settings.backdrop) || '';
  const night = /night|neon|blood|dusk/i.test(b);
  const g = c.createLinearGradient(0,0,0,h);
  if (game==='boatrace'||game==='boat'){g.addColorStop(0,night?'#1a2a6c':'#87ceeb');g.addColorStop(.45,night?'#16224d':'#bfe8f5');g.addColorStop(.46,'#1f7a9e');g.addColorStop(1,'#0d4d66');}
  else if (night){g.addColorStop(0,'#0b1030');g.addColorStop(1,'#241b4d');}
  else {g.addColorStop(0,'#3a6fd8');g.addColorStop(.6,'#7db3f0');g.addColorStop(1,'#2e7d32');}
  c.fillStyle=g;c.fillRect(0,0,w,h);
  if (night){c.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<40;i++){c.fillRect((i*97)%w,(i*57)%(h*.4),2,2);}}
}
function fighter(c,x,y,s,color,hit,slap){
  c.fillStyle=color; c.beginPath(); c.arc(x,y-46*s,20*s,0,7); c.fill(); // head
  c.fillStyle='#f2c79b'; c.beginPath(); c.arc(x,y-46*s,15*s,0,7); c.fill();
  c.fillStyle=color; rr(c,x-16*s,y-28*s,32*s,44*s,10*s); // body
  const hx = x + (hit?34*s:18*s), hy = y-16*s - (slap?10*s:0);
  c.strokeStyle='#f2c79b'; c.lineWidth=9*s; c.beginPath(); c.moveTo(x+8*s,y-20*s); c.lineTo(hx,hy); c.stroke();
  c.fillStyle='#e53935'; c.beginPath(); c.arc(hx,hy,10*s,0,7); c.fill(); // glove/hand
  c.strokeStyle=color; c.lineWidth=10*s; c.beginPath(); c.moveTo(x-8*s,y+14*s); c.lineTo(x-14*s,y+42*s); c.moveTo(x+8*s,y+14*s); c.lineTo(x+16*s,y+42*s); c.stroke();
}
function truck(c,x,y,s,color,speakers,flip){
  c.save(); c.translate(x,y); if(flip)c.scale(-1,1);
  c.fillStyle=color; rr(c,-60*s,-30*s,120*s,44*s,8*s);
  c.fillStyle='#263238'; rr(c,34*s,-52*s,30*s,26*s,6*s);
  c.fillStyle='#111'; [-36,36].forEach(dx=>{c.beginPath();c.arc(dx*s,18*s,13*s,0,7);c.fill();});
  c.fillStyle='#37474f'; for(let i=0;i<Math.min(8,speakers);i++){const sx=(-48+(i%4)*24)*s, sy=(-58-Math.floor(i/4)*26)*s; rr(c,sx,sy,20*s,22*s,4*s); c.fillStyle='#90caf9'; c.beginPath(); c.arc(sx+10*s,sy+11*s,6*s,0,7); c.fill(); c.fillStyle='#37474f';}
  c.restore();
}
function drawVersus(c,w,h,now){
  const a=S.scores.a,b=S.scores.b, win=S.settings.winScore||30;
  txt(c,S.settings.teamA,w*.25,h*.14,26,'#ff8a80'); txt(c,S.settings.teamB,w*.75,h*.14,26,'#82b1ff');
  txt(c,String(a),w*.25,h*.2,44,'#fff'); txt(c,String(b),w*.75,h*.2,44,'#fff');
  bar(c,w*.06,h*.25,w*.38,16,a/win,'#ff5252'); bar(c,w*.56,h*.25,w*.38,16,b/win,'#42a5f5');
  const hitA = (now/300|0)%3===0 && a>=b, hitB = (now/300|0)%3===1 && b>a;
  if (S.game==='tug'){
    const mid=w/2 + (b-a)*3; c.strokeStyle='#d7ccc8'; c.lineWidth=8; c.beginPath(); c.moveTo(w*.12,h*.55); c.lineTo(w*.88,h*.55); c.stroke();
    c.fillStyle='#ffb300'; c.beginPath(); c.moveTo(mid,h*.55-26); c.lineTo(mid+30,h*.55-14); c.lineTo(mid,h*.55-2); c.fill();
    fighter(c,w*.2,h*.55,1.1,'#ff5252',hitA); c.save(); c.translate(w*.8,h*.55); c.scale(-1,1); fighter(c,0,0,1.1,'#42a5f5',hitB); c.restore();
  } else if (S.game==='soundtruck'){
    truck(c,w*.26,h*.58,1.2,'#ff7043',2+Math.min(6,a/5)); truck(c,w*.74,h*.58,1.2,'#42a5f5',2+Math.min(6,b/5),true);
    for(let i=0;i<6;i++){const x=w*(.35+i*.06), y=h*.8+Math.sin(now/200+i)*6; c.fillStyle=COLORS[i]; c.beginPath(); c.arc(x,y,9,0,7); c.fill();}
  } else {
    const slap=S.game==='slap';
    fighter(c,w*.32,h*.55,1.6,'#ff5252',hitA,slap); c.save(); c.translate(w*.68,h*.55); c.scale(-1,1); fighter(c,0,0,1.6,'#42a5f5',hitB,slap); c.restore();
    const hpA=Math.max(0,100-b*2), hpB=Math.max(0,100-a*2);
    txt(c,'HP',w*.32,h*.33,15,'#ffcdd2'); bar(c,w*.14,h*.36,w*.36,14,hpA/100,'#ff5252');
    txt(c,'HP',w*.68,h*.33,15,'#bbdefb'); bar(c,w*.5,h*.36,w*.36,14,hpB/100,'#42a5f5');
    if (slap && (hitA||hitB)) txt(c,'ဖြောင်း!',w/2,h*.42,34,'#ffee58');
  }
  if (a>=win||b>=win){const wn=a>=win?S.settings.teamA:S.settings.teamB; txt(c,wn+' အနိုင်ရ!',w/2,h*.78,36,'#ffb300');}
}
function drawLanes(c,w,h,now,boats){
  const lanes=S.lanes.slice(0,boats?4:6), max=60;
  lanes.forEach((l,i)=>{
    const y=h*(.28+i*(.6/lanes.length));
    c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=2; c.beginPath(); c.moveTo(w*.05,y+16); c.lineTo(w*.95,y+16); c.stroke();
    const x=w*.08 + (w*.8)*Math.min(1,l.pos/max);
    if (boats){ c.fillStyle='#6d4c41'; rr(c,x-34,y-6,68,16,8); c.fillStyle=COLORS[i]; rr(c,x-6,y-26,12,22,5); c.strokeStyle=COLORS[i]; c.lineWidth=4; c.beginPath(); c.moveTo(x,y-8); c.lineTo(x+16,y+10); c.stroke(); txt(c,String(i+1),w*.05,y,18,'#fff'); }
    else if (S.game==='car'){ c.fillStyle=COLORS[i]; rr(c,x-30,y-14,60,22,8); c.fillStyle='#263238'; rr(c,x-14,y-24,28,14,5); c.fillStyle='#111'; [-16,16].forEach(dx=>{c.beginPath();c.arc(x+dx,y+9,7,0,7);c.fill();}); }
    else { c.fillStyle=COLORS[i]; c.beginPath(); c.arc(x,y,15,0,7); c.fill(); txt(c,l.name,x,y+30,14,'#fff'); }
  });
  txt(c,'ပန်းတိုင်',w*.93,h*.2,16,'#ffb300');
}
function drawFlag(c,w,h,now){
  const list=S.countryList||[]; const cx=w/2, cy=h*.55;
  c.fillStyle='rgba(20,30,80,.9)'; c.beginPath(); c.ellipse(cx,cy,w*.44,h*.3,0,0,7); c.fill();
  c.strokeStyle='#ffb300'; c.lineWidth=3; c.beginPath(); c.ellipse(cx,cy,w*.44,h*.3,0,0,7); c.stroke();
  const max=Math.max(10,...list.map(x=>S.countries[x.code]||0));
  list.forEach((ct,i)=>{
    const sc=S.countries[ct.code]||0, ang=now/2500 + i*(Math.PI*2/list.length);
    const rx=w*.3, ry=h*.19, x=cx+Math.cos(ang)*rx, y=cy+Math.sin(ang)*ry;
    const r=16+34*(sc/max);
    const g=c.createRadialGradient(x-r*.3,y-r*.3,2,x,y,r); g.addColorStop(0,'#ffffff'); g.addColorStop(.25,FLAG_COLORS[ct.code]||'#888'); g.addColorStop(1,'#222');
    c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill();
    if (sc===max&&sc>0){c.strokeStyle='#ffb300';c.lineWidth=4;c.beginPath();c.arc(x,y,r+5,0,7);c.stroke();}
    txt(c,ct.code,x,y,Math.max(12,r*.5),'#fff'); txt(c,String(sc),x,y+r+14,14,'#ffe082');
  });
}
function drawGarden(c,w,h,now){
  txt(c,'Wave '+S.garden.wave+' • Kills '+S.garden.kills,w/2,h*.13,22,'#c5e1a5');
  bar(c,w*.2,h*.17,w*.6,14,S.garden.hp/100,'#66bb6a');
  for(let rI=0;rI<5;rI++){
    const y=h*(.28+rI*.13);
    c.fillStyle='rgba(46,125,50,.55)'; rr(c,w*.05,y,w*.9,h*.1,10);
    txt(c,String(rI+1),w*.08,y+h*.05,18,'#fff');
    c.fillStyle='#43a047'; c.beginPath(); c.arc(w*.18,y+h*.05,16,0,7); c.fill();
    c.fillStyle='#e53935'; c.beginPath(); c.arc(w*.18,y+h*.03,7,0,7); c.fill();
    const n=Math.max(0, 4 - Math.floor(S.garden.kills/8) + (rI%2));
    for(let i=0;i<n;i++){const x=w*.92-((now/30+i*140+rI*70)%(w*.6)); c.fillStyle='#5d4037'; c.beginPath(); c.arc(x,y+h*.05,14,0,7); c.fill(); c.fillStyle='#ffecb3'; c.beginPath(); c.arc(x-4,y+h*.04,3,0,7); c.arc(x+4,y+h*.04,3,0,7); c.fill();}
  }
}
function drawMonster(c,w,h,now){
  const hp=S.boss.hp/S.boss.max;
  txt(c,'HP '+S.boss.hp+' / '+S.boss.max,w/2,h*.14,22,'#ffcdd2'); bar(c,w*.15,h*.18,w*.7,18,hp,'#e53935');
  const x=w/2, y=h*.52+Math.sin(now/400)*6, s=Math.min(w,h)/300;
  c.fillStyle='#4e342e'; c.beginPath(); c.arc(x,y,80*s,0,7); c.fill();
  c.fillStyle='#6d4c41'; c.beginPath(); c.arc(x,y-70*s,46*s,0,7); c.fill();
  c.fillStyle='#fff'; [-18,18].forEach(dx=>{c.beginPath();c.arc(x+dx*s,y-78*s,10*s,0,7);c.fill();});
  c.fillStyle='#111'; [-18,18].forEach(dx=>{c.beginPath();c.arc(x+dx*s,y-78*s,5*s,0,7);c.fill();});
  c.fillStyle='#fff'; for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(x+i*14*s-5*s,y-40*s);c.lineTo(x+i*14*s+5*s,y-40*s);c.lineTo(x+i*14*s,y-24*s);c.fill();}
  (S.donors||[]).slice(0,3).forEach((d,i)=>txt(c,(i+1)+'. '+d.name+' — '+d.gifts,w/2,h*(.82+i*.05),18,'#ffe082'));
}
function drawParty(c,w,h,now){
  const y=h*.62+Math.sin(now/300)*4;
  truck(c,w/2,y,2.2,'#ffb300',6);
  const riders=(S.viewers||[]).slice(0,12);
  riders.forEach((v,i)=>{
    const x=w*(.18+(i%6)*.13), yy=y-90-Math.floor(i/6)*46+Math.abs(Math.sin(now/180+i))*10;
    c.fillStyle=v.vip?'#ffd700':COLORS[i%6]; c.beginPath(); c.arc(x,yy,15,0,7); c.fill();
    txt(c,v.name,x,yy-26,13,v.vip?'#ffd700':'#fff');
  });
  if(!riders.length) txt(c,'Comment ရေးပြီး တက်ကပါ',w/2,h*.3,24,'#ffe082');
}
function drawGeneric(c,w,h,now){
  txt(c,(S.games.find(g=>g.id===S.game)||{}).label||S.game,w/2,h*.12,30,'#ffb300');
  txt(c,(S.games.find(g=>g.id===S.game)||{}).how||'',w/2,h*.18,17,'#dbe4ff');
  if (['race','horse','boat','marble'].includes(S.game)) return drawLanes(c,w,h,now,false);
  if (S.game==='boss') return drawMonster(c,w,h,now);
  if (S.game==='region'){
    const rows=Object.entries(S.regions).sort((x,y)=>y[1]-x[1]).slice(0,8); const max=Math.max(1,...rows.map(r=>r[1]));
    rows.forEach((r,i)=>{const y=h*(.28+i*.08); txt(c,r[0],w*.2,y,17,'#fff','right'); bar(c,w*.24,y-9,w*.6,18,r[1]/max,COLORS[i%6]); txt(c,String(r[1]),w*.88,y,16,'#ffe082');});
    return;
  }
  if (S.game==='quiz'){ txt(c,S.quiz.question,w/2,h*.35,24,'#fff'); S.quiz.choices.forEach((ch,i)=>txt(c,(i+1)+'. '+ch,w/2,h*(.45+i*.08),20,'#ffe082')); if(S.quiz.winner)txt(c,S.quiz.winner+' မှန်!',w/2,h*.75,26,'#69f0ae'); return; }
  if (S.game==='number'){ txt(c,'1–100 ခန့်မှန်းပါ',w/2,h*.35,26,'#fff'); txt(c,S.number.lastHint||'',w/2,h*.45,20,'#ffe082'); if(S.number.best)txt(c,'အနီးဆုံး: '+S.number.best.name+' ('+S.number.best.guess+')',w/2,h*.55,18,'#dbe4ff'); return; }
  if (S.game==='temple'||S.game==='pagoda'){
    // Seated worshippers on the marble courtyard (photo backdrop fills the screen).
    (S.viewers||[]).slice(0,24).forEach((v,i)=>{
      const row=Math.floor(i/6), col=i%6;
      const x=w*(.14+col*.145), y=h*(.7+row*.065);
      c.fillStyle=v.vip?'#ffd700':COLORS[i%6]; c.beginPath(); c.arc(x,y,13,0,7); c.fill();
      c.fillStyle='rgba(5,8,26,.75)'; rr(c,x-34,y+16,68,20,10);
      txt(c,v.name,x,y+26,11,v.vip?'#ffd700':'#fff');
    });
    const flowers=Math.min(12,(S.donors||[]).reduce((a,d)=>a+Math.ceil(d.gifts/10),0));
    for(let i=0;i<flowers;i++){ const x=w*(.2+i*.055), y=h*.655; c.fillStyle='#f8a5c2'; c.beginPath(); c.arc(x,y,7,0,7); c.fill(); c.fillStyle='#ffb300'; c.beginPath(); c.arc(x,y,3,0,7); c.fill(); }
    if(!(S.viewers||[]).length) txt(c,'Comment ရေးပြီး တရားဝိုင်းထဲ ဝင်ပါ',w/2,h*.74,20,'#ffe082');
    return;
  }
  // scoreboard fallback
  (S.viewers||[]).slice(0,8).forEach((v,i)=>{const y=h*(.3+i*.07); txt(c,(i+1)+'. '+v.name,w*.3,y,18,'#fff','right'); txt(c,String(v.score),w*.7,y,18,'#ffe082','left');});
  if(S.game==='peacock'){for(let i=0;i<S.feathers;i++){const a=Math.PI*(.15+.7*i/23);c.strokeStyle=COLORS[i%6];c.lineWidth=4;c.beginPath();c.moveTo(w/2,h*.8);c.lineTo(w/2+Math.cos(a)*w*.3,h*.8-Math.sin(a)*h*.35);c.stroke();}}
  if(S.game==='penalty') txt(c,'ဂိုး '+S.penalty.goals+' • ဖမ်း '+S.penalty.saves+' '+S.penalty.last,w/2,h*.85,18,'#ffe082');
}
function drawGame(canvas){
  if (!S || !canvas) return;
  const c=canvas.getContext('2d'); const w=canvas.width, h=canvas.height; if(!w||!h)return;
  const now=paused?0:Date.now();
  backdrop(c,w,h,S.game);
  if (['lethwei','slap','soundtruck','tug'].includes(S.game)) drawVersus(c,w,h,now);
  else if (S.game==='car') drawLanes(c,w,h,now,false);
  else if (S.game==='boatrace') drawLanes(c,w,h,now,true);
  else if (S.game==='flagbattle') drawFlag(c,w,h,now);
  else if (S.game==='garden') drawGarden(c,w,h,now);
  else if (S.game==='monster') drawMonster(c,w,h,now);
  else if (S.game==='partytruck') drawParty(c,w,h,now);
  else drawGeneric(c,w,h,now);
  // particles + floats
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.0006;p.life--;if(p.life<=0){particles.splice(i,1);continue;}c.fillStyle=`hsl(${p.hue} 90% 65%)`;c.beginPath();c.arc(p.x*w,p.y*h,4,0,7);c.fill();}
  for(let i=floats.length-1;i>=0;i--){const f=floats[i];if(Date.now()>f.until){floats.splice(i,1);continue;}txt(c,f.txt,f.x*w,f.y*h,16,'#fff');}
}
function sizeCanvas(cv, ratio){
  const r=cv.getBoundingClientRect(); const dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.max(300,r.width*dpr); cv.height=Math.max(300,(ratio==='16:9'?r.width*9/16:r.height||r.width*16/9)*dpr);
}
function guideLines(){
  if(!S)return[];
  const f=feat(S.game); const g=S.games.find(x=>x.id===S.game);
  const lines=[g?g.how:''];
  if(f&&f.versus)lines.push('1 = '+S.settings.teamA+' • 2 = '+S.settings.teamB);
  if(S.game==='flagbattle')lines.push('MM / TH / SG / JP / KR / US');
  if(S.game==='boatrace')lines.push('1 • 2 • 3 • 4');
  lines.push('Gift = အားအကြီး • Like = အားအသေး');
  return lines.filter(Boolean);
}
/* ---------- pages ---------- */
function langBtn(){ return `<button id="langBtn">${lang==='my'?'မြန်မာ • EN':'English • မြန်မာ'}</button>`; }
function bindLang(){ const b=$('langBtn'); if(b)b.onclick=()=>{lang=lang==='my'?'en':'my';localStorage.setItem('la_lang',lang);location.reload();}; }
function initHub(){
  document.title='Live Arena MM — Interactive LIVE Game Studio';
  $('app').innerHTML=`
  <div class="wrap">
    <div class="brandmark">▶</div>
    <div class="logo" style="color:#fff">Live Arena MM</div>
    <div class="tagline">${lang==='en'?'Mobile-first interactive game studio for TikTok & YouTube LIVE broadcasts':'TikTok & YouTube LIVE အတွက် ဖုန်းသုံးဂိမ်း Studio'}</div>
    <div class="pillrow">${langBtn()}<span class="badge">${t('free')}</span></div>
    <h2 class="sec">${t('studios')}</h2>
    <div class="grid">${FEATURED.map(f=>`
      <div class="card"><div class="previewwrap"><canvas class="preview" data-preview="${f.id}" width="480" height="270"></canvas><span class="livebadge"><i></i>${f.chip}</span></div>
      <div class="titlerow"><h3>${lang==='en'?f.en:f.my}</h3><span class="chip new">NEW</span></div>
      <div class="meta">${f.meta}</div>
      <div class="desc">${lang==='en'?f.den:f.dmy}</div>
      <button class="primary" onclick="location.href='/dashboard?room=${roomId}&game=${f.id}'">${t('open')} ›</button></div>`).join('')}
    </div>
    <h2 class="sec">${t('more')}</h2>
    <div class="row" id="moreGames">${LEGACY.map(g=>`<button onclick="location.href='/dashboard?room=${roomId}&game=${g.id}'">${esc(g.label)}</button>`).join('')}</div>
    <h2 class="sec">${t('upcoming')}</h2>
    <div class="grid2">
      <div class="card"><div class="titlerow"><span>🔮</span><span class="chip">${t('soon')}</span></div><h3>AI ဗေဒင် Live</h3><div class="desc">${lang==='en'?'Gift-triggered Myanmar fortune readings read aloud.':'Gift နဲ့ ဗေဒင်ဟောပြီး အသံဖတ်ပြမယ်။'}</div></div>
      <div class="card"><div class="titlerow"><span>🗺️</span><span class="chip">${t('soon')}</span></div><h3>မြန်မာမြေပုံ သိမ်းပွဲ</h3><div class="desc">${lang==='en'?'Region territory battle by comments and gifts.':'ဒေသ Comment/Gift နဲ့ နယ်မြေသိမ်းပွဲ။'}</div></div>
    </div>
  </div>`;
  bindLang();
  document.querySelectorAll('[data-preview]').forEach(cv => { S = makePreviewState(cv.dataset.preview); drawGame(cv); });
  S = null;
  connectSSE(s=>{
    const more=s.games.filter(g=>!feat(g.id));
    $('moreGames').innerHTML=more.map(g=>`<button onclick="location.href='/dashboard?room=${roomId}&game=${g.id}'">${esc(g.label)}</button>`).join('');
  });
}
function simButtons(){
  if(!S)return'';
  const name=DEMO_NAMES[Math.floor(Math.random()*DEMO_NAMES.length)];
  const btn=(label,body)=>`<button onclick='sim(${JSON.stringify(body)})'>${label}</button>`;
  const me={id:'sim_me',name:'Host Test'};
  let out='';
  if(S.game==='flagbattle') out=['MM','TH','SG','JP'].map(cd=>`<button onclick="simCountry('${cd}')">${cd}</button><button onclick="simCountry('${cd}',true)">${cd} +5</button>`).join('')+btn('TITAN',{kind:'gift',...me,gift:'Lion',diamonds:500,count:1});
  else if(S.game==='garden') out=[1,2,3,4,5].map(n=>btn('Row '+n,{kind:'chat',...me,text:String(n)})).join('')+btn('Bomb',{kind:'gift',...me,gift:'Doughnut',diamonds:30,count:1});
  else if(S.game==='boatrace') out=[1,2,3,4].map(n=>btn('Boat '+n,{kind:'chat',...me,text:String(n)})).join('')+btn('Turbo',{kind:'gift',...me,gift:'Perfume',diamonds:50,count:1});
  else if(S.game==='partytruck') out=btn('Join',{kind:'chat',...me,text:'ကမယ်'})+btn('VIP',{kind:'gift',...me,gift:'Money Gun',diamonds:100,count:1})+btn('Follow',{kind:'follow',...me});
  else if(S.game==='monster'||S.game==='boss') out=btn('Hit',{kind:'chat',...me,text:'ချ'})+btn('Hammer',{kind:'gift',...me,gift:'Doughnut',diamonds:60,count:1})+btn('Lightning',{kind:'gift',...me,gift:'Galaxy',diamonds:300,count:1});
  else out=btn('1',{kind:'chat',...me,text:'1'})+btn('2',{kind:'chat',...me,text:'2'})+btn('Gift A',{kind:'gift',...me,gift:'Rose',diamonds:10,count:1})+btn('Like x50',{kind:'like',...me,count:50});
  return out+btn('Like x20',{kind:'like',...me,count:20});
}
function initStudio(){
  const wantGame=qs.get('game');
  $('app').innerHTML=`
  <div class="wrap">
    <div class="topbar"><button onclick="location.href='/?room=${roomId}'">←</button><div style="flex:1"><b id="gTitle">Studio</b><div class="small" id="gSub"></div></div>${langBtn()}</div>
    <div class="tabs">
      <button data-tab="scene" class="on">${t('scene')}</button><button data-tab="audio">${t('audio')}</button>
      <button data-tab="rules">${t('rules')}</button><button data-tab="live">${t('golive')}</button>
    </div>
    <div class="panel">
      <div class="stagewrap"><canvas id="stage" class="stage ratio916"></canvas></div>
      <div class="pvcontrols"><button id="r916" class="ratiobtn on">9:16 Portrait</button><button id="r169" class="ratiobtn">16:9 Landscape</button><button data-demo class="primary" id="demoBtn">${t('demo')}</button></div>
    </div>
    <div class="panel" id="tab-scene">
      <label>${t('backdrop')}</label><div id="backs"></div>
      <label>STUDIO SETTINGS</label><div id="studioSettings"></div>
      <div class="row" style="margin-top:10px"><button class="primary" id="saveScene">${t('save')}</button><button id="resetRound">${t('restart')}</button></div>
    </div>
    <div class="panel hidden" id="tab-audio">
      <div class="titlerow"><b>${t('songs')} (copyright-free)</b><span class="onpill">ON</span></div>
      <p class="small">Fullscreen မှာ ဖွင့်မယ် • ⭐ က ဂိမ်းသီချင်း • နှိပ်ရင် preview ဖွင့်မယ်</p>
      <div class="simgrid" id="songBtns">${SONGS.map(s=>`<button data-song="${s.id}">${s.n}</button>`).join('')}</div>
      <label>Background Music (BGM) — ${t('upload')}</label><input id="upAudio" type="file" accept="audio/*">
      <label>${t('musicVol')}: <span id="mv">${musicVol()*100}</span>%</label><input id="mvol" type="range" min="0" max="100" value="${musicVol()*100}">
      <label>${t('sfxVol')}: <span id="sv">${sfxVol()*100}</span>%</label><input id="svol" type="range" min="0" max="100" value="${sfxVol()*100}">
      <button id="ambBtn" style="width:100%;margin-top:8px">Background Ambience: OFF</button>
      <label>${t('announcer')}</label><div class="row"><button id="ttsOff">${t('off')}</button><button id="ttsBrowser">${t('browserTts')}</button></div>
    </div>
    <div class="panel hidden" id="tab-rules">
      <label>${t('banner')}</label><input id="bannerTxt">
      <div class="row" style="margin-top:8px"><button id="tgGuide" class="togpill">${t('guideBox')}: ON</button><button id="tgBanner" class="togpill">${t('overlayText')}: ON</button></div>
      <div class="titlerow" style="margin-top:12px"><b>${t('mapping')}</b><button id="mapReset">Reset Defaults</button></div>
      <p class="small">Keyword / gift name တွေကို comma နဲ့ ခြားရေးပါ</p>
      <div id="mapRows"></div>
      <div class="row" style="margin-top:8px"><button class="primary" id="saveMap">${t('save')}</button></div>
    </div>
    <div class="panel hidden" id="tab-live">
      <div class="titlerow"><b>${t('username')}</b><span class="statuspill" id="tkStatus">Offline</span></div>
      <div class="tokenpanel">${tokenBannerHTML()}<label>${t('token')}</label><input id="ctlToken" type="password" placeholder="CONTROL_TOKEN"></div>
      <label>TikTok username</label><input id="uname" placeholder="Enter @username">
      <div class="row" style="margin-top:8px"><button class="connectbtn" id="connBtn">${t('connect')}</button></div>
      <div class="row" style="margin-top:8px"><button id="discBtn">${t('disconnect')}</button></div>
      <p class="small" style="margin-top:8px"><span id="tkErr"></span></p>
      <p class="small">LIVE အရင်ဖွင့်ထားမှ ချိတ်လို့ရမယ် • Offline စမ်းဖို့ Simulator သုံးပါ</p>
      <label>${t('overlayLink')}</label>
      <div class="row"><input id="ovLink" readonly><button class="narrow" id="copyLink">${t('copy')}</button></div>
      <label>${t('sim')}</label><div class="simgrid" id="simDeck"></div>
    </div>
    <div class="launchbar"><button class="primary" style="width:100%;padding:16px;font-size:18px" id="launchBtn">${t('launch')}</button></div>
  </div>`;
  bindLang();
  bindTokenBanner();
  S = makePreviewState(wantGame && ALL_GAMES.some(g=>g.id===wantGame) ? wantGame : 'tug');
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));
    ['scene','audio','rules','live'].forEach(k=>$('tab-'+k).classList.toggle('hidden',k!==b.dataset.tab));
  });
  let ratio='9:16'; const cv=$('stage');
  $('r916').onclick=()=>{ratio='9:16';cv.className='stage ratio916';$('r916').classList.add('on');$('r169').classList.remove('on');sizeCanvas(cv,ratio);};
  $('r169').onclick=()=>{ratio='16:9';cv.className='stage ratio169';$('r169').classList.add('on');$('r916').classList.remove('on');sizeCanvas(cv,ratio);};
  $('demoBtn').onclick=()=>setDemo(!demoTimer);
  $('launchBtn').onclick=()=>{ location.href='/overlay?room='+roomId+'&game='+(S?S.game:'tug'); };
  $('ctlToken').value=localStorage.getItem('la_token')||''; $('ctlToken').oninput=e=>{localStorage.setItem('la_token',e.target.value.trim()); if(e.target.value.trim()){const b=$('tokenBanner'); if(b)b.classList.add('hidden');}};
  $('connBtn').onclick=()=>{ $('tkStatus').textContent='Connecting'; $('tkStatus').className='statuspill connecting'; post(api('/connect'),{username:$('uname').value}); };
  const fld=(id,d)=>{const e=$(id);return e?e.value:d;};
  const settingsBody=()=>({action:'setSettings',teamA:fld('teamA',S?S.settings.teamA:'ရန်ကုန်'),teamB:fld('teamB',S?S.settings.teamB:'မန္တလေး'),roundSec:Number(fld('roundSec',120)),winScore:Number(fld('winScore',30)),banner:fld('bannerTxt',S?S.settings.banner:''),backdrop:localStorage.getItem('la_back_'+(S?S.game:''))||''});
  $('discBtn').onclick=()=>post(api('/disconnect'),{});
  $('copyLink').onclick=()=>{ $('ovLink').select(); navigator.clipboard&&navigator.clipboard.writeText($('ovLink').value); };
  $('ovLink').value=location.origin+'/o/'+roomId;
  $('saveScene').onclick=()=>control(settingsBody());
  $('resetRound').onclick=()=>control({action:'resetRound'});
  const renderMapRows=(saved)=>{
    const giftRows=DEFAULT_MAP.map(([n,p])=>`<div class="mapcard"><div class="maphead"><span class="mapicon">${esc(n[0]||'G')}</span><span class="grow"><input class="mn" value="${esc(n)}"><div class="typelab">GIFT</div></span><span>PWR</span><input class="mp pwr" type="number" value="${saved[n.toLowerCase()]||p}"><button class="mo onpill">ON</button></div><input class="mk" value="${esc(n)}" style="margin-top:8px"></div>`).join('');
    const commentRows=`<div class="mapcard"><div class="maphead"><span class="mapicon">1</span><span class="grow"><b>Team A comment</b><div class="typelab">COMMENT</div></span><span>PWR</span><input class="pwr" type="number" value="1" disabled><button class="onpill">ON</button></div><input id="kwA" value="1" style="margin-top:8px"></div><div class="mapcard"><div class="maphead"><span class="mapicon">2</span><span class="grow"><b>Team B comment</b><div class="typelab">COMMENT</div></span><span>PWR</span><input class="pwr" type="number" value="1" disabled><button class="onpill">ON</button></div><input id="kwB" value="2" style="margin-top:8px"></div><div class="mapcard"><div class="maphead"><span class="mapicon">♥</span><span class="grow"><b>Likes = boost</b><div class="typelab">LIKE</div></span><span>PWR</span><input class="pwr" type="number" value="1" disabled><button class="onpill">ON</button></div></div>`;
    $('mapRows').innerHTML=giftRows+commentRows;
    document.querySelectorAll('#mapRows .mo').forEach(b=>b.onclick=()=>{const on=b.classList.contains('off'); b.classList.toggle('off',!on); b.textContent=on?'ON':'OFF';});
  };
  $('mapReset').onclick=()=>renderMapRows({});
  $('saveMap').onclick=()=>{
    const gifts={}; document.querySelectorAll('#mapRows .mapcard').forEach(r=>{const mk=r.querySelector('.mk'); if(!mk)return; const p=Number(r.querySelector('.mp').value),on=!r.querySelector('.mo').classList.contains('off'); if(on) mk.value.split(',').map(x=>x.trim()).filter(Boolean).forEach(k=>gifts[k]=p);});
    control({action:'setMapping',gifts,chatA:fld('kwA','1').split(','),chatB:fld('kwB','2').split(',')});
    control(settingsBody());
  };
  $('tgGuide').onclick=e=>{showGuide=!showGuide;e.target.textContent=t('guideBox')+': '+(showGuide?'ON':'OFF');e.target.classList.toggle('off',!showGuide);};
  $('tgBanner').onclick=e=>{showBanner=!showBanner;e.target.textContent=t('overlayText')+': '+(showBanner?'ON':'OFF');e.target.classList.toggle('off',!showBanner);};
  $('mvol').oninput=e=>{localStorage.setItem('la_mvol',e.target.value);$('mv').textContent=e.target.value; if(customAudio)customAudio.volume=musicVol();};
  $('svol').oninput=e=>{localStorage.setItem('la_svol',e.target.value);$('sv').textContent=e.target.value;};
  let ambTimer=null;
  $('ambBtn').onclick=e=>{ if(ambTimer){clearInterval(ambTimer);ambTimer=null;e.target.textContent='Background Ambience: OFF';} else { ambTimer=setInterval(()=>tone(196,.6,.03,'sine'),2400); e.target.textContent='Background Ambience: ON'; } };
  const ttsBtns=()=>{const m=localStorage.getItem('la_tts')||'browser'; $('ttsOff').classList.toggle('on',m==='off'); $('ttsBrowser').classList.toggle('on',m!=='off');};
  $('ttsOff').onclick=()=>{localStorage.setItem('la_tts','off');ttsBtns();};
  $('ttsBrowser').onclick=()=>{localStorage.setItem('la_tts','browser');ttsBtns();};
  ttsBtns();
  document.querySelectorAll('[data-song]').forEach(b=>b.onclick=()=>{customAudio=null;playSong(b.dataset.song); document.querySelectorAll('[data-song]').forEach(x=>x.classList.toggle('on',x===b));});
  $('upAudio').onchange=e=>{const f=e.target.files[0]; if(f){customAudio=new Audio(URL.createObjectURL(f)); customAudio.loop=true; playSong('custom');}};
  let first=true;
  connectSSE(s=>{
    if(first){ first=false; if(wantGame&&s.game!==wantGame) control({action:'setGame',game:wantGame}); }
    const g=s.games.find(x=>x.id===s.game); $('gTitle').textContent=g?titleOf(g):s.game;
    document.title=(g?titleOf(g):'Studio')+' — Live Arena MM';
    const f=feat(s.game); const backs=f?f.backs:['Default'];
    $('gSub').textContent=s.settings.backdrop||backs[0];
    $('backs').innerHTML=backs.map(b=>`<button class="backopt ${(localStorage.getItem('la_back_'+s.game)||backs[0])===b?'on':''}" data-back="${esc(b)}"><i></i>${esc(b)}</button>`).join('');
    document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{localStorage.setItem('la_back_'+s.game,b.dataset.back); control({...settingsBody(),backdrop:b.dataset.back});});
    const versus=['lethwei','slap','soundtruck','tug','thingyan'].includes(s.game);
    if(!$('studioSettings').children.length || $('studioSettings').dataset.game!==s.game){
      $('studioSettings').dataset.game=s.game;
      $('studioSettings').innerHTML=(versus?`<label>${t('teamA')}</label><input id="teamA"><label>${t('teamB')}</label><input id="teamB"><label>${t('winScore')}</label><input id="winScore" type="number" min="1">`:'')+`<label>${t('roundSec')}</label><input id="roundSec" type="number" min="15">`;
    }
    if($('teamA')&&document.activeElement!==$('teamA'))$('teamA').value=s.settings.teamA;
    if($('teamB')&&document.activeElement!==$('teamB'))$('teamB').value=s.settings.teamB;
    if(document.activeElement!==$('bannerTxt'))$('bannerTxt').value=s.settings.banner;
    if($('roundSec'))$('roundSec').value=s.settings.roundSec; if($('winScore'))$('winScore').value=s.settings.winScore;
    document.querySelectorAll('[data-song]').forEach(b=>{const star=f&&f.song===b.dataset.song; b.textContent=(curSong===b.dataset.song?'▶ ':'')+(star?'⭐ ':'')+(SONGS.find(x=>x.id===b.dataset.song)||{}).n;});
    if(!$('mapRows').children.length){
      renderMapRows(s.mapping.gifts||{});
      $('kwA').value=(s.mapping.chatA||['1']).join(','); $('kwB').value=(s.mapping.chatB||['2']).join(',');
    }
    $('tkStatus').textContent=s.tiktok.status==='connected'?'LIVE':s.tiktok.status==='connecting'?'Connecting':s.tiktok.status==='error'?'Error':'Offline'; $('tkStatus').className='statuspill '+s.tiktok.status;
    $('tkErr').textContent=s.tiktok.error||'';
    if(s.username&&document.activeElement!==$('uname'))$('uname').value=s.username;
    $('simDeck').innerHTML=simButtons();
  });
  sizeCanvas(cv,ratio);
  addEventListener('resize',()=>sizeCanvas(cv,ratio));
  setInterval(()=>{ if(!paused) drawGame(cv); },50);
}
function initBroadcast(){
  $('app').innerHTML=`
  <div id="bc"><canvas id="stage"></canvas>
    <div class="statusbar" id="statusBar"><span class="r" id="stRound">Round 1</span><span class="tm" id="stTime">120s</span><span class="lf" id="stLeft"></span></div>
    <div class="titlepill hidden" id="titlePill"></div>
    <div class="hud" style="top:44px"><div class="bar">
      <span class="pill" id="pillCounts"></span></div>
      <div class="banner" id="banner"></div></div>
    <div class="guideL hidden" id="guideL"></div>
    <div class="guideR hidden" id="guideR"></div>
    <div class="giftcard hidden" id="giftCard"><div class="fl">🌸</div><div>Gift ဖြင့် ဝင်<br>ထိုင် ပန်းကပ်</div><div class="pill" style="margin-top:6px">💬 Comment</div></div>
    <div class="guide" id="guide"></div>
    <div class="board" id="board"></div>
    <div class="toast hidden" id="toast"></div>
    <div class="winner hidden" id="winner"><div id="winnerTxt"></div></div>
    <div class="hintstrip hidden" id="hintStrip">TikTok LIVE စပြီး Controls ဖွင့်ဖို့ နှစ်ချက်နှိပ်ပါ</div>
    <div class="promptpill" id="promptPill"></div>
    <div class="chantbar hidden" id="chantBar"><span class="sp">♪</span><b>အတူတူ တရားနာကြမယ်</b><div class="sub" id="chantSub"></div></div>
    <div id="enterFs"><button id="enterFsBtn" class="primary">⛶ Screen အပြည့် ဖွင့်ရန်</button><div class="sub">ဒီနေရာကို နှိပ်လိုက်ရင် Browser ရဲ့ search bar နဲ့ အောက်ဘား ပျောက်ပြီး<br>Screen အပြည့် ပေါ်ပါမယ်</div></div>
    <button id="soundBtn" class="primary hidden">${t('soundOn')}</button>
    <button id="drawerBtn" aria-label="Controls"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffb300" stroke-width="2"><line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#0a0f24"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#0a0f24"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="7" cy="17" r="2" fill="#0a0f24"/></svg></button>
    <div id="drawer" class="hidden">
      <div class="handle"></div>
      <div class="titlerow"><span><span class="demobadge hidden" id="demoBadge">AUTO-DEMO</span> <b id="drawerTitle">Studio</b><div class="small" id="drawerSub"></div></span>${langBtn()}</div>
      <div class="statsrow" id="statsRow"></div>
      <div class="tiles"><button id="dPause" class="green">${t('pause')}</button><button id="dRestart">${t('restart')}</button><button id="dMute">${t('mute')}</button><button id="dExit" class="red">${t('exit')}</button></div>
      <button id="dFull" class="primary" style="width:100%">⛶ Screen အပြည့် (Fullscreen)</button>
      <label>${t('musicVol')}</label><input id="dMvol" type="range" min="0" max="100" value="${musicVol()*100}">
      <label>${t('sfxVol')}</label><input id="dSvol" type="range" min="0" max="100" value="${sfxVol()*100}">
      <div class="chips2">
        <button id="dGuide" class="togpill">${t('guideBox')}: ON</button>
        <button id="dBanner" class="togpill">${t('overlayText')}: ON</button>
        <button id="dAlerts" class="togpill">Gift alerts: ON</button>
        <button id="dCounts" class="togpill">Viewer count: ON</button>
      </div>
      <label>Simulator deck</label>
      <div class="row"><button data-demo class="primary" id="demoBtn">${t('demo')}</button></div>
      <div class="simgrid" id="simDeck"></div>
      <label>TikTok LIVE</label>
      ${tokenBannerHTML()}
      <div class="titlerow"><span>${t('username')}</span><span class="statuspill" id="tkStatus">Offline</span></div>
      <input id="uname" placeholder="Enter @username" style="margin-top:8px">
      <div class="row" style="margin-top:8px"><button class="connectbtn" id="connBtn">${t('connect')}</button></div>
      <div class="row" style="margin-top:8px"><button id="discBtn">${t('disconnect')}</button></div>
      <p class="small"><span id="tkErr"></span></p>
      <label>${t('token')}</label><input id="ctlToken" type="password" placeholder="CONTROL_TOKEN">
      <button class="primary" style="width:100%;margin-top:10px" id="dDone">${t('done')}</button>
    </div>
  </div>`;
  const cv=$('stage');
  const fit=()=>{const vv=window.visualViewport; cv.width=Math.round(vv?vv.width:innerWidth); cv.height=Math.round(vv?vv.height:innerHeight);};
  fit(); addEventListener('resize',fit);
  S = makePreviewState(qs.get('game') && ALL_GAMES.some(g=>g.id===qs.get('game')) ? qs.get('game') : 'tug');
  bindTokenBanner();
  $('ctlToken').value=localStorage.getItem('la_token')||''; $('ctlToken').oninput=e=>{localStorage.setItem('la_token',e.target.value.trim()); if(e.target.value.trim()){const b=$('tokenBanner'); if(b)b.classList.add('hidden');}};
  const goFullscreen=async()=>{
    const el=document.documentElement;
    if(document.fullscreenElement) return;
    try{ await el.requestFullscreen({navigationUI:'hide'}); }
    catch{ try{ await el.requestFullscreen(); }catch{} }
    try{ if(screen.orientation && screen.orientation.lock) await screen.orientation.lock('portrait'); }catch{}
  };
  const enterShow=()=>{
    goFullscreen();
    try{ac(); const f=S?feat(S.game):null; playSong(f?f.song:'festival');}catch{}
    $('enterFs').classList.add('hidden');
    $('soundBtn').classList.add('hidden');
  };
  $('enterFs').addEventListener('pointerdown',e=>{ e.preventDefault(); enterShow(); });
  $('soundBtn').onclick=()=>enterShow();
  $('dFull').onclick=()=>goFullscreen();
  addEventListener('fullscreenchange',()=>{
    setTimeout(fit,60);
    const sb=$('soundBtn');
    if(document.fullscreenElement){ sb.classList.add('hidden'); }
    else { sb.textContent='⛶ Screen အပြည့်'; sb.classList.remove('hidden'); }
  });
  if(window.visualViewport) visualViewport.addEventListener('resize',fit);
  document.body.addEventListener('click',()=>{ try{ac();}catch{} },{once:true});
  bindLang();
  if(!localStorage.getItem('la_hint_done')) $('hintStrip').classList.remove('hidden');
  const drawer=$('drawer');
  $('drawerBtn').onclick=()=>drawer.classList.remove('hidden');
  $('dDone').onclick=()=>{drawer.classList.add('hidden'); localStorage.setItem('la_hint_done','1'); $('hintStrip').classList.add('hidden');};
  cv.addEventListener('dblclick',()=>drawer.classList.remove('hidden'));
  $('dPause').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶':'Pause';};
  $('dRestart').onclick=()=>control({action:'resetRound'});
  $('dMute').onclick=e=>{muted=!muted;e.target.textContent=muted?'Unmute':t('mute'); if(muted)stopSong();};
  $('dExit').onclick=()=>{ location.href='/dashboard?room='+roomId; };
  $('dMvol').oninput=e=>localStorage.setItem('la_mvol',e.target.value);
  $('dSvol').oninput=e=>localStorage.setItem('la_svol',e.target.value);
  const tog=(id,label,fn)=>{$(id).onclick=e=>{const on=e.target.classList.contains('off');e.target.classList.toggle('off',!on);e.target.textContent=label+': '+(on?'ON':'OFF');fn(on);};}
  tog('dGuide',t('guideBox'),v=>showGuide=v); tog('dBanner',t('overlayText'),v=>showBanner=v); tog('dAlerts','Gift alerts',v=>showAlerts=v); tog('dCounts','Viewer count',v=>showCounts=v);
  $('demoBtn').onclick=()=>setDemo(!demoTimer);
  $('connBtn').onclick=()=>post(api('/connect'),{username:$('uname').value});
  $('discBtn').onclick=()=>post(api('/disconnect'),{});
  let songStarted='';
  connectSSE(s=>{
    $('banner').textContent=s.settings.banner; $('banner').style.display=showBanner?'':'none';
    const isFlag=s.game==='flagbattle';
    const isTemple=s.game==='temple'||s.game==='pagoda';
    $('statusBar').classList.toggle('hidden',isTemple);
    $('titlePill').classList.toggle('hidden',!isTemple);
    if(isTemple) $('titlePill').textContent='ရွှေတိဂုံ ဘုရားဖူး';
    $('giftCard').classList.toggle('hidden',!(isTemple&&showGuide));
    $('chantBar').classList.toggle('hidden',!isTemple);
    if(isTemple) $('chantSub').textContent=s.settings.banner;
    $('guideL').classList.toggle('hidden',!(isFlag&&showGuide)); $('guideR').classList.toggle('hidden',!(isFlag&&showGuide));
    if(isFlag){ $('guideL').innerHTML='<b style="color:#4dd0e1">Teams 1–4</b><br>🌹 Myanmar<br>GG Thailand<br>🫰 Singapore<br>🍦 Malaysia'; $('guideR').innerHTML='<b style="color:#ffb300">Teams 5–8</b><br>🌸 Japan<br>🍩 Korea<br>🧴 China<br>🐾 USA<br>👑 TITAN'; }
    $('guide').innerHTML=guideLines().map(esc).join('<br>'); $('guide').style.display=(showGuide&&!isFlag&&!isTemple)?'':'none';
    $('promptPill').textContent=guideLines()[0]||''; $('promptPill').style.display=(showGuide&&!isTemple)?'':'none';
    const donors=(s.donors||[]).slice(0,5);
    $('board').innerHTML=donors.length?donors.map((d,i)=>(i+1)+'. '+esc(d.name)+' — '+d.gifts).join('<br>'):'';
    $('board').style.display=donors.length?'':'none';
    $('stRound').textContent='Round '+s.round;
    $('stLeft').textContent=isFlag?(Object.values(s.countries).filter(v=>v>0).length||8)+' Left':(s.tiktok.status==='connected'?'LIVE':'SIM');
    $('pillCounts').textContent=showCounts?('👁 '+(s.viewers?s.viewers.length:0)):'';
    $('pillCounts').style.display=showCounts?'':'none';
    $('statsRow').innerHTML=`<span>👁 ${s.viewers?s.viewers.length:0}</span><span>♥ ${s.likes}</span><span>🎁 ${s.goal.current}</span>`;
    const g=s.games.find(x=>x.id===s.game); $('drawerTitle').textContent=g?titleOf(g):s.game; $('drawerSub').textContent=s.settings.backdrop||'';
    $('tkStatus').textContent=s.tiktok.status==='connected'?'LIVE':s.tiktok.status==='connecting'?'Connecting':s.tiktok.status==='error'?'Error':'Offline'; $('tkStatus').className='statuspill '+s.tiktok.status;
    $('simDeck').innerHTML=simButtons();
    const f=feat(s.game); const want=f?f.song:'festival';
    if(songStarted!==s.game){songStarted=s.game; try{playSong(want);}catch{}}
    // winner check (host broadcast client only)
    const win=s.settings.winScore||30;
    if(!winnerText && ['lethwei','slap','soundtruck','tug'].includes(s.game) && (s.scores.a>=win||s.scores.b>=win)){
      winnerText=(s.scores.a>=win?s.settings.teamA:s.settings.teamB)+' အနိုင်ရ!'; winnerUntil=Date.now()+5000; sfx('win'); speak(winnerText);
      setTimeout(()=>control({action:'resetRound'}),5200);
    }
    if(!winnerText && s.game==='boatrace' && s.lanes.slice(0,4).some(l=>l.pos>=60)){
      const i=s.lanes.slice(0,4).findIndex(l=>l.pos>=60); winnerText='လှေ '+(i+1)+' အနိုင်ရ!'; winnerUntil=Date.now()+5000; sfx('win');
      setTimeout(()=>control({action:'resetRound'}),5200);
    }
  });
  setInterval(()=>{
    if(!paused){ drawGame(cv); if(roundLeft>0)roundLeft-=.05; }
    $('stTime').textContent=Math.max(0,Math.ceil(roundLeft))+'s';
    if(roundLeft<=0&&S&&!roundResetting){ roundResetting=true; roundLeft=S.settings.roundSec; control({action:'resetRound'}); }
    const tw=$('toast'); if(Date.now()<toastUntil){tw.textContent=toastText;tw.classList.remove('hidden');}else tw.classList.add('hidden');
    const wn=$('winner'); if(Date.now()<winnerUntil){$('winnerTxt').textContent=winnerText;wn.classList.remove('hidden');}else{wn.classList.add('hidden'); if(winnerText&&Date.now()>=winnerUntil)winnerText='';}
  },50);
}
if (page==='hub') initHub(); else if (page==='studio') initStudio(); else if (page==='broadcast') initBroadcast();
