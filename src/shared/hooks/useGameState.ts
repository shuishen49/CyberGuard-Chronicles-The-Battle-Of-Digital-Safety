import { useState, useEffect, useCallback } from 'react';
import type { PlayerState } from '../types';

const STORAGE_KEY = 'cyber_game_state';

const defaultState: PlayerState = {
  exp: 0,
  level: 1,
  realm: '凡人',
  spiritStones: 100,
  completedTasks: [],
  completedVulns: [],
  completedIncidents: [],
  battleWins: 0,
  battleLosses: 0,
  achievements: [],
  lastDailyReset: '',
};

export const REALMS = [
  { name: '凡人', minLevel: 1, icon: '👤', desc: '初入安全世界' },
  { name: '炼气期', minLevel: 5, icon: '🌀', desc: '掌握Linux基础' },
  { name: '筑基期', minLevel: 15, icon: '🏗️', desc: '网络基础扎实' },
  { name: '金丹期', minLevel: 25, icon: '💊', desc: 'Web漏洞初窥' },
  { name: '元婴期', minLevel: 35, icon: '👶', desc: 'Payload构造精通' },
  { name: '化神期', minLevel: 45, icon: '🔮', desc: '渗透工具熟练' },
  { name: '大乘期', minLevel: 55, icon: '⚡', desc: '渗透方法论贯通' },
  { name: '仙尊期', minLevel: 65, icon: '👑', desc: '安全大师' },
];

function getRealm(level: number): string {
  let realm = REALMS[0].name;
  for (const r of REALMS) {
    if (level >= r.minLevel) realm = r.name;
  }
  return realm;
}

function getRealmIcon(realm: string): string {
  const found = REALMS.find(r => r.name === realm);
  return found?.icon || '👤';
}

function calcLevel(exp: number): number {
  // 每100经验升1级，指数增长
  return Math.floor(Math.sqrt(exp / 50)) + 1;
}

function expForNextLevel(level: number): number {
  return (level * level) * 50;
}

export function useGameState() {
  const [state, setState] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }, [state]);

  const addExp = useCallback((amount: number) => {
    setState(prev => {
      const newExp = prev.exp + amount;
      const newLevel = calcLevel(newExp);
      const newRealm = getRealm(newLevel);
      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        realm: newRealm,
        spiritStones: prev.spiritStones + Math.floor(amount / 5),
      };
    });
  }, []);

  const addSpiritStones = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      spiritStones: prev.spiritStones + amount,
    }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setState(prev => {
      if (prev.completedTasks.includes(taskId)) return prev;
      return { ...prev, completedTasks: [...prev.completedTasks, taskId] };
    });
  }, []);

  const completeVuln = useCallback((vulnId: string) => {
    setState(prev => {
      if (prev.completedVulns.includes(vulnId)) return prev;
      return { ...prev, completedVulns: [...prev.completedVulns, vulnId] };
    });
  }, []);

  const completeIncident = useCallback((incidentId: string) => {
    setState(prev => {
      if (prev.completedIncidents.includes(incidentId)) return prev;
      return { ...prev, completedIncidents: [...prev.completedIncidents, incidentId] };
    });
  }, []);

  const recordBattle = useCallback((won: boolean) => {
    setState(prev => ({
      ...prev,
      battleWins: won ? prev.battleWins + 1 : prev.battleWins,
      battleLosses: won ? prev.battleLosses : prev.battleLosses + 1,
    }));
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      return { ...prev, achievements: [...prev.achievements, achievementId] };
    });
  }, []);

  const isDailyResetNeeded = useCallback(() => {
    const today = new Date().toDateString();
    return state.lastDailyReset !== today;
  }, [state.lastDailyReset]);

  const doDailyReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastDailyReset: new Date().toDateString(),
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    addExp,
    addSpiritStones,
    completeTask,
    completeVuln,
    completeIncident,
    recordBattle,
    unlockAchievement,
    isDailyResetNeeded,
    doDailyReset,
    resetState,
    expForNextLevel: expForNextLevel(state.level),
    realmIcon: getRealmIcon(state.realm),
    progressToNext: state.exp - ((state.level - 1) * (state.level - 1) * 50),
    progressNeeded: expForNextLevel(state.level) - ((state.level - 1) * (state.level - 1) * 50),
  };
}
