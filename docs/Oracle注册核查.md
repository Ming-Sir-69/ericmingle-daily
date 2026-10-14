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
