import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Uses an already-running local Chrome debugging session and Vite preview.
const origin = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:5181';
const targets = await fetch('http://127.0.0.1:9228/json').then(response => response.json());
const target = targets.find(item => item.type === 'page');
assert(target, 'A Chrome page must be available');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let requestId = 0;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
  const request = pending.get(message.id);
  if (request) { pending.delete(message.id); message.error ? request.reject(message.error) : request.resolve(message.result); }
});
const command = (method, params = {}) => new Promise((resolve, reject) => { const id = ++requestId; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result?.value;
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression, description) {
  for (let attempt = 0; attempt < 80; attempt++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(200); }
  throw Error(`Timed out: ${description}`);
}
async function screenshot(name) {
  const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const file = join(tmpdir(), name);
  await writeFile(file, Buffer.from(result.data, 'base64'));
  console.log(`Screenshot: ${file}`);
}
async function click(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await delay(80);
  const bounds = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`);
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', ...bounds, button: 'left', clickCount: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', ...bounds, button: 'left', clickCount: 1 });
}
try {
  await command('Runtime.enable');
  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: `${origin}/?case-qa=${Date.now()}#project/inforisk` });
  await until("document.querySelector('.project-details-dialog[open]')", 'deep-linked case study');
  await until("document.querySelector('.case-product-frame img')?.complete && document.querySelector('.case-product-frame img')?.naturalWidth > 0", 'product screenshot');
  await screenshot('nextlvl-case-desktop.png');
  const projects = await evaluate("import('/src/data/projectCaseStudies.ts').then(module => module.PROJECTS.map(p => ({slug:p.slug,nodes:p.architecture.nodes.length,edges:p.architecture.edges.length})))");
  assert.equal(projects.length, 11);
  for (const project of projects) {
    await evaluate(`window.location.hash = '#project/${project.slug}'`);
    await until(`document.querySelector('dialog')?.dataset.project === '${project.slug}' && document.querySelectorAll('.architecture-node').length === ${project.nodes}`, project.slug);
    await delay(120);
    assert.equal(await evaluate("document.querySelectorAll('.architecture-edge').length"), project.edges, `${project.slug}: valid graph connections`);
    assert(await evaluate("Array.from(document.querySelectorAll('.architecture-node-title')).every(text => text.getComputedTextLength() <= 232)"), `${project.slug}: diagram titles fit their nodes`);
    await until("document.querySelector('.case-product-frame img')?.complete && document.querySelector('.case-product-frame img')?.naturalWidth > 0", `${project.slug} image`);
    assert(await evaluate("!document.querySelector('#case-evidence') && !/\\.pdf|README|source-verified|reviewed source/.test(document.querySelector('.case-study').innerText)"), `${project.slug}: research metadata stays off the public page`);
    await evaluate("document.querySelectorAll('.architecture-node')[1].dispatchEvent(new MouseEvent('click', {bubbles:true}))");
    await delay(30);
    assert(await evaluate("document.querySelector('.architecture-node.is-selected .architecture-node-title').textContent === document.querySelector('.architecture-inspector h4').textContent"), `${project.slug}: selection updates the inspector`);
  }
  console.log('PASS: 11 deep links, images, diagrams, inspector interactions, and no public research metadata');

  await evaluate("window.location.hash = '#project/pipelinex'");
  await until("document.title.startsWith('PipelineX')", 'PipelineX page');
  await evaluate("document.querySelector('.case-section-nav button:nth-child(2)').click()");
  await until("Math.abs(document.querySelector('#case-architecture .case-section-heading').getBoundingClientRect().top - 100) < 8", 'architecture navigation settles');
  await screenshot('nextlvl-case-architecture.png');
  const zoomBefore = await evaluate("parseInt(document.querySelector('.architecture-zoom span').textContent)");
  await evaluate("document.querySelector('.architecture-zoom button[aria-label=\"Zoom in\"]').click()");
  await delay(30);
  assert(Math.abs((await evaluate("parseInt(document.querySelector('.architecture-zoom span').textContent)")) - zoomBefore - 15) <= 1);
  assert(await evaluate("getComputedStyle(document.querySelector('.architecture-canvas')).scrollbarWidth === 'none'"), 'Native diagram scrollbar is hidden');
  const panBounds = await evaluate("(() => {const r=document.querySelector('.architecture-canvas').getBoundingClientRect();return {x:r.left+r.width*0.6,y:r.top+60};})()");
  await command('Input.dispatchMouseEvent', { type: 'mousePressed', ...panBounds, button: 'left', clickCount: 1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x:panBounds.x-90, y:panBounds.y, button:'left', buttons:1 });
  await command('Input.dispatchMouseEvent', { type: 'mouseReleased', x:panBounds.x-90, y:panBounds.y, button:'left', clickCount:1 });
  assert(await evaluate("document.querySelector('.architecture-canvas').scrollLeft > 40"), 'Mouse drag pans the diagram');
  await click('.architecture-panbar input');
  assert(await evaluate("Number(document.querySelector('.architecture-panbar input').value) > 40"), 'Custom scroll control pans the diagram');
  await evaluate("document.querySelector('.architecture-expand').click()");
  await delay(50);
  assert(await evaluate("document.querySelector('.case-architecture').classList.contains('is-expanded')"), 'Expand architecture');
  await evaluate("document.querySelector('.architecture-expand').click()");
  await evaluate("document.querySelector('.architecture-mode button:last-child').click()");
  await delay(30);
  assert.equal(await evaluate("document.querySelectorAll('.architecture-component-list button').length"), 7);

  for (const width of [320, 390, 768]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: true });
    await delay(80);
    const dimensions = await evaluate("({width:document.querySelector('.case-study-scroll').clientWidth,scroll:document.querySelector('.case-study-scroll').scrollWidth})");
    assert(dimensions.scroll <= dimensions.width + 1, `${width}px: no page-level horizontal overflow`);
  }
  await evaluate("document.querySelector('.architecture-mode button:first-child').click()");
  await delay(30);
  assert(await evaluate("document.querySelector('.architecture-canvas').scrollWidth > document.querySelector('.architecture-canvas').clientWidth"), 'Small-screen diagram scrolls within its own canvas');
  assert(await evaluate("document.querySelector('.case-study-scroll').scrollWidth <= document.querySelector('.case-study-scroll').clientWidth + 1"), 'Diagram does not widen the page');
  await evaluate("document.querySelector('.architecture-node').focus()");
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  assert(await evaluate("document.querySelector('.architecture-node').getAttribute('aria-pressed') === 'true'"), 'Keyboard selects diagram components');
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("document.querySelector('.case-section-nav button:nth-child(2)').click()");
  await until("Math.abs(document.querySelector('#case-architecture .case-section-heading').getBoundingClientRect().top - 88) < 8", 'mobile architecture navigation settles');
  await screenshot('nextlvl-case-architecture-mobile.png');
  await evaluate("document.querySelector('.case-study-scroll').scrollTo({top:0,behavior:'instant'})");
  await delay(150);
  await screenshot('nextlvl-case-mobile.png');
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await until("!document.querySelector('.project-details-dialog[open]')", 'Escape closes case study');
  await click('.projects-more-card');
  await until("document.querySelectorAll('.project-case-open').length === 11", 'see all reveals all projects');
  await click('.proj-card:nth-child(9) .project-case-open');
  await until("document.title.startsWith('FormSaver') && document.querySelector('dialog[open]')", 'card opens detail');
  await evaluate("document.querySelector('.case-footer > div > button').click()");
  await until("document.title.startsWith('Nova')", 'next project');
  await evaluate("document.querySelector('.case-back').click()");
  await until("!document.querySelector('dialog[open]')", 'close returns to portfolio');
  assert.equal(runtimeErrors.length, 0, `Runtime errors: ${runtimeErrors.join(', ')}`);
  console.log('PASS: drag, custom scrolling, zoom, component list, 320/390/768px overflow, Escape, see all, card navigation, next, and back');
} finally {
  socket.close();
}
