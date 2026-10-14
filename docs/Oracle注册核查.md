# Oracle Cloud 注册核查

核查时间：2026 年 10 月 14 日，台北时间。目的：等待腾讯云域名实名审核期间，使用真实中国大陆资料尝试 Oracle Cloud 免费账户，优先东京主区域；没有购买日本服务器或升级付费账户。

## 当前结论

当前默认注册流程支持中国大陆账单地址、`+86` 手机号；未发现必须使用境外发行信用卡或海外 IP 的官方要求。中国发行的实体国际信用卡可以尝试，具体银行卡授权、短信送达和 Oracle 最终风控是否通过仍需实测。铭哥本轮确认准备使用招行实体 Visa／银联卡，优先使用 Visa。官方不接受虚拟卡、一次性卡和预付卡；小额验证预授权通常由银行在三到五天内解冻，不代表免费账户已升级付费。[官方 FAQ](https://www.oracle.com/cloud/free/faq/)、[官方注册说明](https://docs.oracle.com/en-us/iaas/Content/GSG/Tasks/signingup_topic-Sign_Up_for_Free_Oracle_Cloud_Promotion.htm)

官方当前注册前端包含中国大陆 `CN` 地址配置，要求省、市和六位邮编；电话控件包含 China／`cn`／`86`。注册页当前公开地区 API 返回东京 `ap-tokyo-1` 和大阪 `ap-osaka-1`。这是前端支持与当前列表，不是开户或免费虚拟机库存保证。主区域创建后不能更改，Always Free 计算资源只能在主区域创建。[官方前端资源](https://signup.oraclecloud.com/static/js/main.4587fbc1.chunk.js)、[官方手机号资源](https://signup.oraclecloud.com/static/js/2.46935586.chunk.js)、[官方地区 API](https://signup-api.oraclecloud.com/20200828/region?clientId=SignupUI&oracleEmployee=false)、[Free Tier 文档](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm)

## 旧记录及政策差异

Engram `rec_f6efcad2b69f4cc49016` 记录 10 月 12 日开户被拒；后继 `rec_f61af72bf1b542e192b1` 明确所用为虚拟卡。原“地点不一致为主要原因”已被纠正。虚拟卡符合官方不支持的类别，但 Oracle 没有确认拒绝的唯一原因，不能说更换实体卡必然成功。此前 Oracle 官网账户不等于 Cloud 账户，尚无成功 Cloud 开户证据。

Non-UCM 服务描述版本 `071626` 第 256–257 页对促销 `B86731`、`B87848` 有信用卡国家限制。当前默认注册前端使用 `B88385`，同意文字为 Free Oracle Cloud Promotion Universal Credits；其对应 UCM 服务描述版本 `100826` 第 313–315 页没有上述中国信用卡限制。不能用旧 Non-UCM 促销规则认定当前默认注册禁止中国发行卡。进入最终确认页时，应以实际促销编号和关联合同为准。[Non-UCM 描述](https://www.oracle.com/contracts/docs/paas-iaas-public-cloud-2140609.pdf)、[UCM 描述](https://www.oracle.com/contracts/docs/paas_iaas_universal_credits_3940775.pdf)

## 独立浏览器准备

已启动独立 Brave 进程，使用全新用户数据目录、禁用扩展，并仅为该进程指定 `--no-proxy-server`。没有复制原 Brave 的登录态、历史、扩展或卡片，没有修改系统代理或其他服务。官方 Chromium 文档确认该参数覆盖系统代理设置。[网络参数说明](https://www.chromium.org/developers/design-documents/network-settings/)

独立浏览器内实际打开 Cloudflare trace 和 ipwho.is，两处均返回中国大陆 `CN`。本机直连 Oracle 注册入口返回 HTTP 200。上述结果证明当时所测出口地区及入口可达；不能证明 IP 在 Oracle 风控中的信誉，也不能代替注册全流程验收。

浏览器运行目录位于 `~/Library/Application Support/BraveSoftware/OracleCloud-CN-20261014`，作为应用运行数据，不加入项目仓库。开户结果、主区域、免费资源容量尚未确认。

## 当前地址表单规则与分工

铭哥已在独立浏览器亲自完成邮箱、人机验证及密码步骤，选定东京主区域，进入地址页。城市填写汉字时报错；当前官方前端城市规则为 `/^[a-zA-Z\xc0-\xff\s'-]{1,25}$/`，真实城市填 `Ningbo` 后错误消失，“继续”按钮可用。Province 接受 1–60 个字符，地址行接受 1–240 个字符，当前中国配置没有统一要求这些字段使用英文；真实中文省份和地址可保留。中国邮编应填写真实六位数字，手机选择 `+86` 并使用真实十一位手机号。格式校验通过不表示银行卡匹配或开户成功。

铭哥随后明确要求本阶段“我来填写，你来查看和指挥”；从此由本人操作表单与按钮，主 Agent 只查看和指导，不再调用子 Agent。此分工仅记录当前 Oracle 注册阶段，不扩为其他任务的全局规则。

## 10 月 14 日实际开户结果

本人继续使用中国真实资料、独立中国直连 Brave 和招行实体 Visa 完成申请。页面显示银行卡验证绿色勾，随后仍报“创建您的账户时出错／无法完成您的注册”，列出的通用原因包括资料不准确、遮挡地点或身份，以及尝试创建多个账户。账户没有创建成功，未获得 Cloud 租户或日本实例。

本次最终协议页面已实际显示促销编号 `B88385`，与此前核对的 UCM 服务描述一致。新结果说明符合公开可申请条件、前端格式通过和银行卡验证绿色勾，并不足以保证最终开户；不能再把“更换实体卡”当作确定能解决问题的方案。Oracle 未给出此次拒绝的具体原因，不将其认定为中国地区禁用、卡片问题或历史尝试被拦截。

已由本人完成注册申诉，工单 `261014-000648` 已正式进入 Oracle Help 处理队列。账户和日本实例仍未开通。腾讯云域名信息模板已实名审核成功，域名尚未付款。

## 申诉交接与确认邮件

2026 年 10 月 14 日 21:47:43（台北时间），注册邮箱收到 Oracle Customer Service 的确认邮件，主题为 `[Incident: 261014-000648] Oracle Cloud Free Tier Account Creation`，已实际读取正文。邮件明确请求收到并排队；后续跟进及补充信息直接回复原邮件，不修改原邮件内容，避免重复请求。

最终网页摘要核对为 `Chenming Yang`、注册邮箱正确、`Other accounts: no`、公司 `Not applicable`。第一次草稿误选 Q5 为 Yes，已在提交授权时选择 No 取消，未建立工单；第二次重填 Q5 为 No 后才提交。本人确认旧账号仅用于官网／学习考证，显示名 `Eric Mingle`；该账号和 MFA 设置不能证明存在 OCI 免费租户。

确认邮件的客户栏显示 `UnknownFirstName UnknownLastName`，问题描述只有一行泛化说明。网页姓名摘要正确不代表后台姓名字段或完整技术经过已传入。后继应优先在原邮件线程核查／补充注册姓名、完整错误经过和旧学习账号的澄清，不将邮件模板字段异常直接当作拒绝原因。

已复查客服页面末尾：只有提交成功和队列确认，没有其他必填动作。用户不需要继续停留，可退出无痕窗口；后续以工单邮件为准，无痕聊天历史可能无法恢复。

## 后续入口和环境边界

- **开户专用支持入口**：[Oracle Customer Service](https://store-oracle.custhelp.com/app/CP_CP)。本轮实测成功路径为 Edge Dev InPrivate → `Chat with Customer Service` → 开户机器人，地址保持 `CP_CP#` → `create ticket` → 按真实情况回答并提交。已有本工单后，不再次输入 `create ticket` 建第二张票。
- **日常跟进**：回复工单原确认邮件；若必须回客服网页，提供已有编号，询问状态／补充渠道。机器人查询已有工单的能力尚未实测。
- **注册重试**：[Oracle Cloud Signup](https://signup.cloud.oracle.com/)。收到明确处理或重试指示后再使用同一真实身份和注册邮箱；新申请用新的验证邮件，旧链接有时效。不得把工单已受理当作注册已获批。
- **Brave 中的失败**：按钮曾跳至 `/euf/generated/optimized/1790640959/themes/standard/`，该目录中国直连返回 403，而客服介绍页返回 200。旧 `/app/chat/chat_launch` 直接访问也返回 200，但因来源条件未满足，`Start chat` 保持灰色。HTTP 200 不等于聊天可用，不作为后继首选入口。
- **实际可用环境**：Edge Dev 无痕打开同一开户页并成功提交。本轮未隔离 Brave 脚本／隐私策略与 Edge 网络路线差异；不能认定唯一原因是中国 IP、网络或网站整体故障。Brave 出口 CN 已实测，Edge 出口未测，不混用结论。
- **一般 Cloud 支持入口**：Oracle 官网联系页的 `Get Support → Cloud Infrastructure including Free Trial → Cloud Support Chat` 可连接人工 Liliana，但她将开户问题转回 Oracle Help 的专用入口；不应将此一般技术支持流程作为后继建单入口。

铭哥要求由 Dot 跟进，不创建定时任务／自动化，也未向 Dot 发送消息。完整交接和旧记录更正已存 Engram `rec_1c724185ef7848fb9b02`，取代 `rec_aed6e4b612c0436a9ba8` 的旧状态。重点是查同一工单邮件、补充真实信息、按 Oracle 回复决定是否重试；不自动购买日本服务器或升级付费，不共享完整卡号、CVV、密码、MFA 或证件。

网友案例只作为经验：2020／2021 有客服处理后按指示用同一邮箱注册成功的亲历，2026 也有同类工单等待十天未回复的案例。无可信高通过率或统一时间保证；客服所说 48 个工作小时是处理预期，正式确认邮件仅说明排队。
