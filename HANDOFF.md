# Claude 接手四时日报

更新时间：2026-10-14，Asia/Taipei。内容和 UI 由 Claude 继续维护；Codex 已完成域名、托管、GitHub 自动发布和基本验收。先阅读本文与 CLAUDE.md、AGENTS.md、README.md，再开展真实更新。

## 访问与权限

- GitHub：https://github.com/Ming-Sir-69/ericmingle-daily
- 源码默认分支：`master`。仓库暂时公开，普通读取可直接访问 raw 文件；写入仍通过本人已连接的 GitHub MCP。
- 网站：https://ai.ycm69.cn/
- Netlify 项目：https://app.netlify.com/projects/ericmingle-daily
- Netlify Site ID：`1076b86b-f4b0-4476-8375-f734039dcf10`
- Netlify 团队：`Ming_Sir_69`，`682c749d8f1bff5ce43fa6bb`，Free；连接器选择 **Ming_Sir「125邮箱」**，不是另一个 Eric 邮箱账户。
- 生产分支：`netlify-production`，自动发布已开启。产物分支内配置发布目录 `site/`，只验证成品存在，不重新安装 StatiCrypt 或生成日报。
- 阅读密码存于 GitHub 仓库 Secret `BRIEF_PASSWORD`。Claude 生成日报、修改模板和查部署均不需要它；不要要求铭哥把密码发到源码或提示词里。

域名已支付 ¥38／两年，2028-10-14 到期。当前使用 Netlify CDN，没有购买日本服务器。根域名与 www 作为同一站点的入口，配置及终态检查见 docs/上线验证.json。

## 日常更新

1. 用 GitHub MCP 读取 `master` 的 `templates/current`、最近一份 `entries/YYYY-MM-DD.json` 与需要的模板。
2. 按 Asia/Taipei 实际日期生成当天 JSON。文件名与 `date` 必须相同，`template` 使用实际模板版本。
3. 只提交可公开内容。保留可靠来源、原始 HTTPS 链接、采集时间与对铭哥的影响；信息缺失写无已核实更新，不编造账号／NAS 状态或把旧信息当今天新闻。
4. 用 GitHub MCP 创建新文件；更正已有文件时先读取当前 blob SHA，再 update，避免覆盖并发修改。可用批量提交工具一次提交关联变更。只写 `master`，不手工改 `netlify-production`。
5. GitHub Actions「发布加密日报到 Netlify」自动校验、构建、加密；随后推送成品分支，Netlify 自动发布。不需要手机本地 Node、域名后台、SSH、服务器或 Netlify 部署令牌。
6. 查询本次 Actions 和 Netlify 实际 deploy：`state=ready`、`published_at` 非空、branch 为 `netlify-production`。再读 https://ai.ycm69.cn/release.json，`source_commit` 必须与刚才的 master 提交 SHA 一致。
7. 核对正式页面存在对应日期、内容来源正确、密码入口仍有效，再报告完成。Netlify 项目概览的 enriched “current” 文本不能单独作为成功依据。

本宿主 GitHub MCP 有 create_file／update_file 等写入工具；Claude 需在自己的工具清单核对对应能力。不要把“从 GitHub 添加资料”的只读集成误认为可提交。首次接手实际执行一次写入并核对线上 release，未执行前不要宣称 Claude 端已经完整跑通。

## 已有输入结构和 UI

参考 `entries/2026-10-14.json`：`date`、`template`、`scene`、`headline`、`tags`、`acts`、`sections`。sections 包含 system、accounts、ai、dev；groups 中为 heading、items 或 note，items 保留 title、body、source、url、impact。

`templates/current=v1`，保留 Claude 已做好的风景、插画和日报中心。模板迭代创建新版本并更新 CHANGELOG；历史条目继续按各自 template 显示。正式构建只用 entries；entries-demo 不发布。2026-10-14 是原交付内容，其新闻与状态新鲜度须由内容链路核实，部署验收不代表这些事实已获证。

## 公开、额度与安全

本人允许当前阶段暂时公开仓库，以免占私有仓库 Actions 分钟。使用标准 ubuntu-latest，未开大型运行器、付费套餐或 Actions 构建附件上传。Netlify 自己的免费分钟／流量限制仍存在；它只接收成品，基线一次部署 7 秒。

**公开 GitHub 的原始日报 JSON 和提交历史可阅读；网页加密不保护源码。** 不提交证件、银行卡、私人邮件、访问密码或任何令牌。不要将项目切成私有后仍声称 Actions 不计私人分钟。

加密密码至少 20 字符；脚本发现缺密码或未加密成品即失败，不允许“先临时上传 public/”。不修改付费计划、不购买主机、不扩展账号权限。网站没有发布原始 JSON、源码或交接文档，所有开发交接在本 GitHub。

## 定时与后续迁移

此前交接声称 Claude 已有台北时间 8:55 任务；本轮未验证其真实状态，也没有新建或重复创建任务。接手后读取已有任务，确认云端工具确有写入权限，并做一次真实执行。手机不必保持开机，但平台连接器是否允许后台执行要按当时实际产品能力核对。

未来迁入 Dot／自有服务器时保留 JSON、模板版本、来源和 Git；可复用既有 v2 采集与去重能力，迁移前检查实际运行与接口。Oracle 申诉交给 Dot 另行跟进，当前没有日本实例，不把网页可用写成日本主机已开通。

## 排错入口

- GitHub Actions：https://github.com/Ming-Sir-69/ericmingle-daily/actions
- Netlify 部署：https://app.netlify.com/projects/ericmingle-daily/deploys
- 最新生产来源：https://ai.ycm69.cn/release.json
- 域名与 HTTPS：https://app.netlify.com/projects/ericmingle-daily/domain-management
- 验收文件：docs/上线验证.json

某次失败不会替换此前成功生产部署。先根据具体失败阶段修复；不要反复开新的项目或域名模板。Netlify 环境变量 MCP 曾回报成功但读回为空，最终发布不依赖该接口；必要时以实际部署日志为准。

入口准备已完成；Claude 首次真实采集、写入、任务验证属于接手后的工作。
