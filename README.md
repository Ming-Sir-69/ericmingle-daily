# 四时日报

Mingle 的每日晨间简报。模板、每天的记录和网站都在这个仓库里，推送后 Netlify 自动部署，打开网址要输入密码。

## 目录

| 路径 | 内容 |
| --- | --- |
| `entries/YYYY-MM-DD.json` | 每天一份结构化记录：画面参数（星期、季节、天气、节日）、开场白、标签、各板块条目 |
| `templates/v1/` | 第一版模板：`brief.html` 是当天页面，`hub.html` 是日报中心，`partials/` 是板块小插画和分隔装饰 |
| `templates/current` | 新日报使用的模板版本 |
| `templates/CHANGELOG.md` | 模板改动记录和待优化事项 |
| `scripts/build.js` | 把记录和模板生成网站（无依赖） |
| `scripts/encrypt.sh` | 用 StatiCrypt 给每个页面加密码；没设密码就拒绝发布 |
| `entries-demo/` | 示例数据，只在 `--demo` 预览时使用，不会发布 |

## 日报中心怎么排

借鉴微信「状态」和朋友圈「只展示最近几天」的做法，近的看得全，远的只留一眼：

- **今天**：大幅风景、开场白、标签，一键打开完整简报。
- **这一周**：每天一行，点开能看到全部条目和影响。
- **更早**：缩成状态卡，只有当天的风景、开场白和两个标签。

## 本地预览

```bash
node scripts/build.js          # 真实记录 → public/
node scripts/build.js --demo   # 加上示例数据 → public-demo/
```

直接用浏览器打开 `public/index.html`。

## 第一次部署（全免费）

1. 在 [netlify.com](https://www.netlify.com) 用 GitHub 账号登录。
2. **Add new site → Import an existing project → GitHub**，选这个仓库。构建设置会从 `netlify.toml` 自动读取，不用改。
3. **Site configuration → Environment variables** 新增 `BRIEF_PASSWORD`，填你想用的密码。密码只存在 Netlify，不进仓库。
4. **Site configuration → Change site name** 改成 `ai-ericmingle69`，网址就是 `https://ai-ericmingle69.netlify.app`。
5. **Deploys → Trigger deploy**。打开网址，输入密码就能看到日报中心；勾选「记住 30 天」后，这台设备一个月内不用再输。

以后想换自己的域名，在 **Domain management** 里加上即可，不影响其他设置。

## 每天怎么更新

定时任务每天早上写一份 `entries/当天日期.json` 并提交，Netlify 收到推送后自动重建网站。

## 模板迭代与回退

- 改模板：复制 `templates/v1` 为 `templates/v2`，在 v2 里改，把 `templates/current` 改成 `v2`，在 `CHANGELOG.md` 记一笔。
- 回退：把 `templates/current` 改回 `v1`。
- 旧日子按自己记录里的版本显示，不会被新模板改掉。
