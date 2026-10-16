# 四时日报协作交接

更新时间：2026-10-15，Asia/Taipei。GPT／Codex 负责每日搜索、比较、监控与日报内容；Claude 按需负责设计、UI、模板、代码改进和维护，不再默认每天运行。Codex 已完成域名、托管、GitHub 自动发布和基本验收。先阅读本文与 [协作分工](docs/协作分工.md)、CLAUDE.md、AGENTS.md、README.md，再开展真实更新。

## 访问与权限

- GitHub：https://github.com/Ming-Sir-69/ericmingle-daily
- 源码默认分支：`master`。仓库暂时公开，普通读取可直接访问 raw 文件；Claude 使用现有 Git 能力提交和推送，GitHub MCP 写文件不是必要条件。
- 网站：https://ai.ycm69.cn/
- 备用：https://ericmingle-daily.netlify.app/ （本机 Vortex 路径访问新域名失败时可用，同一网站与密码）
- Netlify 项目：https://app.netlify.com/projects/ericmingle-daily
- Netlify Site ID：`1076b86b-f4b0-4476-8375-f734039dcf10`
- Netlify 团队：`Ming_Sir_69`，`682c749d8f1bff5ce43fa6bb`，Free；连接器选择 **Ming_Sir「125邮箱」**，不是另一个 Eric 邮箱账户。
- 生产分支：`netlify-production`，自动发布已开启。产物分支内配置发布目录 `site/`，只验证成品存在，不重新安装 StatiCrypt 或生成日报。
- 阅读密码存于 GitHub 仓库 Secret `BRIEF_PASSWORD`。Claude 生成日报、修改模板和查部署均不需要它；不要要求铭哥把密码发到源码或提示词里。

域名已支付 ¥38／两年，2028-10-14 到期。当前使用 Netlify CDN，没有购买日本服务器。根域名与 www 作为同一站点的入口，配置及终态检查见 docs/上线验证.json。

## 日常更新

1. 用当前会话已有的 Git checkout 读取 `master` 的 `templates/current`、最近一份 `entries/YYYY-MM-DD.json` 与需要的模板；先核对 origin 确为 `Ming-Sir-69/ericmingle-daily`，同步最新远端并保留本会话成果。
2. 按 Asia/Taipei 实际日期生成当天 JSON。文件名与 `date` 必须相同，`template` 使用实际模板版本。
3. 只提交可公开内容。保留可靠来源、原始 HTTPS 链接、采集时间与对铭哥的影响；信息缺失写无已核实更新，不编造账号／NAS 状态或把旧信息当今天新闻。
4. 使用 Git 编辑文件、校验、提交并推送 `master`；不要等待不存在的 Codex GitHub MCP create_file／update_file。当前 master 未保护且无仓库 ruleset。若实际会话对已有分支另有限制，保留成果，推送允许的分支并创建 PR 正常合并至 master；发布以进入 master 为触发。先读取远端最新 SHA，避免覆盖并发修改，不手工改 `netlify-production`。若某个宿主确有 GitHub MCP 写入工具，也可采用 contents API，更新前核对 blob SHA。
5. GitHub Actions「发布加密日报到 Netlify」自动校验、构建、加密；随后推送成品分支，Netlify 自动发布。不需要手机本地 Node、域名后台、SSH、服务器或 Netlify 部署令牌。
6. 查询本次 Actions 和 Netlify 实际 deploy：`state=ready`、`published_at` 非空、branch 为 `netlify-production`。再读 https://ai.ycm69.cn/release.json，`source_commit` 必须与刚才的 master 提交 SHA 一致。
7. 核对正式页面存在对应日期、内容来源正确、密码入口仍有效，再报告完成。Netlify 项目概览的 enriched “current” 文本不能单独作为成功依据。

2026-10-14，Codex 的 GitHub MCP 创建本 HANDOFF.md，提交 `adc8a6e` 触发 Actions `38587289823` 成功并自动发布。这只证明 Codex 连接器和后端发布链路，不证明 Claude 有同一写文件工具。2026-10-15 本人反馈 Claude 只能用 Git，推送提示缺少 Claude GitHub App：现已安装官方 App，`Ming-Sir-69` 范围 All repositories（含未来仓库），安装编号 `171455412`；完成回调后 Claude GitHub 整合显示已连接。授权配置已核验；随后真实观察到作者为 Claude、带 Claude-Session 来源的提交 `13683ee` 新增 `entries/2026-10-15.json` 并进入 master。Actions `38609582323` 成功，线上 release.json 的 source_commit 与该完整 SHA 一致、encrypted_pages=3，接手方的写入与发布已取得实际结果。不要把普通“从 GitHub 添加资料”的只读集成误认为提交工具。详见 docs/Claude-GitHub授权核查.md。

## 已有输入结构和 UI

参考 `entries/2026-10-14.json`：`date`、`template`、`scene`、`headline`、`tags`、`acts`、`sections`。sections 包含 system、accounts、ai、dev；groups 中为 heading、items 或 note，items 保留 title、body、source、url、impact。

`templates/current=v2`，保留 Claude 已做好的风景、插画和日报中心。2026-10-15 的 v2 增加昼夜切换、日月转轮与相关插画；当天条目已使用 v2。模板迭代创建新版本并更新 CHANGELOG；历史条目继续按各自 template 显示。正式构建只用 entries；entries-demo 不发布。2026-10-14 是原交付内容，其新闻与状态新鲜度须由内容链路核实，部署验收不代表这些事实已获证。

## 公开、额度与安全

本人允许当前阶段暂时公开仓库，以免占私有仓库 Actions 分钟。使用标准 ubuntu-latest，未开大型运行器、付费套餐或 Actions 构建附件上传。Netlify 自己的免费分钟／流量限制仍存在；它只接收成品，基线一次部署 7 秒。

**公开 GitHub 的原始日报 JSON 和提交历史可阅读；网页加密不保护源码。** 不提交证件、银行卡、私人邮件、访问密码或任何令牌。不要将项目切成私有后仍声称 Actions 不计私人分钟。

加密密码至少 20 字符；脚本发现缺密码或未加密成品即失败，不允许“先临时上传 public/”。本网站开发不修改付费计划、不购买主机、不另行扩展账号权限。当前 Claude App 的 All repositories 是铭哥 2026-10-15 本人明确授权的既有范围。网站没有发布原始 JSON、源码或交接文档，所有开发交接在本 GitHub。

## 定时与后续迁移

2026-10-15 已观察到台北时间每日 08:55 的「晨间简报」旧排程，但其对话类型运行会话没有附加日报仓库，实际推送报 403。GitHub App 的 All repositories 已配置，仍需任务本身附加仓库。普通 Claude Code 会话此前已成功推送；不能由此推导旧排程也能写入。

当时新建任务界面的「高级 → General → Repository」可选日报仓库，曾准备新任务草稿，**尚未提交创建或迁移，原排程也未停用**。最新分工取消让 Claude 每天运行的方向，不再推进该迁移。Claude 网页仅由铭哥本人打开与操作；代理不再读取或修改其对话、连接器、排程，也不通过替代接口操作。本次本人明确要求删除 GitHub 权限测试分支，两个测试分支已清理；不涉及 Claude 排程。GPT 日常运行的实际排程尚未配置，不要把职责调整当成已生效的自动执行。现场依据与本次 v2 补丁发布记录见 docs/Claude-GitHub授权核查.md。

未来迁入 Dot／自有服务器时保留 JSON、模板版本、来源和 Git；可复用既有 v2 采集与去重能力，迁移前检查实际运行与接口。Oracle 申诉交给 Dot 另行跟进，当前没有日本实例，不把网页可用写成日本主机已开通。

## 排错入口

- GitHub Actions：https://github.com/Ming-Sir-69/ericmingle-daily/actions
- Netlify 部署：https://app.netlify.com/projects/ericmingle-daily/deploys
- 最新生产来源：https://ai.ycm69.cn/release.json
- 域名与 HTTPS：https://app.netlify.com/projects/ericmingle-daily/domain-management
- 验收文件：docs/上线验证.json

某次失败不会替换此前成功生产部署。先根据具体失败阶段修复；不要反复开新的项目或域名模板。Netlify 环境变量 MCP 曾回报成功但读回为空，最终发布不依赖该接口；必要时以实际部署日志为准。

域名、托管、发布与 GitHub App 授权已完成配置；已观察到 Claude 的 2026-10-15 日报 Git 提交与发布。后续内容采集事实、定时任务执行与下一轮更新仍按真实结果验收。

本机网络说明：2026-10-14，Vortex 的 127.0.0.1:7897 代理对新 ycm69.cn 域名出现 ERR_CONNECTION_CLOSED；中国直连与 Netlify 原生备用网址均正常。只追加过三个日报域名的系统绕过项，临时使主站可打开，但 Vortex helper 重启后覆盖了该设置；没有关闭全局代理，也没有后台循环改写网络设置。云端自动发布不依赖本机代理，阅读遇到此问题使用备用网址。

已真实核验两个线上加密页面可精确解密、错误密码拒绝、记住 30 天、四个板块与返回日报中心链接、原始 entries／HANDOFF.md 不作为网站文件发布（404）。公开 GitHub 中的源码和本文件仍可正常读取。

## 2026-10-16 交接更新

2026-10-16 起，每日内容由 ChatGPT Dot 的定时任务负责；Claude 的 08:55 排程已停用，Claude 只按需处理 UI／模板／机制。

Claude 在 2026-10-16 的日报推送遇到会话仓库授权 403，`entries/2026-10-16.json` 未进入 master；当日仍在台北日期内，由 Dot 按最新规则执行生成与发布。详见 `docs/Dot每日任务.md`。
