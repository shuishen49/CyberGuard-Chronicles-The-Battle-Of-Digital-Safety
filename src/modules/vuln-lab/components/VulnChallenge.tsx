import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Lightbulb, Shield, Bug, Wrench } from 'lucide-react';
import type { VulnData } from '../data/vulns';

interface Props {
  vuln: VulnData;
  onBack: () => void;
}

const PHASE_LABELS = {
  recon: { label: '信息收集', icon: '🔍', color: 'cyan' },
  discover: { label: '漏洞发现', icon: '🔎', color: 'yellow' },
  verify: { label: '漏洞验证', icon: '✅', color: 'orange' },
  exploit: { label: '漏洞利用', icon: '💥', color: 'red' },
};

export default function VulnChallenge({ vuln, onBack }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showEnv, setShowEnv] = useState(true);

  const step = vuln.steps[stepIdx];
  const phase = PHASE_LABELS[step.phase];
  const isLastStep = stepIdx === vuln.steps.length - 1;
  const allDone = completedSteps.length === vuln.steps.length;

  const checkAnswer = () => {
    const normalized = input.trim().toLowerCase();
    const isCorrect = step.expectedAnswer.some(
      ans => normalized.includes(ans.toLowerCase()) || ans.toLowerCase().includes(normalized)
    );

    if (isCorrect || normalized.length > 3) {
      setFeedback({ correct: true, message: step.explanation });
      if (!completedSteps.includes(stepIdx)) {
        setCompletedSteps(prev => [...prev, stepIdx]);
      }
    } else {
      setFeedback({ correct: false, message: '不太对，再试试看。可以使用提示按钮获取帮助。' });
    }
  };

  if (allDone) {
    return (
      <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="bg-[#0B0F19]/80 border border-green-500/20 rounded-2xl p-8 max-w-lg w-full">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">漏洞复现完成！</h2>
              <p className="text-gray-400 mt-2">{vuln.cveId} - {vuln.title}</p>
            </div>

            {/* 利用链总结 */}
            <div className="bg-gray-900/40 rounded-lg p-4 mb-4 border border-gray-800/30">
              <h3 className="text-cyan-400 font-bold text-sm mb-3">🔗 完整利用链</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {vuln.steps.map((s, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="px-2 py-1 text-xs rounded bg-gray-800/60 text-gray-300">
                      {PHASE_LABELS[s.phase].icon} {s.title}
                    </span>
                    {i < vuln.steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-600" />}
                  </span>
                ))}
              </div>
            </div>

            {/* 修复建议 */}
            <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-2">
                <Wrench className="w-4 h-4" /> 修复建议
              </div>
              <pre className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">{vuln.fixSuggestion}</pre>
            </div>

            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              返回漏洞列表
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/30 bg-[#0B0F19]/80 backdrop-blur-sm">
          <button onClick={onBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
            <ChevronLeft className="w-5 h-5" /> 返回
          </button>
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            <span className="text-white font-bold">{vuln.cveId}</span>
          </div>
          <span className="text-gray-500 text-sm">{stepIdx + 1}/{vuln.steps.length}</span>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧环境信息 */}
          {showEnv && (
            <div className="w-80 border-r border-gray-800/30 bg-[#0B0F19]/60 p-5 overflow-y-auto shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm">📋 目标信息</h3>
                <button onClick={() => setShowEnv(false)} className="text-gray-500 text-xs hover:text-gray-300">收起</button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">目标系统</div>
                  <div className="text-gray-300 text-sm">{vuln.targetInfo.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">版本</div>
                  <div className="text-red-400 text-sm font-mono">{vuln.targetInfo.version}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">漏洞描述</div>
                  <div className="text-gray-400 text-sm leading-relaxed">{vuln.targetInfo.description}</div>
                </div>
              </div>

              {/* 步骤进度 */}
              <div className="mt-6">
                <h4 className="text-gray-500 text-xs mb-3">复现进度</h4>
                <div className="space-y-2">
                  {vuln.steps.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-sm ${
                        i === stepIdx ? 'text-cyan-400' : completedSteps.includes(i) ? 'text-green-400' : 'text-gray-600'
                      }`}
                    >
                      {completedSteps.includes(i) ? (
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      ) : i === stepIdx ? (
                        <div className="w-4 h-4 rounded-full border-2 border-cyan-400 shrink-0 animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0" />
                      )}
                      <span className="truncate">{PHASE_LABELS[s.phase].icon} {s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 右侧操作区 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!showEnv && (
              <button onClick={() => setShowEnv(true)} className="text-gray-500 text-xs mb-4 hover:text-gray-300">
                ← 显示目标信息
              </button>
            )}

            {/* 步骤标题 */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{phase.icon}</span>
              <div>
                <span className={`text-xs px-2 py-0.5 rounded bg-${phase.color}-900/20 text-${phase.color}-400 border border-${phase.color}-500/20`}>
                  {phase.label}
                </span>
                <h2 className="text-white font-bold text-xl mt-1">{step.title}</h2>
              </div>
            </div>

            {/* 任务描述 */}
            <div className="bg-gray-900/40 rounded-xl p-5 mb-4 border border-gray-800/30">
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>

            {/* 提示 */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-900/30"
              >
                <Lightbulb className="w-4 h-4" /> {showHint ? '隐藏提示' : '显示提示'}
              </button>
            </div>
            {showHint && (
              <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 mb-4 text-yellow-400 text-sm">
                💡 {step.hint}
              </div>
            )}

            {/* 输入区 */}
            <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-xl p-5 mb-4">
              <label className="text-gray-400 text-sm mb-2 block">
                {step.taskType === 'quiz' ? '回答问题：' : step.taskType === 'payload_input' ? '构造Payload：' : '输入命令：'}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setFeedback(null); }}
                  onKeyDown={e => e.key === 'Enter' && checkAnswer()}
                  placeholder={
                    step.taskType === 'quiz' ? '输入你的答案...' :
                    step.taskType === 'payload_input' ? '构造你的Payload...' :
                    '输入命令...'
                  }
                  className="flex-1 bg-gray-900/60 border border-gray-700/30 rounded-lg px-4 py-3 text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-600"
                  spellCheck={false}
                />
                <button
                  onClick={checkAnswer}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium hover:opacity-90 transition-opacity"
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
                  {feedback.correct ? '正确！' : '再想想'}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feedback.message}</p>
              </div>
            )}

            {/* 导航 */}
            {feedback?.correct && (
              <button
                onClick={() => {
                  if (isLastStep) {
                    setCompletedSteps(prev => {
                      if (!prev.includes(stepIdx)) return [...prev, stepIdx];
                      return prev;
                    });
                  } else {
                    setStepIdx(prev => prev + 1);
                    setInput('');
                    setFeedback(null);
                    setShowHint(false);
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {isLastStep ? '查看复现总结 →' : '下一步 →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
