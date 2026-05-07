import { useState } from 'react';
import { Swords, Shield, Flame, Trophy, Target } from 'lucide-react';
import PageLayout from '../../shared/components/PageLayout';
import BattleField from './components/BattleField';

export default function Arena() {
  const [side, setSide] = useState<'red' | 'blue' | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [inBattle, setInBattle] = useState(false);
  const [stats, setStats] = useState({ wins: 0, losses: 0 });

  if (inBattle && side) {
    return (
      <BattleField
        playerSide={side}
        difficulty={difficulty}
        onEnd={(won) => {
          setStats(prev => ({
            wins: won ? prev.wins + 1 : prev.wins,
            losses: won ? prev.losses : prev.losses + 1,
          }));
          setInBattle(false);
        }}
      />
    );
  }

  const winRate = stats.wins + stats.losses > 0
    ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
    : 0;

  return (
    <PageLayout
      title="红蓝对抗擂台"
      icon={<Swords className="w-6 h-6 text-amber-400" />}
      headerExtra={
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-400">胜: {stats.wins}</span>
          <span className="text-red-400">负: {stats.losses}</span>
          <span className="text-yellow-400">胜率: {winRate}%</span>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 选择阵营 */}
        <div className="bg-[#0B0F19]/80 border border-amber-500/20 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            选择你的阵营
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSide('red')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                side === 'red'
                  ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20'
                  : 'border-gray-700/30 bg-gray-900/20 hover:border-red-500/30'
              }`}
            >
              <Flame className={`w-12 h-12 mx-auto mb-3 ${side === 'red' ? 'text-red-400' : 'text-gray-500'}`} />
              <h3 className="text-white font-bold text-lg">红队 · 攻击方</h3>
              <p className="text-gray-500 text-sm mt-2">信息收集→漏洞利用→权限提升→横向移动</p>
            </button>
            <button
              onClick={() => setSide('blue')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                side === 'blue'
                  ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700/30 bg-gray-900/20 hover:border-blue-500/30'
              }`}
            >
              <Shield className={`w-12 h-12 mx-auto mb-3 ${side === 'blue' ? 'text-blue-400' : 'text-gray-500'}`} />
              <h3 className="text-white font-bold text-lg">蓝队 · 防御方</h3>
              <p className="text-gray-500 text-sm mt-2">监控告警→分析研判→封堵处置→漏洞修复</p>
            </button>
          </div>
        </div>

        {/* 难度选择 */}
        <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4">AI对手难度</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'easy' as const, label: '初级AI', desc: '随机操作，适合新手', color: 'green', icon: '🟢' },
              { key: 'medium' as const, label: '中级AI', desc: '基本策略，有攻有防', color: 'yellow', icon: '🟡' },
              { key: 'hard' as const, label: '高级AI', desc: '智能反制，攻防兼备', color: 'red', icon: '🔴' },
            ].map(d => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`p-4 rounded-xl border transition-all ${
                  difficulty === d.key
                    ? `border-${d.color}-500/50 bg-${d.color}-900/20`
                    : 'border-gray-700/30 bg-gray-900/20 hover:border-gray-600/30'
                }`}
              >
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="text-white font-bold text-sm">{d.label}</div>
                <div className="text-gray-500 text-xs mt-1">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          disabled={!side}
          onClick={() => setInBattle(true)}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
            side
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 shadow-lg shadow-amber-500/20 cursor-pointer'
              : 'bg-gray-800/40 text-gray-600 cursor-not-allowed'
          }`}
        >
          {side ? '⚔️ 开始对战！' : '请先选择阵营'}
        </button>

        {/* 规则说明 */}
        <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-3">📜 对战规则</h2>
          <div className="text-gray-400 text-sm space-y-2">
            <p>• 回合制对战，每回合双方各选1-2个操作</p>
            <p>• 操作有冷却时间，高级操作需等待更多回合</p>
            <p>• <span className="text-red-400">红队目标</span>：获取Flag/提取数据/控制域控</p>
            <p>• <span className="text-blue-400">蓝队目标</span>：检测攻击/阻断入侵/修复漏洞</p>
            <p>• 10回合后按得分判定胜负</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
