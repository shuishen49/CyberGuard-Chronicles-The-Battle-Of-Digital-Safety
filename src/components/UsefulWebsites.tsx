import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, ExternalLink, Globe, Lock, Terminal, Book, Users, Code, Shield as ShieldIcon } from 'lucide-react';

function UsefulWebsites() {
  const websites = [
    {
      title: "OWASP",
      description: "开放式 Web 应用程序安全项目®，为 Web 安全提供免费的工具、资源和社区支持。",
      category: "安全标准",
      icon: Shield,
      link: "https://owasp.org/"
    },
    {
      title: "HackerOne",
      description: "漏洞赏金平台，连接企业与网络安全研究人员，发现并修复漏洞。",
      category: "漏洞赏金",
      icon: Terminal,
      link: "https://www.hackerone.com/"
    },
    {
      title: "Have I Been Pwned",
      description: "查询你的邮箱或手机号是否在数据泄露中。免费监控全球数据泄露事件。",
      category: "安全检查",
      icon: Lock,
      link: "https://haveibeenpwned.com/"
    },
    {
      title: "Cybrary",
      description: "面向所有水平用户的免费在线网络安全培训和认证课程。",
      category: "学习资源",
      icon: Book,
      link: "https://www.cybrary.it/"
    },
    {
      title: "VirusTotal",
      description: "分析可疑文件、域名、IP 和 URL，检测恶意软件和其他安全问题。",
      category: "安全工具",
      icon: ShieldIcon,
      link: "https://www.virustotal.com/"
    },
    {
      title: "ExploitDB",
      description: "由 Offensive Security 维护的公开漏洞利用代码及对应漏洞软件存档。",
      category: "安全研究",
      icon: Code,
      link: "https://www.exploit-db.com/"
    },
    {
      title: "Security Headers",
      description: "通过该扫描工具分析并改善网站的安全响应头。",
      category: "Web 安全",
      icon: Globe,
      link: "https://securityheaders.com/"
    },
    {
      title: "Bleeping Computer",
      description: "提供网络安全、恶意软件以及技术支持等最新资讯与资源。",
      category: "新闻资讯",
      icon: Terminal,
      link: "https://www.bleepingcomputer.com/"
    },
    {
      title: "Reddit r/netsec",
      description: "围绕网络与信息安全的社区讨论。",
      category: "社区交流",
      icon: Users,
      link: "https://www.reddit.com/r/netsec/"
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
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0B0F19]/80 p-8 rounded-2xl backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                实用网络安全网站
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((site, index) => {
                const IconComponent = site.icon;
                return (
                  <div
                    key={index}
                    className="bg-cyan-600/10 rounded-lg p-6 border border-cyan-500/30 hover:border-cyan-400/50
                      transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-xl font-bold text-white">{site.title}</h3>
                    </div>

                    <p className="text-gray-300 mb-4 h-20">{site.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyan-400">{site.category}</span>
                      <a
                        href={site.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-500/30
                          text-cyan-300 px-4 py-2 rounded-lg transition-colors"
                      >
                        访问网站 <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              返回菜单
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsefulWebsites;
