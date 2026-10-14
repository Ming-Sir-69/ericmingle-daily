# 四时日报

Claude 负责内容与 UI，铭哥直接打开 [日报网站](https://ai.ycm69.cn/) 阅读。源码与交接集中在本仓库，先运行云端工作流，再按需要迁入 Dot 或自有服务器。

**Claude 接手入口：[HANDOFF.md](HANDOFF.md)。**

## 当前发布流程

`Claude GitHub MCP 更新 master → GitHub Actions 校验、构建、加密 → netlify-production 分支 → Netlify 自动发布`。

- 源码仓库：<https://github.com/Ming-Sir-69/ericmingle-daily>，默认分支 `master`。
- 正式网站：<https://ai.ycm69.cn/>；备用域名：<https://ericmingle-daily.netlify.app/>。根域名及 www 经 HTTPS 跳到日报子域名。
- Netlify 项目：`ericmingle-daily`，ID `1076b86b-f4b0-4476-8375-f734039dcf10`，团队 `Ming_Sir_69`（125 邮箱账户），Free。
- `netlify-production` 由工作流管理，只含加密页面与发布配置。Claude 日常只改 `master`。
- 阅读密码在 GitHub 仓库 Secret `BRIEF_PASSWORD`，不在源码或交接提示词里。缺密码、弱密码、未加密页面会阻断发布。
- 仓库已按铭哥授权暂时公开。**公开仓库中的日报 JSON 和历史内容可直接阅读，网页密码不保护 GitHub 源码。** 后续只提交可公开内容，凭据、证件和私人邮件不得入库。

## 成本与边界

域名 `ycm69.cn` 已支付 ¥38／两年，到期 2028-10-14。没有购买服务器、付费 SSL 或 Netlify 升级。

公开仓库使用 `ubuntu-latest` 标准运行器，不计入私有仓库 Actions 免费分钟；没有使用大规格运行器或上传 Actions 构建附件。npm 缓存仍受 GitHub 的存储规则约束。[GitHub 官方计费说明](https://docs.github.com/en/billing/concepts/product-billing/github-actions)

Netlify 只接收已经加密的成品，最新基线部署耗时 7 秒；它自己的构建分钟、流量和存储额度仍然存在，公开 GitHub 不会取消这些限制。[Netlify 旧版 Free 额度](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-legacy-plans/legacy-pricing-plans/)

## 文件

| 路径 | 用途 |
| --- | --- |
| `entries/YYYY-MM-DD.json` | 当天结构化日报 |
| `templates/current`、`templates/v1/` | 模板版本及现有 UI |
| `templates/CHANGELOG.md` | UI 迭代记录 |
| `scripts/build.js` | 正式构建，只读真实 entries |
| `scripts/encrypt.sh` | StatiCrypt 3.5.4 加密，最低 20 字符密码 |
| `.github/workflows/publish-netlify.yml` | 主分支变更后自动构建与发布 |
| `scripts/publish-release.sh` | 只发布加密成品，拒绝旧主分支覆盖 |
| `entries-demo/` | 预览样例，正式构建不发布 |
| `HANDOFF.md` | 云端 MCP 接手续作与验收 |
| `docs/` | 本地接收、调研与上线证据 |

## 本地预览与检查

```bash
npm ci
npm run build  # public/，真实内容
npm run demo   # public-demo/，包含示例
npm run check  # 隔离构建、加密和精确解密，检查缺密码阻断
```

本地 `public/` 和 `public-demo/` 是明文预览目录，不上传 Netlify；`dist/` 是加密产物，忽略 Git。

## 更新与模板迭代

按 Asia/Taipei 日期创建或更新 `entries/当天日期.json`，文件名与 `date` 一致。首条 `2026-10-14` 是 Claude 原交付内容，其事实与新鲜度没有因本轮上线而重新获证。

UI 迭代可复制 `templates/v1` 为新版本并更新 `templates/current`；历史记录保留自己的 `template`，不覆盖历史样式。日报中心显示“最新一期”和实际日期，断更时不误标为今天。

现有 Claude 8:55 任务的真实运行与连接器权限，由 Claude 首次接手实测；本轮没有替它新建定时任务。未来迁移保留 JSON、模板、Git 历史与发布接口，当前不购日本服务器。

本机 Vortex 对新域名可能返回连接中断；网站中国直连有效，遇到此问题使用上述 Netlify 原生备用网址。网页阅读密码同一份。完整网络验证边界在 `docs/上线验证.json`。
