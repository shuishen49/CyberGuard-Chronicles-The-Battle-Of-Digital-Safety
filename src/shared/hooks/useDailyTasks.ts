import { useState, useCallback, useEffect } from 'react';

interface DailyTask {
  id: string;
  type: 'quiz' | 'terminal' | 'payload';
  title: string;
  category: string;
  difficulty: 1 | 2 | 3;
  completed: boolean;
  reward: { exp: number; stones: number };
}

const DAILY_TASK_TEMPLATES = [
  { type: 'quiz' as const, title: 'Linux命令速答', category: 'linux', difficulty: 1 as const, reward: { exp: 20, stones: 5 } },
  { type: 'quiz' as const, title: '网络安全基础问答', category: 'general', difficulty: 1 as const, reward: { exp: 20, stones: 5 } },
  { type: 'quiz' as const, title: 'Web漏洞知识测验', category: 'web', difficulty: 2 as const, reward: { exp: 30, stones: 8 } },
  { type: 'quiz' as const, title: '网络协议挑战', category: 'network', difficulty: 2 as const, reward: { exp: 30, stones: 8 } },
  { type: 'quiz' as const, title: '密码学问答', category: 'crypto', difficulty: 2 as const, reward: { exp: 30, stones: 8 } },
  { type: 'quiz' as const, title: '渗透工具知识', category: 'tools', difficulty: 3 as const, reward: { exp: 50, stones: 12 } },
  { type: 'terminal' as const, title: '文件系统探索', category: 'linux', difficulty: 1 as const, reward: { exp: 25, stones: 6 } },
  { type: 'terminal' as const, title: '进程排查实战', category: 'linux', difficulty: 2 as const, reward: { exp: 35, stones: 9 } },
  { type: 'terminal' as const, title: '网络配置检查', category: 'network', difficulty: 2 as const, reward: { exp: 35, stones: 9 } },
  { type: 'terminal' as const, title: '日志分析任务', category: 'linux', difficulty: 3 as const, reward: { exp: 50, stones: 12 } },
  { type: 'payload' as const, title: 'SQL注入构造', category: 'sql_injection', difficulty: 1 as const, reward: { exp: 30, stones: 8 } },
  { type: 'payload' as const, title: 'XSS Payload编写', category: 'xss', difficulty: 2 as const, reward: { exp: 35, stones: 9 } },
  { type: 'payload' as const, title: '命令注入挑战', category: 'command_injection', difficulty: 3 as const, reward: { exp: 50, stones: 12 } },
];

function getRandomTasks(count: number): DailyTask[] {
  const shuffled = [...DAILY_TASK_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((t, i) => ({
    ...t,
    id: `daily_${new Date().toDateString()}_${i}`,
    completed: false,
  }));
}

const STORAGE_KEY = 'cyber_daily_tasks';

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedDate = parsed.date;
        const today = new Date().toDateString();
        if (savedDate === today) {
          return parsed.tasks;
        }
      }
    } catch (e) {
      console.error('Failed to load daily tasks:', e);
    }
    return getRandomTasks(3);
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, tasks }));
  }, [tasks]);

  const completeTask = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: true } : t))
    );
  }, []);

  const refreshTasks = useCallback(() => {
    setTasks(getRandomTasks(3));
  }, []);

  const allCompleted = tasks.every(t => t.completed);
  const completedCount = tasks.filter(t => t.completed).length;

  return {
    tasks,
    completeTask,
    refreshTasks,
    allCompleted,
    completedCount,
    totalCount: tasks.length,
  };
}
