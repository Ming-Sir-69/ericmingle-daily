#!/usr/bin/env bash
# Encrypt every built page with StatiCrypt so the public Netlify site asks for a password.
# Refuses to publish if the password is missing, so plaintext never goes online.
set -euo pipefail

if [ -z "${BRIEF_PASSWORD:-}" ]; then
  echo "BRIEF_PASSWORD is not set. Refusing to publish unencrypted pages." >&2
  exit 1
fi

rm -rf dist
npx --yes staticrypt@3 public -r -d dist \
  -p "$BRIEF_PASSWORD" \
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

# Sanity check: no page in dist may still contain the plain brief markup.
if grep -rl 'class="item-title"' dist >/dev/null 2>&1; then
  echo "Found unencrypted content in dist/. Aborting." >&2
  exit 1
fi
echo "encrypted $(find dist -name '*.html' | wc -l) page(s)"
