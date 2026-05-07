import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Swords, Flame, Shield } from 'lucide-react';
import { createInitialState, resolveRound, RED_ACTIONS, BLUE_ACTIONS } from '../engine/GameEngine';
import { getAIActions } from '../engine/AIStrategy';
import type { BattleState, ActionDef } from '../engine/GameEngine';

interface Props {
  playerSide: 'red' | 'blue';
  difficulty: 'easy' | 'medium' | 'hard';
  onEnd: (won: boolean) => void;
}

export default function BattleField({ playerSide, difficulty, onEnd }: Props) {
  const [state, setState] = useState<BattleState>(createInitialState);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [resolving, setResolving] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      requestAnimationFrame(() => {
        if (logRef.current) {
          logRef.current.scrollTop = logRef.current.scrollHeight;
        }
      });
    }
  }, [state.eventLog.length]);

  const playerActions = playerSide === 'red' ? RED_ACTIONS : BLUE_ACTIONS;
  const playerCooldowns = playerSide === 'red' ? state.redCooldowns : state.blueCooldowns;

  const toggleAction = (id: string) => {
    if (resolving || state.phase === 'gameover') return;
    setSelectedActions(prev => {
      if (prev.includes(id)) return prev.filter(a => a !== id);
      if (prev.length >= 2) return prev; // 最多选2个
      return [...prev, id];
    });
  };

  const handleEndTurn = () => {
    if (selectedActions.length === 0 || resolving) return;
    setResolving(true);

    // AI选择操作
    const aiSide = playerSide === 'red' ? 'blue' : 'red';
    const aiActions = getAIActions(aiSide, difficulty, state);

    const redActions = playerSide === 'red' ? selectedActions : aiActions;
    const blueActions = playerSide === 'blue' ? selectedActions : aiActions;

    // 模拟延迟
    setTimeout(() => {
      const newState = resolveRound(state, redActions, blueActions);
      setState(newState);
      setSelectedActions([]);
      setResolving(false);
    }, 800);
  };

  const isGameOver = state.phase === 'gameover';
  const playerWon = isGameOver && (
    (playerSide === 'red' && state.redScore > state.blueScore) ||
    (playerSide === 'blue' && state.blueScore > state.redScore) ||
    (playerSide === 'red' && state.redFlags.includes('flag_data')) ||
    (playerSide === 'blue' && state.blueFlags.includes('flag_isolate') && !state.redFlags.includes('flag_data'))
  );

  const diffLabel = difficulty === 'easy' ? '初级' : difficulty === 'medium' ? '中级' : '高级';

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800/30 bg-[#0B0F19]/80 backdrop-blur-sm">
          <button onClick={() => onEnd(playerWon || false)} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm">
            <ChevronLeft className="w-4 h-4" /> 退出
          </button>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Swords className="w-5 h-5" />
            红蓝对抗 · {diffLabel}AI
          </div>
          <span className="text-gray-400 text-sm">回合 {state.round}/{state.maxRounds}</span>
        </div>

        {/* 得分栏 */}
        <div className="flex items-center justify-center gap-8 py-4 border-b border-gray-800/30">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-400" />
            <div>
              <div className="text-xs text-gray-500">{playerSide === 'red' ? '你' : 'AI'} · 红队</div>
              <div className="text-2xl font-bold text-red-400">{state.redScore}</div>
            </div>
          </div>
          <div className="text-gray-600 text-xl font-bold">VS</div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-xs text-gray-500">{playerSide === 'blue' ? '你' : 'AI'} · 蓝队</div>
              <div className="text-2xl font-bold text-blue-400">{state.blueScore}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：操作面板 */}
          <div className="w-80 border-r border-gray-800/30 bg-[#0B0F19]/60 p-4 overflow-y-auto">
            <h3 className="text-white font-bold text-sm mb-3">
              {playerSide === 'red' ? '🔴' : '🔵'} 你的操作（选最多2个）
            </h3>
            <div className="space-y-2 stagger-in">
              {playerActions.map(action => {
                const cooldown = playerCooldowns[action.id] || 0;
                const isSelected = selectedActions.includes(action.id);
                const disabled = cooldown > 0 || resolving || isGameOver;

                return (
                  <button
                    key={action.id}
                    onClick={() => !disabled && toggleAction(action.id)}
                    disabled={disabled}
                    className={`w-full text-left p-3 rounded-lg border transition-all card-hover btn-press ${
                      isSelected
                        ? playerSide === 'red'
                          ? 'border-red-500/50 bg-red-900/20'
                          : 'border-blue-500/50 bg-blue-900/20'
                        : disabled
                        ? 'border-gray-800/30 bg-gray-900/20 opacity-40'
                        : 'border-gray-700/30 bg-gray-900/40 hover:border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{action.emoji}</span>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{action.name}</div>
                        <div className="text-gray-500 text-xs">{action.description}</div>
                      </div>
                      {cooldown > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-800/40 px-2 py-0.5 rounded">⏳{cooldown}</span>
                      )}
                      {isSelected && (
                        <span className="text-xs text-cyan-400">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 结束回合按钮 */}
            {!isGameOver && (
              <button
                onClick={handleEndTurn}
                disabled={selectedActions.length === 0 || resolving}
                className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
                  selectedActions.length > 0 && !resolving
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 cursor-pointer'
                    : 'bg-gray-800/40 text-gray-600 cursor-not-allowed'
                }`}
              >
                {resolving ? '⏳ 结算中...' : `⚔️ 结束回合 (${selectedActions.length}/2)`}
              </button>
            )}

            {/* 游戏结束 */}
            {isGameOver && (
              <div className="mt-4 space-y-3">
                <div className={`text-center p-4 rounded-xl border ${
                  playerWon
                    ? 'border-green-500/30 bg-green-900/20'
                    : 'border-red-500/30 bg-red-900/20'
                }`}>
                  <div className="text-3xl mb-2">{playerWon ? '🎉' : '💀'}</div>
                  <div className={`text-lg font-bold ${playerWon ? 'text-green-400' : 'text-red-400'}`}>
                    {playerWon ? '胜利！' : '失败！'}
                  </div>
                </div>
                <button
                  onClick={() => onEnd(playerWon || false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium hover:opacity-90"
                >
                  返回大厅
                </button>
              </div>
            )}
          </div>

          {/* 右侧：事件日志 */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-800/30">
              <h3 className="text-white font-bold text-sm">📜 战斗日志</h3>
            </div>
            <div ref={logRef} className="h-[700px] overflow-y-auto p-4 font-mono text-sm">
              {state.eventLog.map((line, i) => (
                <div key={i} className={`leading-6 ${
                  line.includes('成功') ? 'text-green-400' :
                  line.includes('失败') ? 'text-red-400' :
                  line.includes('---') ? 'text-amber-400 font-bold mt-2' :
                  line.includes('🏆') || line.includes('🛡️') ? 'text-yellow-400 font-bold text-base' :
                  line.includes('🔴') ? 'text-red-300' :
                  line.includes('🔵') ? 'text-blue-300' :
                  'text-gray-400'
                }`}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
