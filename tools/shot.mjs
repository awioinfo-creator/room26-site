#!/usr/bin/env node
/* Headless Chromium screenshots via the DevTools protocol (no dependencies, Node >= 22).
   Usage:
     node tools/shot.mjs <url> <width> <height> <outPrefix> [y1,y2,...] [--full] [--anim]
   Examples:
     node tools/shot.mjs http://127.0.0.1:8126/ 1440 900 qa/d 0,900,1800        -> qa/d-0.png qa/d-900.png ...
     node tools/shot.mjs http://127.0.0.1:8126/ 390 844 qa/m --full             -> qa/m-full.png (whole page)
   By default the page is loaded with "#__scroll=0" so reveal animations are disabled (html.no-anim);
   pass --anim to load it normally (real animations / IntersectionObserver reveals).
   Prints console errors / uncaught exceptions to stdout. */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const [,, url, wArg, hArg, out, ysArg, ...flags] = process.argv;
if (!url || !out) { console.error('usage: shot.mjs <url> <w> <h> <outPrefix> [y1,y2] [--full] [--anim]'); process.exit(2); }
const W = +wArg || 1440, H = +hArg || 900;
const allFlags = [ysArg, ...flags].filter(Boolean);
const full = allFlags.includes('--full');
const anim = allFlags.includes('--anim');
const jsFlag = allFlags.find(f => f.startsWith('--js='));
const preJs = jsFlag ? jsFlag.slice(5) : '';
const ys = (ysArg && !ysArg.startsWith('--')) ? ysArg.split(',').map(Number) : [0];
const CHROME = process.env.CHROME || '/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome';
const target = anim ? url : (url.includes('#') ? url : url + '#__scroll=0');

const chrome = spawn(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0', `--window-size=${W},${H}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); });
  chrome.on('exit', c => rej(new Error('chrome exited ' + c)));
  setTimeout(() => rej(new Error('no devtools url\n' + buf)), 15000);
});
const port = new URL(wsUrl).port;
const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const page = pages.find(p => p.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const listeners = [];
ws.addEventListener('message', ev => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result); }
  else if (msg.method) listeners.forEach(l => l(msg));
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const once = (method) => new Promise(res => { const l = m => { if (m.method === method) { listeners.splice(listeners.indexOf(l), 1); res(m.params); } }; listeners.push(l); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const logs = [];
listeners.push(m => {
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(m.params.type.toUpperCase() + ': ' + m.params.args.map(a => a.value ?? a.description ?? '').join(' '));
  if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) logs.push('LOG ' + m.params.entry.level.toUpperCase() + ': ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
if (allFlags.includes('--nojs')) await send('Emulation.setScriptExecutionDisabled', { value: true });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
const loaded = once('Page.loadEventFired');
await send('Page.navigate', { url: target });
await loaded;
await send('Runtime.evaluate', { expression: 'document.fonts ? document.fonts.ready.then(()=>1) : 1', awaitPromise: true });
/* force lazy images to load so full-page captures show them */
await send('Runtime.evaluate', { expression: `(async()=>{const imgs=[...document.images];imgs.forEach(i=>{i.loading='eager';if(i.dataset.src){i.src=i.dataset.src}});await Promise.all(imgs.map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,8000)})));await Promise.all(imgs.map(i=>i.decode().catch(()=>0)));return imgs.length})()`, awaitPromise: true });
await sleep(anim ? 2200 : 700);
if (preJs) { await send('Runtime.evaluate', { expression: preJs, awaitPromise: true }); await sleep(900); }

const evalNum = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
const docH = await evalNum('Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)');

if (full) {
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: docH, scale: 1 } });
  writeFileSync(`${out}-full.png`, Buffer.from(shot.data, 'base64'));
  console.log(`${out}-full.png ${W}x${docH}`);
} else {
  for (const y of ys) {
    if (!allFlags.includes('--noscroll')) await send('Runtime.evaluate', { expression: `window.scrollTo({top:${y},left:0,behavior:'instant'})` });
    await sleep(anim ? 1400 : 350);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(`${out}-${y}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`${out}-${y}.png ${W}x${H} (scrollY=${await evalNum('window.scrollY')})`);
  }
}
console.log(`document height: ${docH}px`);
console.log(logs.length ? 'CONSOLE:\n' + logs.join('\n') : 'CONSOLE: clean');
ws.close(); chrome.kill('SIGKILL');
