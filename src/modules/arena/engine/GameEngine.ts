export interface ActionDef {
  id: string;
  name: string;
  emoji: string;
  side: 'red' | 'blue';
  category: string;
  description: string;
  cooldown: number;
  cost: number;
  effect: string;
  counterActions: string[];  // 能被哪些操作克制
  successRate: number;       // 基础成功率
}

export const RED_ACTIONS: ActionDef[] = [
  { id: 'port_scan', name: '端口扫描', emoji: '🔍', side: 'red', category: 'recon', description: '扫描目标开放端口', cooldown: 0, cost: 1, effect: '发现开放端口', counterActions: ['traffic_monitor', 'firewall_block'], successRate: 0.9 },
  { id: 'dir_brute', name: '目录爆破', emoji: '📂', side: 'red', category: 'recon', description: '枚举Web隐藏路径', cooldown: 0, cost: 1, effect: '发现隐藏目录', counterActions: ['traffic_monitor', 'waf_update'], successRate: 0.8 },
  { id: 'fingerprint', name: '指纹识别', emoji: '🔎', side: 'red', category: 'recon', description: '识别服务版本和框架', cooldown: 0, cost: 1, effect: '获取版本信息', counterActions: ['traffic_monitor'], successRate: 0.85 },
  { id: 'sql_inject', name: 'SQL注入', emoji: '💉', side: 'red', category: 'exploit', description: '利用SQL注入获取数据', cooldown: 2, cost: 2, effect: '获取数据库数据', counterActions: ['ip_ban', 'vuln_fix', 'traffic_monitor'], successRate: 0.7 },
  { id: 'xss_attack', name: 'XSS钓鱼', emoji: '🎣', side: 'red', category: 'exploit', description: '利用XSS获取Cookie', cooldown: 2, cost: 2, effect: '获取用户Cookie', counterActions: ['ip_ban', 'vuln_fix'], successRate: 0.65 },
  { id: 'file_upload', name: '文件上传', emoji: '📤', side: 'red', category: 'exploit', description: '上传WebShell后门', cooldown: 3, cost: 3, effect: '获得WebShell', counterActions: ['webshell_kill', 'ip_ban', 'vuln_fix'], successRate: 0.6 },
  { id: 'privesc', name: '权限提升', emoji: '⬆️', side: 'red', category: 'privilege', description: '利用配置不当提权', cooldown: 3, cost: 3, effect: '获得root权限', counterActions: ['process_check', 'vuln_fix'], successRate: 0.5 },
  { id: 'lateral_move', name: '横向移动', emoji: '🔗', side: 'red', category: 'lateral', description: '利用凭据跳板到其他主机', cooldown: 4, cost: 4, effect: '控制更多主机', counterActions: ['network_isolate', 'password_reset', 'process_check'], successRate: 0.5 },
  { id: 'data_exfil', name: '数据窃取', emoji: '💾', side: 'red', category: 'impact', description: '加密压缩并外传敏感数据', cooldown: 5, cost: 5, effect: '获得Flag (红队胜利)', counterActions: ['network_isolate', 'traffic_monitor'], successRate: 0.4 },
  { id: 'dos_attack', name: 'DDoS攻击', emoji: '🌊', side: 'red', category: 'impact', description: '大流量压垮服务', cooldown: 4, cost: 3, effect: '服务不可用', counterActions: ['ip_ban', 'network_isolate'], successRate: 0.55 },
];

export const BLUE_ACTIONS: ActionDef[] = [
  { id: 'traffic_monitor', name: '流量监控', emoji: '📡', side: 'blue', category: 'detect', description: '监控网络异常流量', cooldown: 0, cost: 1, effect: '发现可疑活动', counterActions: [], successRate: 0.9 },
  { id: 'log_analysis', name: '日志分析', emoji: '📋', side: 'blue', category: 'detect', description: '分析系统日志发现攻击痕迹', cooldown: 0, cost: 1, effect: '发现攻击痕迹', counterActions: [], successRate: 0.85 },
  { id: 'ip_ban', name: 'IP封禁', emoji: '🚫', side: 'blue', category: 'contain', description: '封禁攻击者IP地址', cooldown: 2, cost: 2, effect: '阻断攻击源', counterActions: [], successRate: 0.8 },
  { id: 'vuln_fix', name: '漏洞修复', emoji: '🔧', side: 'blue', category: 'fix', description: '修补被利用的安全漏洞', cooldown: 3, cost: 3, effect: '消除漏洞', counterActions: [], successRate: 0.75 },
  { id: 'process_check', name: '进程排查', emoji: '⚙️', side: 'blue', category: 'detect', description: '检查可疑进程和后门', cooldown: 1, cost: 2, effect: '发现恶意进程', counterActions: [], successRate: 0.7 },
  { id: 'webshell_kill', name: 'Webshell查杀', emoji: '🗑️', side: 'blue', category: 'fix', description: '清除Web后门文件', cooldown: 2, cost: 2, effect: '清除后门', counterActions: [], successRate: 0.8 },
  { id: 'network_isolate', name: '网络隔离', emoji: '🔌', side: 'blue', category: 'contain', description: '隔离受感染主机', cooldown: 3, cost: 3, effect: '阻止横向扩散', counterActions: [], successRate: 0.85 },
  { id: 'password_reset', name: '密码重置', emoji: '🔑', side: 'blue', category: 'fix', description: '重置所有相关账户密码', cooldown: 3, cost: 2, effect: '废除泄露凭据', counterActions: [], successRate: 0.9 },
  { id: 'firewall_block', name: '防火墙加固', emoji: '🧱', side: 'blue', category: 'contain', description: '更新防火墙规则', cooldown: 1, cost: 2, effect: '强化网络防护', counterActions: [], successRate: 0.75 },
  { id: 'waf_update', name: 'WAF更新', emoji: '🛡️', side: 'blue', category: 'fix', description: '更新WAF规则拦截攻击', cooldown: 2, cost: 2, effect: '拦截Web攻击', counterActions: [], successRate: 0.7 },
];

export interface BattleState {
  round: number;
  maxRounds: number;
  redScore: number;
  blueScore: number;
  redActions: ActionDef[];
  blueActions: ActionDef[];
  redCooldowns: Record<string, number>;
  blueCooldowns: Record<string, number>;
  redFlags: string[];
  blueFlags: string[];
  eventLog: string[];
  phase: 'select' | 'resolve' | 'gameover';
}

export function createInitialState(): BattleState {
  return {
    round: 1,
    maxRounds: 10,
    redScore: 0,
    blueScore: 0,
    redActions: RED_ACTIONS,
    blueActions: BLUE_ACTIONS,
    redCooldowns: {},
    blueCooldowns: {},
    redFlags: [],
    blueFlags: [],
    eventLog: ['⚔️ 对战开始！红队 vs 蓝队'],
    phase: 'select',
  };
}

export function resolveRound(
  state: BattleState,
  redActionIds: string[],
  blueActionIds: string[],
): BattleState {
  const newState = { ...state };
  const log: string[] = [...state.eventLog];
  log.push(`\n--- 回合 ${state.round} ---`);

  const redSelected = redActionIds.map(id => RED_ACTIONS.find(a => a.id === id)).filter(Boolean) as ActionDef[];
  const blueSelected = blueActionIds.map(id => BLUE_ACTIONS.find(a => a.id === id)).filter(Boolean) as ActionDef[];

  // 解析红队操作
  for (const action of redSelected) {
    // 检查是否被蓝队操作克制
    const countered = blueSelected.some(b => action.counterActions.includes(b.id));
    const baseChance = countered ? action.successRate * 0.3 : action.successRate;
    const success = Math.random() < baseChance;

    if (success) {
      newState.redScore += action.cost;
      log.push(`🔴 [成功] ${action.emoji} ${action.name} → ${action.effect}`);

      // 特殊效果
      if (action.id === 'data_exfil') {
        newState.redFlags.push('flag_data');
        log.push('🏆 红队成功窃取数据！红队获得关键Flag！');
      }
      if (action.id === 'sql_inject') {
        newState.redScore += 2;
        log.push('   → 获得额外数据泄露加分');
      }
    } else {
      log.push(`🔴 [失败] ${action.emoji} ${action.name} → 被防御/未成功`);
      if (countered) {
        log.push(`   → 被蓝队操作克制！`);
        newState.blueScore += 1;
      }
    }
  }

  // 解析蓝队操作
  for (const action of blueSelected) {
    const success = Math.random() < action.successRate;

    if (success) {
      newState.blueScore += action.cost;
      log.push(`🔵 [成功] ${action.emoji} ${action.name} → ${action.effect}`);

      if (action.id === 'network_isolate') {
        newState.blueFlags.push('flag_isolate');
        log.push('🛡️ 蓝队成功隔离受感染主机！');
      }
    } else {
      log.push(`🔵 [失败] ${action.emoji} ${action.name} → 未能生效`);
    }
  }

  // 更新冷却
  for (const action of redSelected) {
    if (action.cooldown > 0) newState.redCooldowns[action.id] = action.cooldown;
  }
  for (const action of blueSelected) {
    if (action.cooldown > 0) newState.blueCooldowns[action.id] = action.cooldown;
  }

  // 减少冷却
  for (const key of Object.keys(newState.redCooldowns)) {
    newState.redCooldowns[key] = Math.max(0, newState.redCooldowns[key] - 1);
    if (newState.redCooldowns[key] === 0) delete newState.redCooldowns[key];
  }
  for (const key of Object.keys(newState.blueCooldowns)) {
    newState.blueCooldowns[key] = Math.max(0, newState.blueCooldowns[key] - 1);
    if (newState.blueCooldowns[key] === 0) delete newState.blueCooldowns[key];
  }

  // 判定胜负
  const isGameOver = state.round >= state.maxRounds || newState.redFlags.includes('flag_data');

  if (isGameOver) {
    if (newState.redFlags.includes('flag_data')) {
      log.push('\n🏆 红队通过数据窃取获胜！');
    } else if (newState.blueFlags.includes('flag_isolate') && !newState.redFlags.includes('flag_data')) {
      log.push('\n🛡️ 蓝队成功防御，蓝队获胜！');
    } else if (newState.redScore > newState.blueScore) {
      log.push('\n🏆 回合结束，红队得分更高，红队获胜！');
    } else if (newState.blueScore > newState.redScore) {
      log.push('\n🛡️ 回合结束，蓝队得分更高，蓝队获胜！');
    } else {
      log.push('\n⚖️ 平局！双方势均力敌！');
    }
    newState.phase = 'gameover';
  } else {
    newState.round += 1;
    newState.phase = 'select';
  }

  newState.eventLog = log;
  return newState;
}
