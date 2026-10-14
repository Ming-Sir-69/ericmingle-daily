# Claude GitHub 授权核查

核查日：2026-10-15，Asia/Taipei。

- 用户授权：将 Claude 对其个人账号名下所有现有及未来仓库的访问开到 App 支持的范围。
- 原状态：Ming-Sir-69 的 Installed GitHub Apps 中没有 Claude，不仅是日报仓库遗漏。
- 已安装：官方 `Claude`，开发者 `anthropics`，App https://github.com/apps/claude 。
- 安装编号：171455412。安装详情 https://github.com/settings/installations/171455412 。
- 所属账号：Ming-Sir-69；显示名 Eric_Mingle_69。不是登录名 Eric-Mingle-69 的另一个账号。
- 保存后读回：All repositories 单选项已选中，Only select repositories 未选；页面明确覆盖 owner 名下全部现有及未来仓库。
- 权限：代码、Actions、checks、discussions、issues、PR、repository hooks、workflows 读写；administration、commit statuses、merge queues、metadata 只读。未改其他 App 或仓库保护设置。
- Claude 侧：安装回调中已点完成连接 GitHub，随后连接器页面显示 GitHub 整合已连接。
- 日报仓库：Ming-Sir-69/ericmingle-daily，ID 1418689314，master 未保护，没有仓库 ruleset。

本次只配置权限。按本人要求，不替 Claude 启动云端任务、不发送新消息；现场随后观察到接手方已完成推送，见下方实际结果。All repositories 是账号级仓库覆盖，不是给云端读取本机全部目录或自动推送未创建的本地项目。Cloud session 的请求范围仍取决于附加的仓库。

这纠正了旧交接的工具假设：Codex 已实测的 GitHub MCP create_file 不是 Claude 必须具备的工具；Claude 使用实际可用的 Git 编辑、提交、推送即可。进入 master 后既有 Actions 和 Netlify 自动发布。

依据：GitHub 官方 App 安装与保存后详情、Claude 连接器页面；[官方连接说明](https://code.claude.com/docs/en/claude-code-on-the-web#github-authentication-options)、[GitHub proxy 范围与限制](https://code.claude.com/docs/en/cloud-environments#github-proxy)。不保存 OAuth code、令牌、密钥或本人认证内容。

## 接手方的实际推送与发布结果

在权限配置期间，远端出现新提交 `13683ee5a296a161afe00be15615616eeaab7ef9`，作者／提交者为 Claude，提交说明带 Claude-Session 来源，新增 `entries/2026-10-15.json`；不是本机 Codex 写入的日报。

GitHub Actions `38609582323` 成功，真实 https://ai.ycm69.cn/release.json 返回同一 source_commit，encrypted_pages=3。本机隔离构建校验也通过三页加密与精确解密、缺密码阻断。Codex 的交接文档与这份新日报采用正常 merge 保留，并发更新没有被强制覆盖。

这个结果证明接手方提交已进入仓库并自动发布；后续所有其他仓库的实际推送仍受各仓库规则与云端会话附加范围约束，不能把 All repositories 配置推导为逐仓推送都已实测。
