import type { ActionDef, BattleState } from './GameEngine';
import { RED_ACTIONS, BLUE_ACTIONS } from './GameEngine';

export function getAIActions(
  side: 'red' | 'blue',
  difficulty: 'easy' | 'medium' | 'hard',
  state: BattleState,
): string[] {
  const actions = side === 'red' ? RED_ACTIONS : BLUE_ACTIONS;
  const cooldowns = side === 'red' ? state.redCooldowns : state.blueCooldowns;

  // 可用操作
  const available = actions.filter(a => !cooldowns[a.id] || cooldowns[a.id] <= 0);

  if (available.length === 0) return [];

  switch (difficulty) {
    case 'easy':
      return easyAI(available);
    case 'medium':
      return mediumAI(available, side, state);
    case 'hard':
      return hardAI(available, side, state);
    default:
      return easyAI(available);
  }
}

function easyAI(available: ActionDef[]): string[] {
  // 随机选1-2个
  const count = Math.random() < 0.5 ? 1 : 2;
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(a => a.id);
}

function mediumAI(available: ActionDef[], side: 'red' | 'blue', state: BattleState): string[] {
  const selected: string[] = [];

  if (side === 'red') {
    // 红队策略：先侦察再攻击
    if (state.round <= 2) {
      // 前2回合侦察
      const recon = available.filter(a => a.category === 'recon');
      if (recon.length > 0) selected.push(recon[0].id);
    } else if (state.round <= 5) {
      // 中期利用漏洞
      const exploit = available.filter(a => a.category === 'exploit');
      if (exploit.length > 0) selected.push(exploit[0].id);
    } else {
      // 后期提权和数据窃取
      const impact = available.filter(a => ['privilege', 'lateral', 'impact'].includes(a.category));
      if (impact.length > 0) selected.push(impact[0].id);
    }
  } else {
    // 蓝队策略：先检测再防御
    if (state.round <= 2) {
      const detect = available.filter(a => a.category === 'detect');
      if (detect.length > 0) selected.push(detect[0].id);
    } else {
      const contain = available.filter(a => a.category === 'contain' || a.category === 'fix');
      if (contain.length > 0) selected.push(contain[0].id);
    }
  }

  // 补一个随机的
  if (selected.length < 2) {
    const remaining = available.filter(a => !selected.includes(a.id));
    if (remaining.length > 0) {
      const rand = remaining[Math.floor(Math.random() * remaining.length)];
      selected.push(rand.id);
    }
  }

  return selected;
}

function hardAI(available: ActionDef[], side: 'red' | 'blue', state: BattleState): string[] {
  const selected: string[] = [];

  if (side === 'red') {
    // 高级红队AI
    const hasRecon = state.eventLog.some(l => l.includes('端口扫描') && l.includes('成功'));
    const hasExploit = state.eventLog.some(l => (l.includes('SQL注入') || l.includes('文件上传')) && l.includes('成功'));
    const hasPrivEsc = state.eventLog.some(l => l.includes('权限提升') && l.includes('成功'));

    if (!hasRecon) {
      // 先侦察
      const recon = available.filter(a => a.category === 'recon');
      if (recon.length > 0) selected.push(recon[0].id);
    } else if (!hasExploit) {
      // 利用漏洞
      const exploit = available.filter(a => a.category === 'exploit');
      if (exploit.length > 0) selected.push(exploit[0].id);
    } else if (!hasPrivEsc) {
      // 提权
      const priv = available.filter(a => a.category === 'privilege');
      if (priv.length > 0) selected.push(priv[0].id);
    } else {
      // 窃取数据
      const data = available.find(a => a.id === 'data_exfil');
      if (data) selected.push(data.id);
    }

    // 额外操作
    if (selected.length < 2) {
      const extra = available.filter(a => !selected.includes(a.id) && a.cost <= 2);
      if (extra.length > 0) {
        selected.push(extra[Math.floor(Math.random() * extra.length)].id);
      }
    }
  } else {
    // 高级蓝队AI - 根据红队行为反制
    const redUsedSQL = state.eventLog.some(l => l.includes('SQL注入'));
    const redUsedUpload = state.eventLog.some(l => l.includes('文件上传'));
    const redUsedPrivesc = state.eventLog.some(l => l.includes('权限提升'));
    const redUsedLateral = state.eventLog.some(l => l.includes('横向移动'));

    if (redUsedSQL || redUsedUpload) {
      // 红队用了Web攻击，修复漏洞
      const fix = available.find(a => a.id === 'vuln_fix');
      if (fix) selected.push(fix.id);
    }

    if (redUsedUpload) {
      // 清除Webshell
      const kill = available.find(a => a.id === 'webshell_kill');
      if (kill && !selected.includes(kill.id)) selected.push(kill.id);
    }

    if (redUsedPrivesc || redUsedLateral) {
      // 红队在横向移动，隔离网络
      const isolate = available.find(a => a.id === 'network_isolate');
      if (isolate && !selected.includes(isolate.id)) selected.push(isolate.id);
    }

    // 默认加监控
    if (selected.length < 2) {
      const monitor = available.find(a => a.category === 'detect' && !selected.includes(a.id));
      if (monitor) selected.push(monitor.id);
    }

    // 如果什么都没选，随机选一个
    if (selected.length === 0 && available.length > 0) {
      selected.push(available[0].id);
    }
  }

  return selected;
}
