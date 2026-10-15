# 四时日报 Claude 入口

2026-10-15 最新分工：Claude 按需负责设计、UI、模板、代码改进及维护，不再默认执行每日内容采集。日常搜索、比较、监控与日报更新交给 GPT／Codex；详见 [协作分工](docs/协作分工.md)。平台沙箱限制与 GitHub App 授权分开判断，无法执行时保留报错与补丁，不反复索要授权。

先读 [HANDOFF.md](HANDOFF.md)、[AGENTS.md](AGENTS.md) 与 [README.md](README.md)。源码在 `master`。**当前 Claude 接手方没有 Codex 的 GitHub MCP 写文件工具，使用实际可用的 Git 编辑、提交和推送即可；不要等待或索要不存在的 MCP 工具。** GitHub Actions 加密后自动提交 `netlify-production`，Netlify 自动发布。

2026-10-15 已安装官方 `anthropics/claude` GitHub App，安装编号 `171455412`，个人账号 `Ming-Sir-69` 的仓库范围为 **All repositories**，覆盖该账号现有和未来仓库，Claude GitHub 整合已完成连接。代码与工作流等读写权限已由 GitHub 安装页核对；当前 `master` 未保护且没有仓库 ruleset。详情见 [授权核查](docs/Claude-GitHub授权核查.md)。随后实际观察到带 Claude-Session 来源的日报提交 `13683ee` 进入 master，Actions `38609582323` 成功，线上 release.json 指向同一源码 SHA，生成三页。这个结果来自接手方提交，不把 Codex 的普通 Git 推送当成 Claude 云端认证验证。

当前仓库按本人授权暂时公开，只提交可公开内容，源码 JSON 不受网页密码保护。不要写入凭据、完整身份信息、私人邮件、卡片数据或访问密码。不要改 Netlify 生产分支为 master，不直接编辑自动生成的 netlify-production，也不上传 public/ 明文。

保留 Claude 原 UI 与模板版本。修改前读取远端最新状态，保留当前会话未提交成果；Git 快进或合并后推送 `master`，若实际会话仍拒绝已有分支则保留成果、推送允许的分支并通过 PR 正常合并，按 GitHub 的实际规则处理，不绕过平台限制。不要覆盖并发提交。后续核对线上 release.json 的 source_commit 与进入 master 的提交 SHA 一致。

未来再迁移 Dot／自有服务器。不要新建 Claude 每日排程。旧任务的实际删除状态未确认，不冒报完成；Claude 网页只由铭哥本人操作。
