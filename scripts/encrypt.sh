#!/usr/bin/env bash
# Encrypt every built page with StatiCrypt so the public Netlify site asks for a password.
# Refuses to publish if the password is missing, so plaintext never goes online.
set -euo pipefail

if [ -z "${BRIEF_PASSWORD:-}" ]; then
  echo "BRIEF_PASSWORD is not set. Refusing to publish unencrypted pages." >&2
  exit 1
fi

rm -rf dist
STATICRYPT_PASSWORD="$BRIEF_PASSWORD" ./node_modules/.bin/staticrypt public/* -r -d dist \
  --config false \
  -s "${BRIEF_SALT:?BRIEF_SALT missing}" \
  --short \
  --remember 30 \
  --template-title "四时日报" \
  --template-instructions "输入密码，打开 Mingle 的日报。" \
  --template-placeholder "密码" \
  --template-button "打开" \
  --template-remember "在这台设备上记住 30 天" \
  --template-error "密码不对，再试一次。" \
  --template-color-primary "#C6613F" \
  --template-color-secondary "#F9F9F7"

# Every input page must have a corresponding encrypted output page.
node <<'NODE'
const fs = require('fs');
const path = require('path');
const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? pages(p) : e.name.endsWith('.html') ? [p] : [];
});
const inputs = pages('public');
const outputs = pages('dist');
if (!inputs.length || inputs.length !== outputs.length) throw new Error('Encrypted page count mismatch');
for (const input of inputs) {
  const output = path.join('dist', path.relative('public', input));
  const html = fs.readFileSync(output, 'utf8');
  if (!html.includes('staticryptEncryptedMsgUniqueVariableName') || html.includes('class="item-title"') || html.includes('class="scene-mini"')) {
    throw new Error(`Missing encryption in ${output}`);
  }
}
console.log(`encrypted ${outputs.length} page(s)`);
NODE
