import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, ExternalLink } from 'lucide-react';

function MoreGames() {
  const games = [
    {
      title: "网络防御模拟",
      description: "在实时场景中保护你的网络，抵御来袭的网络攻击。",
      difficulty: "中等",
      category: "策略",
      link: "https://play.google.com/store/apps/details?id=cyber.security.learn.programming.coding.hacking.software.development.cybersecurity&hl=en"
    },
    {
      title: "破译挑战",
      description: "在限定时间内解开复杂代码，阻止数据泄露事件发生。",
      difficulty: "困难",
      category: "解谜",
      link: "https://www.hackthebox.com/"
    },
    {
      title: "安全专家训练",
      description: "通过互动挑战学习网络安全基础知识。",
      difficulty: "简单",
      category: "教育",
      link: "https://owasp.org/www-community/Initiatives/"
    },
    {
      title: "钓鱼狂潮",
      description: "在企业环境中识别并阻止钓鱼攻击。",
      difficulty: "中等",
      category: "模拟",
      link: "https://www.knowbe4.com/"
    },
    {
      title: "防火墙堡垒",
      description: "在压力下配置并维护网络安全系统。",
      difficulty: "困难",
      category: "策略",
      link: "https://www.tryhackme.com/"
    },
    {
      title: "数据守护者",
      description: "保护敏感信息免受复杂的入侵攻击。",
      difficulty: "专家",
      category: "解谜",
      link: "https://www.root-me.org/"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url("../BG.png")',
          filter: 'blur(3px)'
        }}
      />
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0B0F19]/80 p-8 rounded-2xl backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                网络安全游戏
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-cyan-600/10 rounded-lg p-6 border border-cyan-500/30 hover:border-cyan-400/50
                  transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 h-full"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">{game.title}</h3>
                    <p className="text-gray-400 mb-4">{game.description}</p>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm text-cyan-400">{game.category}</span>
                      <span className="text-sm text-yellow-400">{game.difficulty}</span>
                    </div>
                  </div>
                  <a
                    href={game.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-cyan-600/20 hover:bg-cyan-500/30
                    text-cyan-300 py-2 rounded-lg transition-colors"
                  >
                    立即游玩 <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Link
                to="/"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                返回菜单
              </Link>
              <div className="text-sm text-cyan-600">
                外部链接将在新标签页中打开。游戏由合作平台提供。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoreGames;
