// 共享类型定义

// 修炼境界
export interface Realm {
  id: string;
  name: string;
  level: number;
  requiredExp: number;
  description: string;
  icon: string;
  unlocks: string[];
}

// 问答任务
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'linux' | 'network' | 'web' | 'crypto' | 'tools' | 'general';
  difficulty: 1 | 2 | 3;
}

// 终端任务
export interface TerminalTask {
  id: string;
  title: string;
  description: string;
  hint: string;
  category: 'linux' | 'network' | 'web';
  difficulty: 1 | 2 | 3;
  expectedCommands: string[];  // 可接受的命令列表
  expectedOutput?: string;     // 期望输出（可选）
  virtualFS: VirtualFS;        // 虚拟文件系统
}

export interface VirtualFS {
  [path: string]: string | VirtualFS;
}

// Payload 任务
export interface PayloadTask {
  id: string;
  title: string;
  description: string;
  category: 'sql_injection' | 'xss' | 'command_injection' | 'file_inclusion' | 'xxe';
  difficulty: 1 | 2 | 3;
  scenario: string;
  hint: string;
  validationPattern: string;   // 正则验证
  exampleAnswer: string;
  explanation: string;
}

// 漏洞复现
export interface VulnChallenge {
  id: string;
  cveId: string;
  cnvdId?: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  targetInfo: {
    name: string;
    version: string;
    description: string;
  };
  steps: VulnStep[];
  hints: string[];
  fixSuggestion: string;
  references: string[];
}

export interface VulnStep {
  phase: 'recon' | 'discover' | 'verify' | 'exploit';
  title: string;
  description: string;
  taskType: 'command_input' | 'url_input' | 'payload_input' | 'quiz' | 'click_path';
  expectedAnswer: string | string[];
  hint: string;
  explanation: string;
}

// 应急响应
export interface IncidentScenario {
  id: string;
  title: string;
  type: 'ransomware' | 'web_intrusion' | 'crypto_mining' | 'lateral_movement' | 'data_breach' | 'apt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  alertInfo: {
    source: string;
    time: string;
    summary: string;
  };
  timeline: TimelineEvent[];
  evidence: Evidence[];
  steps: ResponseStep[];
  scoring: {
    maxScore: number;
    timeBonus: boolean;
  };
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  category: string;
  indicator: string;
}

export interface Evidence {
  type: 'log' | 'pcap' | 'screenshot' | 'file_list' | 'process_list' | 'registry';
  name: string;
  content: string;
  revealed: boolean;
}

export interface ResponseStep {
  phase: 'confirm' | 'triage' | 'analyze' | 'contain' | 'review';
  title: string;
  description: string;
  taskType: 'log_analysis' | 'command_input' | 'quiz' | 'drag_drop' | 'timeline_sort' | 'ioc_extract';
  data: Record<string, unknown>;
  expectedAnswer: string | string[];
  explanation: string;
  score: number;
}

// 红蓝对抗
export interface BattleAction {
  id: string;
  name: string;
  side: 'red' | 'blue';
  category: string;
  description: string;
  cooldown: number;
  cost: number;
  effect: string;
}

// 通用游戏状态
export interface PlayerState {
  exp: number;
  level: number;
  realm: string;
  spiritStones: number;
  completedTasks: string[];
  completedVulns: string[];
  completedIncidents: string[];
  battleWins: number;
  battleLosses: number;
  achievements: string[];
  lastDailyReset: string;
}
