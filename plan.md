# 网络安全红蓝对抗游戏 — 总体规划

## 项目概况

- **项目路径**: `D:\source_code\CyberSecurityAwarenessGame`
- **技术栈**: Vite + React 18 + TypeScript + Tailwind CSS + react-router-dom
- **现有主题**: 暗黑赛博风（深色背景 + 青色主色调），已有 XSS/SQL/DDOS/MITM 等独立小游戏组件
- **目标**: 在现有框架上新增 4 大核心模块，构成完整的红蓝对抗学习体系

---

## 四大模块总览

| # | 模块名称 | 定位 | 核心玩法 |
|---|---------|------|---------|
| 1 | 渗透测试基础·修仙录 | 蓝队基础修炼 | 修仙RPG + 每日任务 + 命令行实操 + 问答选择 |
| 2 | 漏洞复现实验室 | 红队实战训练 | CNVD/CVE 真实漏洞环境搭建 + 挖掘路径 + 利用链 |
| 3 | 应急响应指挥中心 | 蓝队防御演练 | 入侵溯源 + 日志分析 + 处置决策 + 时间线还原 |
| 4 | 红蓝对抗擂台 | 红蓝综合对抗 | 攻防实时对战 + 策略博弈 + 积分排位 |

---

## 模块 1：渗透测试基础·修仙录

### 概念设计

将渗透测试学习包装为修仙题材：玩家从"凡人"修炼到"仙尊"，每个境界对应不同的安全知识层级。

### 修炼境界体系

| 境界 | 等级 | 学习内容 |
|------|------|---------|
| 炼气期 | Lv.1-10 | Linux 基础命令 (ls, cat, grep, find, chmod, etc.) |
| 筑基期 | Lv.11-20 | 网络基础 (tcp/ip, nmap, netstat, wireshark) |
| 金丹期 | Lv.21-30 | Web 漏洞基础 (SQL注入、XSS、CSRF 概念) |
| 元婴期 | Lv.31-40 | 常用 Payload 构造 (SQL/XSS/命令注入 payload) |
| 化神期 | Lv.41-50 | 漏洞利用工具 (Burp Suite, sqlmap, Metasploit) |
| 大乘期 | Lv.51-60 | 综合渗透测试方法论 (信息收集→漏洞发现→利用→后渗透) |
| 仙尊期 | Lv.61+ | 高级技巧 (权限维持、横向移动、免杀) |

### 每日任务系统

每日随机抽取 3 类任务，完成获取修为（经验值）：

1. **问答题**（选择题/判断题）
   - 题库分类：Linux命令、网络协议、漏洞原理、工具使用
   - 示例："`以下哪个命令可以查看端口占用情况？` A. ps B. netstat C. ls D. pwd"
   - 答对 +10 修为，答错 +2 修为（鼓励学习）

2. **命令行实操**（模拟终端）
   - 内嵌一个简化版 Web Terminal 模拟器
   - 给出任务目标，玩家需输入正确命令
   - 示例："`在 /var/log 中查找包含 'Failed password' 的登录失败日志`"
   - 期望命令：`grep 'Failed password' /var/log/auth.log`
   - 支持命令提示和 tab 补全提示

3. **Payload 构造挑战**
   - 给定场景，构造特定 payload
   - 示例："`绕过简单的单引号过滤，构造 SQL 注入 payload 获取管理员密码`"
   - 提供输入框 + 即时验证（正则匹配或沙箱执行）

### 技术实现要点

```
src/modules/cultivation/
├── CultivationGame.tsx       # 主页面：角色面板 + 任务列表 + 境界展示
├── components/
│   ├── CharacterPanel.tsx    # 角色属性、境界、修为进度条
│   ├── DailyTasks.tsx        # 每日任务卡片列表
│   ├── QuizTask.tsx          # 问答任务组件
│   ├── TerminalTask.tsx      # 命令行实操任务（模拟终端）
│   ├── PayloadTask.tsx       # Payload 构造任务
│   ├── RealmBreakthrough.tsx # 境界突破动画/剧情
│   └── KnowledgeBook.tsx     # 知识图谱/功法秘籍
├── data/
│   ├── questions.json        # 问答题库（500+ 题）
│   ├── terminalTasks.json    # 终端任务库
│   ├── payloadTasks.json     # Payload 任务库
│   └── realms.json           # 境界配置
├── hooks/
│   ├── useGameState.ts       # 游戏状态管理（localStorage 持久化）
│   └── useDailyTasks.ts      # 每日任务刷新逻辑
└── utils/
    ├── terminalSimulator.ts  # 命令匹配引擎
    └── payloadValidator.ts   # Payload 验证器
```

### 核心组件设计

**模拟终端 (TerminalTask)**
- 基于 xterm.js 或自研轻量实现
- 支持基础命令：ls, cat, grep, find, chmod, chown, ps, netstat, curl, wget, ssh, tar, awk, sed
- 虚拟文件系统（JSON 驱动的目录树）
- 命令输入后对比期望输出，容错匹配（忽略多余空格、支持多种正确写法）

**修仙元素**
- 突破境界时播放特效动画（CSS keyframes 或 canvas）
- 每个境界解锁对应"功法"（即知识文档）
- 灵石货币系统：完成任务获得灵石，可兑换提示或皮肤

---

## 模块 2：漏洞复现实验室

### 概念设计

模拟真实漏洞环境，从 CNVD/CNVD 和 CVE 数据库中选取经典漏洞，引导玩家完成完整的漏洞复现流程。

### 漏洞分级

| 难度 | 漏洞类型 | 示例 |
|------|---------|------|
| 入门 | 信息泄露、弱口令 | CNVD-2019-23005 某OA系统弱口令 |
| 初级 | SQL注入、文件上传 | CVE-2018-16341 ThinkPHP SQL注入 |
| 中级 | RCE、反序列化 | CVE-2019-2725 WebLogic RCE |
| 高级 | 权限绕过、逻辑漏洞 | CVE-2021-44228 Log4Shell |
| 地狱 | 组合利用链 | 多漏洞组合的APT攻击链 |

### 漏洞复现流程（每个关卡固定流程）

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Step 1     │───▶│  Step 2     │───▶│  Step 3     │───▶│  Step 4     │
│  环境还原    │    │  信息收集    │    │  漏洞挖掘    │    │  漏洞利用    │
│  了解目标    │    │  发现入口    │    │  确认漏洞    │    │  获取权限    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
   漏洞背景介绍        扫描/探测           PoC验证           Exp利用
   目标系统信息        路径发现            参数构造           结果展示
   受影响版本          端口服务            回显分析           修复建议
```

### 漏洞场景数据结构

```typescript
interface VulnChallenge {
  id: string;
  cveId: string;           // CVE-2021-44228
  cnvdId?: string;         // CNVD-2019-XXXXX
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: 'sql_injection' | 'rce' | 'file_upload' | 'xss' | 'ssrf' | 'deserialization' | 'auth_bypass' | 'info_disclosure';
  targetInfo: {
    name: string;
    version: string;
    description: string;
  };
  environment: {
    dockerCompose?: string;  // Docker环境配置
    setupGuide: string;      // 环境搭建步骤
    targetUrl: string;       // 目标地址（模拟或真实沙箱）
  };
  steps: VulnStep[];
  hints: string[];
  fixSuggestion: string;     // 修复建议（通关后展示）
  references: string[];      // 参考链接
}

interface VulnStep {
  phase: 'recon' | 'discover' | 'verify' | 'exploit';
  title: string;
  description: string;
  taskType: 'command_input' | 'url_input' | 'payload_input' | 'quiz' | 'click_path';
  expectedAnswer: string | string[];  // 支持多种正确答案
  hint: string;
  explanation: string;
  visualAid?: string;        // 辅助图片/动画路径
}
```

### 技术实现要点

```
src/modules/vuln-lab/
├── VulnLab.tsx              # 主页面：漏洞列表（卡片/列表视图）
├── components/
│   ├── VulnCard.tsx         # 漏洞卡片（CVE编号、难度、类型标签）
│   ├── VulnChallenge.tsx    # 关卡主界面（左侧环境 + 右侧操作面板）
│   ├── EnvironmentPanel.tsx # 环境信息/搭建指南（可折叠侧边栏）
│   ├── StepWizard.tsx       # 步骤向导（进度条 + 步骤切换）
│   ├── TerminalPanel.tsx    # 嵌入式终端（复用模块1的终端组件）
│   ├── PayloadEditor.tsx    # Payload 编辑器（语法高亮 + 提示）
│   ├── ResultViewer.tsx     # 结果展示（成功/失败反馈）
│   └── FixGuide.tsx         # 修复指南（通关后解锁）
├── data/
│   ├── vulnerabilities/     # 漏洞数据目录
│   │   ├── cve-2021-44228.json
│   │   ├── cve-2018-16341.json
│   │   └── ...
│   └── categories.json      # 漏洞分类配置
├── hooks/
│   ├── useVulnProgress.ts   # 漏洞完成进度
│   └── useEnvironment.ts    # 环境状态管理
└── utils/
    ├── answerMatcher.ts     # 答案匹配（模糊匹配 + 关键词匹配）
    └── scoreCalculator.ts   # 评分计算
```

### 交互设计

- **漏洞列表页**：卡片布局，支持按难度/类型/平台筛选
- **关卡页**：左侧是环境信息面板（可折叠），右侧是分步骤的操作区
- **每步完成后**：展示原理讲解 + 扩展知识
- **通关后**：展示完整利用链总结 + 修复方案 + 推荐进阶漏洞
- **模拟 vs 真实**：初级关卡用前端模拟，高级关卡可选连接 Docker 沙箱

---

## 模块 3：应急响应指挥中心

### 概念设计

玩家扮演蓝队安全分析师，接到入侵告警后进行应急响应。模拟真实 SOC（安全运营中心）工作场景。

### 场景类型

| 场景 | 描述 | 技能要求 |
|------|------|---------|
| 勒索病毒应急 | 服务器感染勒索软件，需要溯源和处置 | 日志分析、进程排查 |
| Web 入侵排查 | 网站被挂马/篡改，需要定位后门 | Webshell 查杀、流量分析 |
| 挖矿病毒处置 | 服务器CPU异常，发现挖矿程序 | 进程分析、定时任务排查 |
| 内网横向渗透 | 域控被入侵，需要遏制扩散 | 域安全、网络隔离 |
| 数据泄露溯源 | 敏感数据外泄，需要定位泄露源 | 数据库审计、网络流量 |
| APT 攻击响应 | 高级持续性威胁，需要全面排查 | 威胁情报、IOC匹配 |

### 应急响应流程

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ 告警确认  │─▶│ 初步研判  │─▶│ 深入分析  │─▶│ 处置遏制  │─▶│ 复盘总结  │
│ Alert    │  │ Triage   │  │ Analysis │  │ Contain  │  │ Review   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
     │              │              │              │              │
  告警详情        快速判断        日志深挖        采取措施        报告输出
  影响范围        严重等级        攻击路径        隔离/封堵       经验总结
  时间线          关键指标        IOC提取         清除/修复       改进建议
```

### 场景数据结构

```typescript
interface IncidentScenario {
  id: string;
  title: string;
  type: 'ransomware' | 'web_intrusion' | 'crypto_mining' | 'lateral_movement' | 'data_breach' | 'apt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  alertInfo: {
    source: string;          // 告警来源
    time: string;            // 告警时间
    summary: string;         // 告警摘要
  };
  timeline: TimelineEvent[]; // 攻击时间线（逐步解锁）
  evidence: Evidence[];      // 证据材料
  steps: ResponseStep[];
  scoring: {
    maxScore: number;
    timeBonus: boolean;      // 是否有时间加分
    penaltyForMistakes: number;
  };
}

interface TimelineEvent {
  timestamp: string;
  event: string;
  category: 'initial_access' | 'execution' | 'persistence' | 'lateral_movement' | 'exfiltration' | 'impact';
  indicator: string;         // IOC
}

interface Evidence {
  type: 'log' | 'pcap' | 'screenshot' | 'file_list' | 'process_list' | 'registry';
  name: string;
  content: string;           // 文本内容或图片路径
  revealed: boolean;         // 是否已解锁
}

interface ResponseStep {
  phase: 'confirm' | 'triage' | 'analyze' | 'contain' | 'review';
  title: string;
  description: string;
  taskType: 'log_analysis' | 'command_input' | 'quiz' | 'drag_drop' | 'timeline_sort' | 'ioc_extract';
  data: any;                 // 任务数据（日志内容、进程列表等）
  expectedAnswer: string | string[];
  explanation: string;
  score: number;
}
```

### 技术实现要点

```
src/modules/incident-response/
├── IncidentResponse.tsx     # 主页面：场景选择 + 告警面板
├── components/
│   ├── AlertDashboard.tsx   # 告警大屏（模拟 SOC 仪表盘）
│   ├── ScenarioCard.tsx     # 场景卡片
│   ├── InvestigationPanel.tsx # 调查面板（证据查看器）
│   ├── LogViewer.tsx        # 日志查看器（带搜索/过滤/高亮）
│   ├── TimelineBuilder.tsx  # 时间线构建（拖拽排序事件）
│   ├── IOCExtractor.tsx     # IOC 提取工具（IP/域名/Hash 标注）
│   ├── ProcessAnalyzer.tsx  # 进程分析器（树状展示 + 可疑标记）
│   ├── NetworkDiagram.tsx   # 网络拓扑图（展示攻击路径）
│   ├── ReportGenerator.tsx  # 应急响应报告生成器
│   └── ContainmentAction.tsx # 处置操作面板（模拟防火墙/隔离）
├── data/
│   ├── scenarios/           # 场景数据
│   │   ├── ransomware-01.json
│   │   ├── web-intrusion-01.json
│   │   └── ...
│   └── ioc-database.json    # IOC 知识库
├── hooks/
│   ├── useIncidentProgress.ts
│   └── useEvidence.ts
└── utils/
    ├── logParser.ts         # 日志解析器
    └── iocMatcher.ts        # IOC 匹配器
```

### 特色交互

- **日志查看器**：支持 grep 式搜索、正则过滤、关键行高亮
- **时间线拼图**：将打乱的攻击事件按时间排序
- **IOC 高亮**：在日志中自动标注 IP、域名、Hash 等 IOC
- **进程树分析**：展示进程父子关系，标记可疑进程
- **报告生成**：根据玩家操作自动生成应急响应报告（Markdown 格式，可导出）

---

## 模块 4：红蓝对抗擂台

### 概念设计

综合前三个模块所学，进行实时攻防对抗。玩家可选择红队（攻击方）或蓝队（防御方）进行对战。

### 对战模式

| 模式 | 描述 | 人数 |
|------|------|------|
| 单人闯关 | 固定攻防场景，逐步升级难度 | 1人 |
| 人机对战 | AI 蓝队 vs 玩家红队（或反之） | 1人 + AI |
| 双人对抗 | 红蓝双方实时博弈（需 WebSocket） | 2人 |
| 团队赛 | 多人组队红蓝对抗（未来扩展） | 4-10人 |

### 攻防机制

**红队（攻击方）可用操作：**
- 信息收集：端口扫描、目录爆破、指纹识别
- 漏洞利用：选择已知漏洞进行攻击
- 权限提升：利用配置不当提权
- 横向移动：利用凭据跳板
- 目标达成：获取 Flag / 提取数据

**蓝队（防御方）可用操作：**
- 监控告警：查看安全设备日志
- 分析研判：分析可疑流量/进程
- 封堵处置：封禁IP、隔离主机、杀进程
- 漏洞修复：打补丁、改配置
- 目标达成：阻止攻击 / 最小化损失

### 策略博弈系统

```
回合制框架：
  红队行动阶段（30秒）→ 蓝队响应阶段（30秒）→ 结算阶段

每回合：
  - 双方各选 1-2 个操作
  - 操作有冷却时间（高级操作需等待更多回合）
  - 双方看不到对方的具体操作，只看到"事件告警"提示
  - 蓝队看到的是：可疑流量告警、异常登录告警等
  - 红队看到的是：目标系统响应、防御措施反馈等
```

### 技术实现要点

```
src/modules/arena/
├── Arena.tsx                # 主页面：模式选择 + 匹配大厅
├── components/
│   ├── ModeSelect.tsx       # 模式选择界面
│   ├── BattleField.tsx      # 战场主界面（双栏：红方/蓝方）
│   ├── ActionPanel.tsx      # 操作面板（技能卡片式）
│   ├── EventLog.tsx         # 事件日志（实时滚动）
│   ├── ScoreBoard.tsx       # 积分板
│   ├── NetworkMap.tsx       # 网络拓扑图（动态更新攻击路径）
│   ├── AIOpponent.tsx       # AI 对手逻辑
│   └── MatchResult.tsx      # 对战结果/复盘
├── data/
│   ├── scenarios/           # 对战场景配置
│   ├── red-actions.json     # 红队可用操作
│   ├── blue-actions.json    # 蓝队可用操作
│   └── ai-strategies.json   # AI 策略配置
├── engine/
│   ├── GameEngine.ts        # 游戏引擎（回合管理、状态同步）
│   ├── ActionResolver.ts    # 操作解析器（红蓝操作对冲逻辑）
│   └── AIStrategy.ts        # AI 决策引擎
└── hooks/
    └── useBattle.ts         # 对战状态管理
```

---

## 通用基础设施

### 共享组件

```
src/shared/
├── components/
│   ├── Terminal/            # 通用终端组件（模块1/2共用）
│   │   ├── Terminal.tsx
│   │   ├── TerminalLine.tsx
│   │   └── CommandInput.tsx
│   ├── CodeEditor/          # 代码/Payload编辑器
│   │   ├── CodeEditor.tsx
│   │   └── SyntaxHighlight.tsx
│   ├── Progress/            # 通用进度条/成就系统
│   ├── Modal/               # 通用弹窗
│   ├── Toast/               # 消息提示
│   └── Layout/              # 页面布局组件
├── hooks/
│   ├── useLocalStorage.ts   # 本地存储封装
│   ├── useTimer.ts          # 计时器
│   ├── useSound.ts          # 音效管理
│   └── useAchievement.ts    # 成就系统
├── data/
│   └── achievements.json    # 全局成就定义
├── styles/
│   └── cyber-theme.css      # 赛博主题样式扩展
└── utils/
    ├── score.ts             # 统一评分系统
    └── analytics.ts         # 学习数据统计
```

### 数据持久化方案

- **短期**: localStorage 存储游戏进度、每日任务状态
- **中期**: IndexedDB 存储大量题库、日志数据
- **长期（可选）**: 后端 API + 数据库，支持多人在线

### 路由规划

```typescript
// 新增路由
<Route path="/modules" element={<ModuleSelect />} />

{/* 模块1: 修仙录 */}
<Route path="/cultivation" element={<CultivationGame />} />
<Route path="/cultivation/task/:taskId" element={<TaskDetail />} />

{/* 模块2: 漏洞复现实验室 */}
<Route path="/vuln-lab" element={<VulnLab />} />
<Route path="/vuln-lab/challenge/:vulnId" element={<VulnChallenge />} />

{/* 模块3: 应急响应 */}
<Route path="/incident-response" element={<IncidentResponse />} />
<Route path="/incident-response/scenario/:scenarioId" element={<ScenarioPlay />} />

{/* 模块4: 红蓝对抗擂台 */}
<Route path="/arena" element={<Arena />} />
<Route path="/arena/battle/:battleId" element={<BattleField />} />
```

---

## 开发阶段规划

### Phase 1：基础框架 + 模块1（修仙录）⭐ 优先
**预计工时：2-3 周**

1. 搭建通用组件库（Terminal、CodeEditor、Progress）
2. 实现修仙境界系统 + 等级进度
3. 实现问答任务系统（题库 200+ 题起步）
4. 实现模拟终端（支持 30+ Linux 命令）
5. 实现 Payload 构造任务
6. 实现每日任务刷新机制
7. 主页面模块选择入口

**验收标准：**
- 可完成每日 3 个任务，修为正确累加
- 境界突破动画正常播放
- 终端模拟可交互，命令匹配容错率 > 90%
- 数据 localStorage 持久化不丢失

### Phase 2：模块2（漏洞复现实验室）
**预计工时：2-3 周**

1. 漏洞数据结构定义 + 5 个入门级漏洞数据
2. 步骤向导 + 关卡流程引擎
3. Payload 编辑器（带语法提示）
4. 环境信息面板 + 搭建指南
5. 通关评分 + 修复建议展示
6. 再补 10+ 漏洞数据（覆盖各难度）

**验收标准：**
- 至少 15 个漏洞关卡可玩
- 每个关卡 4 步流程完整走通
- 答案匹配支持多种正确写法

### Phase 3：模块3（应急响应）
**预计工时：2 周**

1. 场景数据结构 + 3 个基础场景
2. 日志查看器（搜索/过滤/高亮）
3. 时间线构建组件
4. IOC 提取标注
5. 处置操作面板
6. 报告生成器
7. 再补 3+ 场景

**验收标准：**
- 至少 6 个应急场景可玩
- 日志查看器支持关键字搜索
- 时间线排序交互流畅
- 报告可导出为 Markdown

### Phase 4：模块4（红蓝对抗擂台）
**预计工时：2-3 周**

1. 回合制引擎核心逻辑
2. 红蓝操作卡片系统
3. 操作对冲/结算逻辑
4. AI 对手策略（3 种难度）
5. 网络拓扑图可视化
6. 战后复盘/积分系统

**验收标准：**
- 单人 vs AI 可正常对战 10 回合
- AI 行为合理，不呆板
- 积分正确计算

### Phase 5：整合优化
**预计工时：1 周**

1. 统一导航和模块选择页面
2. 全局成就系统
3. 学习数据统计面板
4. 音效和动画打磨
5. 响应式适配（移动端）
6. 性能优化 + 代码分割（懒加载各模块）

---

## 关键技术决策

| 决策点 | 方案 | 理由 |
|--------|------|------|
| 状态管理 | React Context + localStorage | 项目规模不需要 Redux，保持轻量 |
| 终端模拟 | 自研轻量方案（非 xterm.js） | 避免引入重依赖，用 div + input 模拟 |
| 代码高亮 | prismjs 或 highlight.js | Payload 编辑器需要语法高亮 |
| 动画效果 | Framer Motion | React 生态成熟的动画库 |
| 数据存储 | 静态 JSON + localStorage | 无需后端，纯前端即可运行 |
| 路由 | react-router-dom v6 | 已有依赖，保持一致 |
| 图标 | lucide-react | 已有依赖，图标丰富 |

---

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 题库内容不足 | 学习体验单一 | 分批补充，先保证核心题库 200+ |
| 终端模拟真实度不够 | 命令实操体验差 | 支持模糊匹配 + 提示系统 |
| 漏洞数据编写工作量大 | 开发周期延长 | 优先做 5 个高质量场景，后续迭代补充 |
| 纯前端无法运行真实漏洞环境 | 漏洞复现受限 | 用模拟交互替代真实执行，高级可选 Docker |
| AI 对手太弱/太强 | 对战体验差 | 分 3 级难度，根据玩家水平自适应 |

---

## 待确认事项

> ⚠️ **模块 4 确认**：你提到"四个模块"但只详细描述了前三个。第四模块我暂定为"红蓝对抗擂台"（实时攻防对战），请确认是否符合预期，或者你有其他想法？

> **内容深度**：漏洞复现和应急响应的场景数据需要大量手工编写，确认是先做少量高质量场景（5-6个）还是要求一次性覆盖所有类型？

> **是否有后端需求**：当前规划为纯前端方案（localStorage 持久化）。如果需要多人在线对战或数据统计，需要增加后端开发。
