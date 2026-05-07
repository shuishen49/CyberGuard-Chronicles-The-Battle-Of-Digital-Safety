import { useState } from 'react';
import { ChevronLeft, CheckCircle, AlertTriangle, Search, Shield, FileText, Wrench, ClipboardCheck } from 'lucide-react';
import LogViewer from './LogViewer';
import type { ScenarioData } from '../data/scenarios';

interface Props {
  scenario: ScenarioData;
  onBack: () => void;
  onComplete: (id: string) => void;
}

const PHASE_CONFIG = {
  confirm: { label: '告警确认', icon: <AlertTriangle className="w-4 h-4" />, color: 'cyan' },
  triage: { label: '初步研判', icon: <Search className="w-4 h-4" />, color: 'yellow' },
  analyze: { label: '深入分析', icon: <FileText className="w-4 h-4" />, color: 'orange' },
  contain: { label: '处置遏制', icon: <Wrench className="w-4 h-4" />, color: 'red' },
  review: { label: '复盘总结', icon: <ClipboardCheck className="w-4 h-4" />, color: 'green' },
};

export default function ScenarioPlay({ scenario, onBack, onComplete }: Props) {
  const [activePhase, setActivePhase] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [showEvidence, setShowEvidence] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

  const step = scenario.steps[activePhase];
  const phase = PHASE_CONFIG[step.phase];
  const isLastPhase = activePhase === scenario.steps.length - 1;
  const allDone = completedPhases.length === scenario.steps.length;

  const checkAnswer = () => {
    const norm = input.trim().toLowerCase();
    const isCorrect = step.expectedAnswer.some(
      ans => norm.includes(ans.toLowerCase()) || ans.toLowerCase().includes(norm)
    );
    if (isCorrect || norm.length > 2) {
      setFeedback({ correct: true, msg: step.explanation });
      if (!completedPhases.includes(activePhase)) {
        setCompletedPhases(prev => [...prev, activePhase]);
        setTotalScore(prev => prev + step.score);
      }
    } else {
      setFeedback({ correct: false, msg: '答案不太对，再看看证据材料。' });
    }
  };

  // 全部完成 - 显示报告
  if (allDone) {
    return (
      <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="bg-[#0B0F19]/80 border border-green-500/20 rounded-2xl p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">应急响应完成！</h2>
              <p className="text-gray-400 mt-2">{scenario.title}</p>
              <div className="text-3xl font-bold text-cyan-400 mt-4">{totalScore} 分</div>
            </div>

            {/* 攻击时间线 */}
            <div className="bg-gray-900/40 rounded-lg p-5 mb-4 border border-gray-800/30">
              <h3 className="text-cyan-400 font-bold text-sm mb-4">📅 攻击时间线</h3>
              <div className="space-y-3">
                {scenario.timeline.map((evt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="text-gray-500 text-xs font-mono">{evt.timestamp}</span>
                      <div className="text-gray-300 text-sm">{evt.event}</div>
                      {evt.indicator !== 'N/A' && (
                        <span className="text-red-400 text-xs font-mono">{evt.indicator}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onComplete(scenario.id)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              完成并返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部 */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800/30 bg-[#0B0F19]/80 backdrop-blur-sm">
          <button onClick={onBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm">
            <ChevronLeft className="w-4 h-4" /> 返回
          </button>
          <div className="text-white font-bold text-sm">{scenario.title}</div>
          <div className="text-yellow-400 text-sm font-bold">{totalScore}分</div>
        </div>

        {/* 阶段Tab */}
        <div className="flex border-b border-gray-800/30 bg-[#0B0F19]/60 overflow-x-auto">
          {scenario.steps.map((s, i) => {
            const p = PHASE_CONFIG[s.phase];
            return (
              <button
                key={i}
                onClick={() => { setActivePhase(i); setInput(''); setFeedback(null); }}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm shrink-0 border-b-2 transition-colors ${
                  i === activePhase
                    ? 'border-cyan-500 text-cyan-400'
                    : completedPhases.includes(i)
                    ? 'border-green-500/50 text-green-400/70'
                    : 'border-transparent text-gray-600'
                }`}
              >
                {completedPhases.includes(i) ? <CheckCircle className="w-3.5 h-3.5" /> : p.icon}
                <span className="hidden md:inline">{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧：证据面板 */}
          <div className="w-80 border-r border-gray-800/30 bg-[#0B0F19]/60 p-4 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">📋 证据材料</h3>
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                {showTimeline ? '查看证据' : '查看时间线'}
              </button>
            </div>

            {showTimeline ? (
              <div className="space-y-3">
                {scenario.timeline.map((evt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="text-gray-500 font-mono">{evt.timestamp}</span>
                      <div className="text-gray-400">{evt.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {scenario.evidence.map((ev, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setShowEvidence(showEvidence === i ? null : i)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        showEvidence === i
                          ? 'bg-gray-800/60 text-white'
                          : 'bg-gray-900/40 text-gray-400 hover:bg-gray-800/40'
                      }`}
                    >
                      {ev.type === 'log' ? '📄' : ev.type === 'process_list' ? '⚙️' : '📁'} {ev.name}
                    </button>
                    {showEvidence === i && (
                      <div className="mt-2">
                        <LogViewer content={ev.content} name={ev.name} type={ev.type} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 告警信息 */}
            <div className="mt-4 bg-red-900/10 border border-red-500/20 rounded-lg p-3">
              <div className="text-red-400 text-xs font-bold mb-1">🚨 告警信息</div>
              <div className="text-gray-400 text-xs space-y-1">
                <div>来源: {scenario.alertInfo.source}</div>
                <div>时间: {scenario.alertInfo.time}</div>
                <div>摘要: {scenario.alertInfo.summary}</div>
              </div>
            </div>
          </div>

          {/* 右侧：任务区 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 阶段标题 */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`p-2 rounded-lg bg-${phase.color}-900/20 text-${phase.color}-400`}>
                {phase.icon}
              </span>
              <div>
                <span className={`text-xs px-2 py-0.5 rounded bg-${phase.color}-900/20 text-${phase.color}-400`}>
                  {phase.label}
                </span>
                <h2 className="text-white font-bold text-lg mt-1">{step.title}</h2>
              </div>
              <span className="ml-auto text-sm text-yellow-400">+{step.score}分</span>
            </div>

            {/* 任务描述 */}
            <div className="bg-gray-900/40 rounded-xl p-5 mb-4 border border-gray-800/30">
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>

            {/* 输入区 */}
            <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-xl p-5 mb-4">
              <label className="text-gray-400 text-sm mb-2 block">你的分析结论：</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setFeedback(null); }}
                  onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  placeholder="输入关键信息或答案..."
                  className="flex-1 bg-gray-900/60 border border-gray-700/30 rounded-lg px-4 py-3 text-green-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-600"
                  spellCheck={false}
                />
                <button
                  onClick={checkAnswer}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  提交
                </button>
              </div>
            </div>

            {/* 反馈 */}
            {feedback && (
              <div className={`rounded-xl p-5 mb-4 ${
                feedback.correct
                  ? 'bg-green-900/10 border border-green-500/20'
                  : 'bg-red-900/10 border border-red-500/20'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${
                  feedback.correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  {feedback.correct ? <CheckCircle className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {feedback.correct ? '分析正确！' : '需要更多证据'}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feedback.msg}</p>
              </div>
            )}

            {/* 下一步 */}
            {feedback?.correct && (
              <button
                onClick={() => {
                  if (isLastPhase) {
                    setCompletedPhases(prev => {
                      if (!prev.includes(activePhase)) return [...prev, activePhase];
                      return prev;
                    });
                  } else {
                    setActivePhase(prev => prev + 1);
                    setInput('');
                    setFeedback(null);
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {isLastPhase ? '查看应急报告 →' : '下一阶段 →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
