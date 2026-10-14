'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sishi-build-check-'));
const password = crypto.randomBytes(24).toString('base64url');
const salt = crypto.randomBytes(16).toString('hex');
const env = { ...process.env, BRIEF_PASSWORD: password, STATICRYPT_PASSWORD: password, BRIEF_SALT: salt };
const run = (file, args, options = {}) => execFileSync(file, args, { cwd: temp, env, stdio: 'pipe', ...options });
const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? pages(p) : e.name.endsWith('.html') ? [p] : [];
});

try {
  for (const name of ['scripts', 'templates', 'entries']) fs.cpSync(path.join(root, name), path.join(temp, name), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
  run(process.execPath, ['scripts/build.js']);
  run('bash', ['scripts/encrypt.sh']);
  const input = pages(path.join(temp, 'public'));
  run(path.join(root, 'node_modules', '.bin', 'staticrypt'), [
    ...fs.readdirSync(path.join(temp, 'dist')).map((e) => path.join(temp, 'dist', e)),
    '-r', '--decrypt', '-d', path.join(temp, 'decoded'), '--config', 'false', '-s', salt,
  ]);
  for (const file of input) {
    const decoded = path.join(temp, 'decoded', path.relative(path.join(temp, 'public'), file));
    if (!fs.readFileSync(file).equals(fs.readFileSync(decoded))) throw new Error('Decrypted page differs from source');
  }
  const withoutPassword = { ...env };
  delete withoutPassword.BRIEF_PASSWORD;
  let blocked = false;
  try { run('bash', ['scripts/encrypt.sh'], { env: withoutPassword }); }
  catch (error) { blocked = String(error.stderr).includes('Refusing to publish unencrypted pages.'); }
  if (!blocked) throw new Error('Missing password did not block publication');
  console.log(`PASS: ${input.length} encrypted pages match source; missing password blocks publication.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
