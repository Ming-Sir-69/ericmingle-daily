#!/usr/bin/env bash
# GitHub builds/encrypts; Netlify serves this dedicated artifact branch.
set -euo pipefail
source_sha="${GITHUB_SHA:?GITHUB_SHA missing}"
git fetch origin master netlify-production || git fetch origin master
if [ "$(git rev-parse origin/master)" != "$source_sha" ]; then
  echo "A newer master commit exists; skipping stale publication."
  exit 0
fi

release_dir="$(mktemp -d)"
cleanup() {
  git worktree remove --force "$release_dir/git" 2>/dev/null || true
  rm -rf "$release_dir"
}
trap cleanup EXIT
mkdir "$release_dir/site"
cp -R dist/. "$release_dir/site/"
SOURCE_SHA="$source_sha" RELEASE_DIR="$release_dir" node <<'NODE'
const fs = require('fs');
const path = require('path');
const root = process.env.RELEASE_DIR;
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
  const p = path.join(dir,e.name);
  if (e.isSymbolicLink()) throw new Error('Symlink in release');
  return e.isDirectory() ? walk(p) : [p];
});
const files = walk(path.join(root,'site'));
if (!files.length || !fs.existsSync(path.join(root,'site/index.html'))) throw new Error('Empty release');
for (const file of files) {
  if (!file.endsWith('.html')) throw new Error('Unexpected release asset');
  const html = fs.readFileSync(file,'utf8');
  if (!html.includes('staticryptEncryptedMsgUniqueVariableName') || html.includes('class="item-title"') || html.includes('class="scene-mini"')) throw new Error('Plaintext release rejected');
}
fs.writeFileSync(path.join(root,'site/release.json'), JSON.stringify({source_commit:process.env.SOURCE_SHA, generated_at:new Date().toISOString(), encrypted_pages:files.length})+'\n');
NODE
cat > "$release_dir/site/_redirects" <<'REDIRECTS'
https://ycm69.cn/* https://ai.ycm69.cn/:splat 301!
http://ycm69.cn/* https://ai.ycm69.cn/:splat 301!
https://www.ycm69.cn/* https://ai.ycm69.cn/:splat 301!
http://www.ycm69.cn/* https://ai.ycm69.cn/:splat 301!
REDIRECTS
cat > "$release_dir/netlify.toml" <<'TOML'
[build]
  command = "test -f site/index.html && test -f site/release.json"
  publish = "site"
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
    Referrer-Policy = "no-referrer"
TOML
# Preserve release branch history. Never copy source, secrets or raw entries.
if git show-ref --verify --quiet refs/remotes/origin/netlify-production; then
  git worktree add --detach "$release_dir/git" origin/netlify-production
else
  git worktree add --detach "$release_dir/git" "$source_sha"
  git -C "$release_dir/git" switch --orphan netlify-production
fi
git -C "$release_dir/git" rm -rf --ignore-unmatch .
cp -R "$release_dir/site" "$release_dir/git/site"
cp "$release_dir/netlify.toml" "$release_dir/git/netlify.toml"
git -C "$release_dir/git" config user.name 'github-actions[bot]'
git -C "$release_dir/git" config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git -C "$release_dir/git" add site netlify.toml
git -C "$release_dir/git" commit -m "Publish encrypted report from $source_sha"
git -C "$release_dir/git" push origin HEAD:netlify-production
git worktree remove --force "$release_dir/git"
