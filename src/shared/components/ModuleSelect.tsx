import { Link } from 'react-router-dom';
import { Shield, Swords, Bug, HeartPulse, Trophy, Sparkles } from 'lucide-react';

const modules = [
  {
    id: 'cultivation',
    title: '渗透测试基础·修仙录',
    subtitle: '从凡人到仙尊的修炼之路',
    description: '每日任务：Linux命令 + 漏洞基础 + Payload构造\n修仙题材RPG，境界突破解锁新知识',
    path: '/cultivation',
    icon: <Sparkles className="w-10 h-10" />,
    gradient: 'from-purple-600 to-indigo-600',
    borderColor: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-400/60',
    shadowColor: 'shadow-purple-500/20',
    tags: ['修仙RPG', '每日任务', '命令行实操'],
  },
  {
    id: 'vuln-lab',
    title: '漏洞复现实验室',
    subtitle: 'CNVD/CVE真实漏洞训练场',
    description: '环境还原 → 信息收集 → 漏洞挖掘 → 漏洞利用\n覆盖SQL注入到RCE的完整利用链',
    path: '/vuln-lab',
    icon: <Bug className="w-10 h-10" />,
    gradient: 'from-red-600 to-orange-600',
    borderColor: 'border-red-500/30',
    hoverBorder: 'hover:border-red-400/60',
    shadowColor: 'shadow-red-500/20',
    tags: ['CVE复现', '漏洞利用', '渗透实战'],
  },
  {
    id: 'incident-response',
    title: '应急响应指挥中心',
    subtitle: '蓝队安全分析师的战场',
    description: '告警确认 → 初步研判 → 深入分析 → 处置遏制\n日志分析、IOC提取、时间线还原',
    path: '/incident-response',
    icon: <HeartPulse className="w-10 h-10" />,
    gradient: 'from-green-600 to-teal-600',
    borderColor: 'border-green-500/30',
    hoverBorder: 'hover:border-green-400/60',
    shadowColor: 'shadow-green-500/20',
    tags: ['应急响应', '日志分析', '蓝队防御'],
  },
  {
    id: 'arena',
    title: '红蓝对抗擂台',
    subtitle: '实时攻防博弈',
    description: '红队攻击 vs 蓝队防御\n回合制策略对战，含AI对手',
    path: '/arena',
    icon: <Swords className="w-10 h-10" />,
    gradient: 'from-amber-600 to-yellow-600',
    borderColor: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-400/60',
    shadowColor: 'shadow-amber-500/20',
    tags: ['红蓝对抗', '策略博弈', 'AI对战'],
  },
];

export default function ModuleSelect() {
  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }}
      />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-cyan-400 animate-float" />
            <h1
              className="text-5xl font-bold text-white tracking-wider"
              style={{ textShadow: '0 0 30px rgba(6,182,212,0.5)' }}
            >
              网络卫士传奇
            </h1>
            <Trophy className="w-10 h-10 text-yellow-400 animate-float" style={{ animationDelay: '1s' }} />
          </div>
          <p className="text-gray-400 text-lg">红蓝对抗 · 网络安全实战训练平台</p>
        </div>

        {/* 模块卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full stagger-in">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              to={mod.path}
              className={`group relative bg-[#0B0F19]/80 backdrop-blur-sm rounded-2xl p-6 border ${mod.borderColor} ${mod.hoverBorder} transition-all duration-300 hover:shadow-2xl ${mod.shadowColor} hover:-translate-y-1 card-hover btn-press`}
            >
              {/* 发光边框效果 */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${mod.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${mod.gradient} text-white shadow-lg ${mod.shadowColor}`}>
                    {mod.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {mod.title}
                    </h2>
                    <p className="text-cyan-400/70 text-sm">{mod.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {mod.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs rounded-full bg-gray-800/60 text-gray-400 border border-gray-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 右下角箭头 */}
              <div className="absolute bottom-4 right-4 text-gray-600 group-hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>选择模块开始你的网络安全修炼之旅 🛡️</p>
        </div>
      </div>
    </div>
  );
}
