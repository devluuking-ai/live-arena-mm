import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';

async function withServer(fn) {
  const server = createServer();
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { server.close(); }
}
const post = (base, path, body) => fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then(r => r.json());

test('room lifecycle: create, sim chat scores tug, gift fills goal and donors', async () => {
  await withServer(async base => {
    const room = await post(base, '/api/rooms', { username: 'aicreater999' });
    assert.match(room.id, /^MM-[0-9A-F]{6}$/);
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'chat', id: 'u1', name: 'မေသူ', text: '1' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'chat', id: 'u2', name: 'ကိုဖြိုး', text: '2' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'gift', id: 'u1', name: 'မေသူ', gift: 'နှင်းဆီ', diamonds: 100, count: 2 });
    const state = await fetch(`${base}/api/rooms/${room.id}/state`).then(r => r.json());
    assert.equal(state.scores.a >= 1, true);
    assert.equal(state.scores.b >= 1, true);
    assert.equal(state.goal.current, 200);
    assert.equal(state.donors[0].name, 'မေသူ');
    assert.equal(state.donors[0].gifts, 200);
  });
});

test('quiz: correct comment wins; game switch mid-live keeps viewers', async () => {
  await withServer(async base => {
    const room = await post(base, '/api/rooms', { username: 'x' });
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setGame', game: 'quiz' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'chat', id: 'u9', name: 'အေးမြတ်', text: 'နေပြည်တော်' });
    let state = await fetch(`${base}/api/rooms/${room.id}/state`).then(r => r.json());
    assert.equal(state.quiz.winner, 'အေးမြတ်');
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setGame', game: 'temple' });
    state = await fetch(`${base}/api/rooms/${room.id}/state`).then(r => r.json());
    assert.equal(state.game, 'temple');
    assert.equal(state.viewers.length, 1);
  });
});

test('like milestone, follow, number guess and region scoring', async () => {
  await withServer(async base => {
    const room = await post(base, '/api/rooms', { username: 'x' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'like', id: 'u1', name: 'A', count: 1000 });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'follow', id: 'u1', name: 'A' });
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setGame', game: 'region' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'chat', id: 'u2', name: 'B', text: 'ရန်ကုန်' });
    const state = await fetch(`${base}/api/rooms/${room.id}/state`).then(r => r.json());
    assert.equal(state.likes, 1000);
    assert.equal(state.follows, 1);
    assert.equal(state.regions['ရန်ကုန်'], 1);
  });
});

test('pages and SSE first state frame', async () => {
  await withServer(async base => {
    const room = await post(base, '/api/rooms', { username: 'x' });
    for (const p of ['/', '/dashboard', '/guide', '/control', '/overlay', '/live/control.html', '/live/overlay.html', `/o/${room.id}`]) {
      const r = await fetch(base + p);
      assert.equal(r.status, 200, p);
      assert.match(await r.text(), /<html/i);
    }
    const ctrl = new AbortController();
    const res = await fetch(`${base}/api/rooms/${room.id}/events`, { signal: ctrl.signal });
    const reader = res.body.getReader();
    const { value } = await reader.read();
    ctrl.abort();
    assert.match(new TextDecoder().decode(value), /"type":"state"/);
  });
});

test('arena games: flag battle country scoring, gift mapping power, versus teams', async () => {
  await withServer(async base => {
    const room = await post(base, '/api/rooms', { username: 'x' });
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setGame', game: 'flagbattle' });
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setMapping', gifts: { Rose: 50 }, chatA: ['1'], chatB: ['2'] });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'chat', id: 'u1', name: 'A', text: 'MM' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'gift', id: 'u1', name: 'A', gift: 'Rose', diamonds: 1, count: 1 });
    let state = await fetch(`${base}/api/rooms/${room.id}/state`).then(r => r.json());
    assert.equal(state.countries.MM >= 11, true); // chat +1, mapped gift 50/5=+10
    assert.equal(state.donors[0].gifts, 50); // mapping power replaces diamond value
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setGame', game: 'lethwei' });
    await post(base, `/api/rooms/${room.id}/control`, { action: 'setSettings', teamA: 'ရန်ကုန်', teamB: 'မန္တလေး', roundSec: 90, winScore: 10, banner: 'test', backdrop: 'Festival Ring' });
    await post(base, `/api/rooms/${room.id}/sim`, { kind: 'chat', id: 'u2', name: 'B', text: '2' });
    await post(base, `/api/rooms/${room.id}/control`, { action: 'resetRound' });
    state = await fetch(`${base}/api/rooms/${room.id}/state`).then(r => r.json());
    assert.equal(state.settings.roundSec, 90);
    assert.equal(state.round, 2);
    assert.equal(state.scores.b, 0);
  });
});

test('health endpoint and control token guard', async () => {
  await withServer(async base => {
    const health = await fetch(`${base}/health`).then(r => r.json());
    assert.equal(health.ok, true);
    assert.equal(typeof health.version, 'string');
    process.env.CONTROL_TOKEN = 'test-token-123';
    try {
      const noTok = await fetch(`${base}/api/rooms/main/control`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'setGame', game: 'tug' }) });
      assert.equal(noTok.status, 401);
      const withTok = await fetch(`${base}/api/rooms/main/control`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-control-token': 'test-token-123' }, body: JSON.stringify({ action: 'setGame', game: 'tug' }) });
      assert.equal(withTok.status, 200);
      const stateOpen = await fetch(`${base}/api/rooms/main/state`);
      assert.equal(stateOpen.status, 200); // read-only state stays open for overlays
    } finally { delete process.env.CONTROL_TOKEN; }
  });
});

test('unknown room is 404 and demo room exists', async () => {
  await withServer(async base => {
    assert.equal((await fetch(`${base}/api/rooms/NOPE/state`)).status, 404);
    const demo = await fetch(`${base}/api/rooms/demo/state`).then(r => r.json());
    assert.equal(demo.viewers.length >= 6, true);
    const main = await fetch(`${base}/api/rooms/main/state`).then(r => r.json());
    assert.equal(main.id, 'main');
    assert.equal(main.game, 'tug');
  });
});
