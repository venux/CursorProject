# 客服管理平台技术架构

## 1. 总览
- 前台：Vue 3 + Vite 5 + TypeScript 5.4 + `<script setup>` + SCSS + Element Plus 2.7；状态管理 Pinia；路由 Vue Router 4；国际化 i18n。
- 后端：Node.js 20 LTS + NestJS 10（Express 适配器）；TypeScript；模块化设计。
- 身份认证：Keycloak（OIDC/SSO），用户端授权码流；管理端复用 SSO。
- 数据层：MongoDB 7（Replica Set），Redis 7（会话/缓存/限流），对象存储（S3 兼容）用于附件。
- 通信：HTTP/REST + WebSocket（坐席状态/聊天）；内部事件总线（Kafka/RabbitMQ 可选）解耦通知、审计、统计。
- 部署：Docker + K8s/Helm，CI/CD（GitHub Actions/GitLab CI）；API 网关/Ingress；灰度与观测（Prometheus/Grafana，OpenTelemetry）。

## 2. 前台架构
- 子应用拆分：
  - 管理端（Admin/Agent）：RBAC，工作台、工单、知识库、监控。
  - 用户端：提交工单、会话入口、工单查询；统一 SSO（Keycloak）。
- 关键模块：路由守卫（角色/权限）、全局状态（用户信息、Token、会话队列）、API SDK（Axios 拦截器自动刷新 Token）、UI 主题（暗/亮）、错误与埋点上报。
- 兼容性：ES2022+，现代浏览器；PWA 可选。

## 3. 后端架构
- NestJS 模块划分：
  - `AuthModule`：Keycloak OIDC、Token 校验、角色映射（Admin/Agent/User）。
  - `UserModule`：账户、资料、偏好。
  - `TicketModule`：工单生命周期、分派、状态流转、SLA。
  - `ChatModule`：会话、消息、WebSocket 推送、在线状态。
  - `KnowledgeModule`：FAQ/文档/标签，全文检索可选接入 OpenSearch/Atlas Search。
  - `ReportingModule`：看板/统计，异步聚合。
  - `NotificationModule`：站内信/邮件/短信/Webhook。
  - `AuditModule`：审计日志。
- 技术要点：OpenAPI 3 生成 SDK；全局异常/日志；配置中心；速率限制与防刷（Redis）；任务队列（BullMQ）处理异步；文件上传走直传（S3 预签名）。

## 4. 数据与模型
- 集合：`users`、`tickets`、`messages`、`sessions`、`knowledge_articles`、`audit_logs`、`notifications`、`attachments`。
- 索引示例：`tickets` 上 `userId + status + updatedAt`；`messages` 上 `sessionId + createdAt`。
- 审计/合规：写入不可变日志（append-only），敏感字段加密（KMS）。

## 5. 安全与权限
- Keycloak Realm/Client：管理端、用户端分离 Client；授权码流+PKCE；Token 验签（JWKS）。
- RBAC：角色→权限（资源/动作），后端守卫+前端路由守卫双保险。
- 安全基线：HTTPS、CSP、SameSite Cookie、CSRF 防护（用户端表单）、输入校验/输出编码、速率限制、审计追踪。

## 6. 可观测与运维
- 日志：结构化 JSON（Pino/Winston），Trace/Span（OTel）。
- 指标：API 延迟/错误率，WebSocket 在线数，队列堆积，Mongo/Redis 关键指标。
- 健康检查：`/health/live`、`/health/ready`；自动扩缩容；备份与演练。

## 7. Mermaid 架构示意
```
flowchart LR
  userApp[UserApp(Vue3)] --> gateway[API Gateway/Ingress]
  adminApp[AdminApp(Vue3)] --> gateway
  gateway --> authSvc[Auth(Keycloak Adapter)]
  gateway --> ticketSvc[TicketSvc(NestJS)]
  gateway --> chatSvc[ChatSvc(WebSocket)]
  gateway --> knowledgeSvc[KnowledgeSvc]
  gateway --> reportSvc[ReportingSvc]
  authSvc --> keycloak[Keycloak]
  ticketSvc --> mongo[(MongoDB)]
  chatSvc --> mongo
  chatSvc --> redis[(Redis)]
  reportSvc --> redis
  reportSvc --> mq[(EventBus)]
  ticketSvc --> mq
  mq --> reportSvc
```

