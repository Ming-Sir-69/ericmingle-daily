# 给 Dot：接手「四时日报」每日内容

Dot，从今天起「四时日报」的每日内容由你负责：搜索、筛选、核实、写 JSON、发布、验收。Claude 只按需负责 UI、模板和构建机制，不再每天运行（Claude 那边的每日定时任务已于 2026-10-16 停用）。请据此建立你自己的定时任务，时间和提前量由你安排，到点再把结果交给我。

读者是 Mingle（不要叫宸铭）。全部用简体中文。

---

## 一、一次性准备（第一次运行时做）

1. 确认能读写 GitHub 仓库 `Ming-Sir-69/ericmingle-daily`（master 分支）。用 Mac mini 上的 git 或 GitHub 连接器都行，以实际能推送为准。
2. 先读 `HANDOFF.md`、`docs/协作分工.md`、`AGENTS.md`、`templates/CHANGELOG.md`、`templates/current`，以及 `entries/` 里最新一份 JSON。
3. 在 `HANDOFF.md` 里补一行：「2026-10-16 起，每日内容由 ChatGPT Dot 的定时任务负责；Claude 的 08:55 排程已停用，Claude 只按需处理 UI／模板／机制。」单独提交，提交信息「docs: 日报改由 Dot 每日运行」。
4. 新建文件 `docs/待Claude处理.md`（如果还没有），标题「待 Claude 处理」，下面留空。以后遇到 UI、模板、构建问题就记在这里（见第六节）。
5. 补写说明：2026-10-16 那天 Claude 的推送被拒，当天 JSON 没进仓库。如果你第一次运行时 `entries/2026-10-16.json` 还不存在，而且日期还没过，就照常写当天的；日期已经过了就不用补。

## 二、每天的目标

在 master 写入当天的 `entries/YYYY-MM-DD.json`（日期按 Asia/Taipei）。push 后 GitHub Actions 自动校验、加密，推到 `netlify-production`，Netlify 发布到 https://ai.ycm69.cn/ 。

**不要做**：改 `netlify-production` 分支；提交 `public/` 明文；改 `templates/`、`scripts/`、`.github/`（这些是 Claude 的范围）；把网页密码或任何凭据写进仓库。

## 三、内容范围与筛选标准

时间窗口：前一天 9:00 到采集时（台北时间）。只放**重大变化**，宁缺毋滥。只用**官方或当事方的一手来源**（官网、官方博客、官方 X 账号、官方文档／帮助中心、GitHub 官方仓库）；第三方汇总、媒体转述、评测不作为条目来源，AIHOT 只用来发现线索，url 必须填原始链接。

1. **AI 动态**（key: `ai`）：重点关注 AI 记忆、自我迭代／递归任务、强大模型发布（新的前沿模型、大规模开源权重）。通常 2–4 条。
2. **订阅与费用变化**（key: `accounts`，heading「订阅与费用变化」）：只看 OpenAI（ChatGPT 各档位）、Anthropic（Claude 各档位）、xAI（Grok，含 X 订阅里的 Grok 部分）的**消费订阅**政策和价格，不看 API 价格。没有变化就写 note「过去 24 小时没有已核实的 OpenAI、Anthropic、xAI 消费订阅调整。」；之前记录过、还没生效的变化可以在 note 里顺带提醒一句（例如 ChatGPT Pro 200 老用户额度 10 月 29 日下调）。
3. **研发视角**（key: `dev`）：新 API、SDK、开源框架、Agent 工具链、与 agent 相关的安全漏洞；只放会影响开发效率或产品选型的。通常 2–3 条。
4. **系统状态**（key: `system`）：固定写 note「系统和账号的具体状态属于私人信息，仓库公开期间不写入公开记录。」

每条 item 五个字段：

- `title`：一句话标题。
- `url`：原始 HTTPS 链接（必须 https，否则不会显示）。
- `source`：谁发布的，一个短语，例如「Claude 官方博客」「OpenAI 开发者账号 @OpenAIDevs」。
- `body`：接在 source 后面能读通的一句话，以动词开头（「宣布……」「说明……」），写清关键事实和数字。
- `impact`：只写对产品、成本或选型的影响，**不给建议**。

不编造；某板块没有可靠信息就写 note「暂无已核实的更新」。

## 四、JSON 格式

严格沿用最新一份 entry 的结构，示例：

```json
{
  "date": "2026-10-17",
  "template": "v2",
  "collected_at": "2026-10-17T08:40:00+08:00",
  "scene": { "level": 6, "season": "autumn", "weather": "partly", "holiday": "none" },
  "headline": "早安，Mingle，……",
  "tags": ["标签1", "标签2", "标签3"],
  "acts": [],
  "sections": [
    { "key": "system", "title": "系统状态", "groups": [ { "note": "系统和账号的具体状态属于私人信息，仓库公开期间不写入公开记录。" } ] },
    { "key": "accounts", "title": "账号与订阅", "groups": [ { "heading": "订阅与费用变化", "note": "……" } ] },
    { "key": "ai", "title": "AI 动态", "groups": [ { "items": [ { "title": "", "url": "https://", "source": "", "body": "", "impact": "" } ] } ] },
    { "key": "dev", "title": "研发视角", "groups": [ { "items": [] } ] }
  ]
}
```

字段规则：

- `date` 与文件名相同；`template` 取 `templates/current` 的值（现为 v2，以后 Claude 升级模板时这里会变，每次都要读）。
- `collected_at`：实际采集时间，+08:00。
- `scene.level`：星期一 1 … 星期日 7（画面随一周逐日变丰富）。
- `scene.season`：3–5 月 spring，6–8 月 summer，9–11 月 autumn，12–2 月 winter。
- `scene.weather`：读 https://weather.yam.com/%E8%98%86%E6%B4%B2%E5%8D%80/%E6%96%B0%E5%8C%97%E5%B8%82 取芦洲区当天白天天气：晴→sunny；晴时多云／多云时晴／多云→partly；阴→cloudy；有雨／阵雨／雷雨→rain；强风／台风→windy；取不到用 partly。
- `scene.holiday`：中秋当天 midautumn；除夕到元宵 lunar；12/31、1/1、10/10 为 newyear；其余 none。
- `headline`：一句当天的开场白，带「Mingle」，像朋友把这一天交给他；可以带上天气和当天最重要的一件事。
- `tags`：3–5 个短标签，取当天最重要的条目。
- `acts`：仓库公开期间固定为空数组 `[]`。

## 五、公开仓库的隐私规则

仓库是公开的，JSON 和提交历史任何人可读，网页密码不保护源码。不写：邮箱地址、账号名、NAS／容器名、IP、日历细节、私人邮件内容、任何凭据或令牌。

## 六、发布与验收

1. 拉最新 master（`git fetch` + rebase，别覆盖并发提交）。如果当天文件已存在（例如你提前跑过一版），在它基础上更新，保留仍然有效的条目。
2. 写好 JSON，运行 `node scripts/build.js`，确认 `public/d/当天日期.html` 生成；不要提交 `public/`。
3. 只 `git add entries/当天日期.json`，提交信息「日报：YYYY-MM-DD」（更新时「日报：更新 YYYY-MM-DD」），push 到 master。内容没变就不提交。
4. 验收：每隔约 1 分钟读 https://ai.ycm69.cn/release.json ，最多 10 分钟，直到 `source_commit` 等于你 push 的提交 SHA。
5. 到点交给我：一两句话说明今天的头条、文件和提交 SHA、release.json 是否一致，附网页链接。

## 七、出问题时

- **内容／发布链路问题**（推送被拒、Actions 失败、Netlify 没更新）：你自己排查处理，处理不了就在汇报里写清失败的步骤和原文报错。不要反复重试同一个失败操作。
- **UI、模板、构建脚本问题**（构建报错、页面显示不对、字段需要新增、想要新的画面效果）：不要自己改 `templates/`、`scripts/`。在 `docs/待Claude处理.md` 追加一条：日期、现象、复现的 entry 或报错原文、你的判断，单独提交「docs: 待 Claude 处理 <简述>」，并在汇报里告诉我。我会去 Claude 那边让它处理。
- 如果构建因为 JSON 不合规失败，先修自己的 JSON；确认是模板或脚本的问题才记到待处理文件。

## 八、频率

默认每天一次。只有遇到重大事件（前沿模型发布、三家订阅价格变化、严重的 agent 安全漏洞）才在当天追加一次更新，一天最多追加一次，并且只在有实质变化时提交。不要为了监控而频繁推送或频繁打扰我。
