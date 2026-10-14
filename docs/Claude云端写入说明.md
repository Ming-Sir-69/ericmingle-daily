# Claude 云端写入日报说明

日报内容继续由 Claude 云端任务生成。独立网页从私有仓库的结构化记录构建，阅读者无需打开 Claude。当前仓库为 [Ming-Sir-69/ericmingle-daily](https://github.com/Ming-Sir-69/ericmingle-daily)，本轮默认分支为 `master`；实际使用时以仓库当前默认分支为准。

## 需要的能力

Claude 云端需要读取模板与已有记录，并创建或修改 `entries/YYYY-MM-DD.json` 后提交到默认分支。生成任务不需要服务器登录权限、域名注册权限或日报访问密码。

Claude 的普通“从 GitHub 添加”功能用于读取和同步仓库资料；不能据此推定当前账号已具备提交能力。需在实际连接器中确认是否有创建或更新文件工具，并以一次真实写入及仓库提交为验收。[Claude GitHub 集成说明](https://support.claude.com/en/articles/10167454-use-the-github-integration)

现有定时任务由 Claude 侧维护；交接方说明为台北时间 8:55，当前尚未独立核验任务与写入权限。官方说明云端定时任务可使用已连接的工具，电脑无需保持开启；依赖本机文件或应用的任务仍需区别处理。[Claude 定时任务说明](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork)

## 写入约定

按台北日期创建当天记录，文件名与记录的 `date` 一致。参考 [已交付记录](../entries/2026-10-14.json) 保留以下结构：

| 字段 | 用途 |
| --- | --- |
| `date` | 当天日期，格式 YYYY-MM-DD |
| `template` | 当天使用的模板版本，读取 `templates/current`，当前为 v1 |
| `scene` | 星期画面层级、季节、天气、节日 |
| `headline`、`tags` | 开场白与简洁标签 |
| `acts` | 时段与安排描述 |
| `sections` | 系统状态、账号与订阅、AI 动态、研发视角；分组包含条目或无更新说明 |

事实条目保留来源、原始 HTTPS 链接和实际影响。没有可靠信息时写明当前无已核实更新，避免把示例内容或旧资料当当天新内容。历史日期保留原记录和模板版本；同一天的更正更新原记录，并在提交说明里写清原因。

## 验收

一次更新应同时满足：GitHub 中出现当天文件与真实提交，云端构建检查通过，正式网站出现对应日期，密码保护有效。本轮 GitHub 的 Node 22 构建和加密校验已真实通过，但网站托管尚未配置完成；目前提交不能写成已经自动发布。

正式域名与日本主机落定后，接通“提交记录 → 构建并加密 → 发布日本站点”的后半段，再让 Claude 侧实际执行一次写入，验证完整链路。
