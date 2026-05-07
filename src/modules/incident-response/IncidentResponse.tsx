import { useState } from 'react';
import { HeartPulse, AlertTriangle, CheckCircle } from 'lucide-react';
import PageLayout from '../../shared/components/PageLayout';
import ScenarioPlay from './components/ScenarioPlay';
import { SCENARIOS } from './data/scenarios';

const SEV_COLORS = {
  low: { bg: 'bg-green-900/20', border: 'border-green-500/30', text: 'text-green-400', bar: 'bg-green-500' },
  medium: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  high: { bg: 'bg-orange-900/20', border: 'border-orange-500/30', text: 'text-orange-400', bar: 'bg-orange-500' },
  critical: { bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-400', bar: 'bg-red-500' },
};

const TYPE_ICONS: Record<string, string> = {
  ransomware: '🔒',
  web_intrusion: '🌐',
  crypto_mining: '⛏️',
  lateral_movement: '🔗',
  data_breach: '📤',
  apt: '🕵️',
};

export default function IncidentResponse() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  if (activeScenario) {
    const scenario = SCENARIOS.find(s => s.id === activeScenario);
    if (scenario) {
      return (
        <ScenarioPlay
          scenario={scenario}
          onBack={() => { setActiveScenario(null); }}
          onComplete={(id) => { setCompleted(prev => [...prev, id]); setActiveScenario(null); }}
        />
      );
    }
  }

  return (
    <PageLayout
      title="应急响应指挥中心"
      icon={<HeartPulse className="w-6 h-6 text-green-400" />}
      headerExtra={
        <div className="text-sm text-gray-400">
          已完成 {completed.length}/{SCENARIOS.length}
        </div>
      }
    >
      <div className="max-w-5xl mx-auto">
        {/* SOC 仪表盘概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{SCENARIOS.length}</div>
            <div className="text-xs text-gray-500 mt-1">总场景数</div>
          </div>
          <div className="bg-[#0B0F19]/80 border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{completed.length}</div>
            <div className="text-xs text-gray-500 mt-1">已完成</div>
          </div>
          <div className="bg-[#0B0F19]/80 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{SCENARIOS.filter(s => s.severity === 'critical').length}</div>
            <div className="text-xs text-gray-500 mt-1">紧急事件</div>
          </div>
          <div className="bg-[#0B0F19]/80 border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">{SCENARIOS.length - completed.length}</div>
            <div className="text-xs text-gray-500 mt-1">待处理</div>
          </div>
        </div>

        {/* 场景列表 */}
        <div className="space-y-4 stagger-in">
          {SCENARIOS.map(scenario => {
            const sev = SEV_COLORS[scenario.severity];
            const isDone = completed.includes(scenario.id);

            return (
              <div
                key={scenario.id}
                onClick={() => !isDone && setActiveScenario(scenario.id)}
                className={`group relative bg-[#0B0F19]/80 border ${sev.border} rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg card-hover btn-press ${isDone ? 'opacity-50' : ''}`}
              >
                {/* 严重等级色条 */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${sev.bar}`} />

                <div className="p-5 pl-6 flex items-center gap-5">
                  {/* 类型图标 */}
                  <div className="text-3xl">{TYPE_ICONS[scenario.type] || '⚠️'}</div>

                  {/* 信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold group-hover:text-cyan-300 transition-colors">
                        {scenario.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-[10px] rounded ${sev.bg} ${sev.text} border ${sev.border}`}>
                        {scenario.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1">{scenario.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>来源: {scenario.alertInfo.source}</span>
                      <span>时间: {scenario.alertInfo.time}</span>
                    </div>
                  </div>

                  {/* 状态 */}
                  <div className="w-20 text-center">
                    {isDone ? (
                      <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                    ) : (
                      <span className="text-cyan-400 text-sm animate-pulse">处理 →</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
