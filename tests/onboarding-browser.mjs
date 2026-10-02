// Run against the local prototype and a Chrome debugging session on port 9333.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const base = process.env.PROTOTYPE_URL || 'http://127.0.0.1:8099/';
const tabs = await (await fetch('http://127.0.0.1:9333/json/list')).json();
const tab = tabs.find(t => t.type === 'page' && t.url.startsWith(base));
assert.ok(tab, `Open ${base} in the debugging browser first`);
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let serial = 0;
const pending = new Map();
const exceptions = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  if (pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
});
const call = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++serial;
  pending.set(id, message => message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result));
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const step = () => evaluate('Number(document.querySelector(".onboarding-step.active").dataset.step)');
const screenshot = async name => {
  await evaluate('document.fonts.ready');
  const result = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(`/tmp/chinstrap-${name}.png`, Buffer.from(result.data, 'base64'));
};
const roles = {
  athlete: ['Date of birth', 'Position / event', 'Parent / guardian', 'Official roster link', 'Insight Plus'],
  parent: ['Your relationship', 'Annual program budget', 'Athlete invitation', 'Accepted athlete connection', 'Insight Family'],
  coach: ['Professional role', 'Coaching specialty', 'Organization administrator', 'Coaching credential', 'Professional community'],
  agent: ['Agency / business name', 'Regions served', 'Agency representative', 'Public professional listing', 'Professional community'],
  organization: ['Organization name', 'Listing status', 'Co-administrator', 'Authorization document', 'Organization workspace'],
};
const timeout = setTimeout(() => { console.error('Browser test timed out'); process.exit(1); }, 55000);
try {
  await call('Runtime.enable');
  await call('Page.enable');
  await call('Page.navigate', { url: `${base}#onboarding` });
  for (let i = 0; i < 50; i++) {
    if (await evaluate('!!document.querySelector(".setup-ready")')) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const width of [1470, 768, 390]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 956, deviceScaleFactor: 1, mobile: false });
    for (const [role, expected] of Object.entries(roles)) {
      await click('[data-onboarding-jump="1"]');
      await click(`[data-role-choice="${role}"]`);
      assert.equal(await evaluate(`document.querySelector('[data-role-choice="${role}"]').getAttribute('aria-pressed')`), 'true');
      for (let current = 1; current <= 6; current++) {
        assert.equal(await step(), current);
        const result = await evaluate(`({ text: document.querySelector('.onboarding-step.active').innerText, overflow: document.documentElement.scrollWidth > innerWidth, fields: [...document.querySelectorAll('.onboarding-step.active input, .onboarding-step.active select')].every(e => !!e.closest('label')) })`);
        assert.equal(result.overflow, false, `${role}, step ${current}, width ${width}: overflow`);
        assert.equal(result.fields, true, `${role}, step ${current}: missing label`);
        if (current > 1) assert.ok(result.text.includes(expected[current - 2]), `${role}, step ${current}: wrong content`);
        if (current === 2) {
          await evaluate(`document.querySelector('.onboarding-step.active input').value = 'Test ${role}'`);
          if (role !== 'athlete') assert.ok(!result.text.includes('Date of birth'));
        }
        if (current === 4) {
          await evaluate(`document.querySelector('.setup-invitations input').value = 'demo@example.com'`);
          await click('[data-setup-invite="0"]');
          assert.match(await evaluate(`document.querySelector('.invite-status').innerText`), /Nothing sent/);
        }
        if (current === 5) {
          await click('[name="setup-verification"][value="2"]');
          assert.equal(await evaluate(`document.querySelector('[data-setup-proof="2"]').hidden`), false);
          assert.equal(await evaluate(`document.querySelector('[data-setup-proof="0"]').hidden`), true);
        }
        if (width === 1470 && role === 'organization' && current === 2) await screenshot('organization-profile');
        if (width === 390 && role === 'coach' && current === 5) await screenshot('mobile-coach-verification');
        if (current < 6) await click('#step-next');
      }
      await click('#step-back');
      assert.equal(await step(), 5);
      await click('.onboarding-step.active [data-setup-skip]');
      assert.equal(await step(), 6);
      await click('[data-onboarding-jump="2"]');
      assert.equal(await evaluate(`document.querySelector('.onboarding-step.active input').value`), `Test ${role}`);
      console.log(`PASS ${role}: six steps, back, skip, verification, invitations, labels and reflow @ ${width}px`);
    }
  }
  await click('[data-onboarding-jump="1"]');
  await click('[data-role-choice="athlete"]');
  assert.equal(await evaluate(`document.querySelector('[data-step="2"] input').value`), 'Test athlete');
  await click('[data-onboarding-jump="6"]');
  await click('#step-next');
  assert.equal(await evaluate(`document.querySelector('#screen-app').classList.contains('active')`), true);
  assert.match(await evaluate(`document.querySelector('.nav-profile small').innerText`), /Athlete/);
  await click('[data-logout]');
  await click('[data-panel="dashboard"]');
  assert.equal(await evaluate(`document.querySelector('#screen-login').classList.contains('active')`), true);
  assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
  console.log('PASS role draft isolation, completion, logout and sign-in gate; no JavaScript exceptions');
} finally {
  await call('Emulation.setDeviceMetricsOverride', { width: 1470, height: 956, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url: `${base}#onboarding` });
  clearTimeout(timeout);
  ws.close();
}
