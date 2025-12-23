# 客服管理平台业务说明

## 1. 角色与门户
- 用户端：终端用户（SSO 登录，提交/查询工单，发起会话，查看知识库）。
- 管理端：
  - Admin：组织配置、角色权限、队列/技能组、SLA、公告、监控/报表。
  - Agent：接待工单/会话、内部备注、协同转派、宏/模版回复、知识库维护。

## 2. 核心业务流程
- 工单生命周期：创建 → 分配（自动/手动） → 处理中 → 待用户 → 已解决/关闭；支持重开。
- 会话流程：用户入口（网页/嵌入） → 排队/分配 → 实时消息 → 评价/结束。
- 知识库：Admin/Agent 维护分类、标签、模版；用户端检索与引用。
- 通知：邮件/站内信/短信/Webhook；可配置触发（新工单、状态变更、评价）。
- 统计：实时看板（在线坐席、排队、SLA 命中），报表（按渠道/队列/坐席/标签）。

## 3. 典型用例
- 用户：提交工单（含附件）、查看状态、追加留言、发起会话、评价。
- Agent：领取/分配工单，应用宏回复，协同转派或升级，邀请同事，结束并总结。
- Admin：配置渠道与队列/技能组，管理 Agent，设置 SLA/工作时间，审核知识库，查看报表与审计。

## 4. Mermaid 工单流程
```
sequenceDiagram
  participant User
  participant UserApp
  participant Gateway
  participant TicketSvc
  participant Agent
  User->>UserApp: 创建工单
  UserApp->>Gateway: POST /tickets
  Gateway->>TicketSvc: 校验 & 创建
  TicketSvc-->>Gateway: TicketId
  Gateway-->>UserApp: 返回 TicketId
  TicketSvc-->>Agent: 分配/通知
  Agent->>TicketSvc: 更新状态/回复
  TicketSvc-->>UserApp: 状态/消息推送
  User->>UserApp: 追加信息/评价
```

