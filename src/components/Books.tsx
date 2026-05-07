import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, ExternalLink, BookOpen } from 'lucide-react';

function Books() {
  const books = [
    {
      title: "隐身的艺术（The Art of Invisibility）",
      author: "凯文·米特尼克（Kevin Mitnick）",
      description: "世界上最著名的黑客向你传授在“老大哥”和大数据时代下，普通公民和消费者轻松隐匿身份与反制措施的方法。",
      level: "中级",
      category: "隐私与安全",
      link: "https://www.amazon.com/Art-Invisibility-Worlds-Famous-Hacker/dp/0316380504",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1470"
    },
    {
      title: "线上幽灵（Ghost in the Wires）",
      author: "凯文·米特尼克（Kevin Mitnick）",
      description: "这本扣人心弦的回忆录详述了世界头号通缉黑客的传奇经历及最终被捕的过程。",
      level: "初级",
      category: "人物传记",
      link: "https://www.amazon.com/Ghost-Wires-Adventures-Worlds-Wanted/dp/0316037729",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1470"
    },
    {
      title: "社会工程学：人类黑客的科学",
      author: "克里斯托弗·哈德纳吉（Christopher Hadnagy）",
      description: "深入剖析社会工程学背后的心理学原理，以及如何防御被操纵。",
      level: "高级",
      category: "社会工程学",
      link: "https://www.amazon.com/Social-Engineering-Science-Human-Hacking/dp/111943338X",
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=1469"
    },
    {
      title: "实用恶意软件分析",
      author: "Michael Sikorski 与 Andrew Honig",
      description: "动手实践的指南，教你剖析恶意软件、理解其行为并阻止其传播。",
      level: "专家",
      category: "恶意软件分析",
      link: "https://www.amazon.com/Practical-Malware-Analysis-Hands-Dissecting/dp/1593272901",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=2670"
    },
    {
      title: "应用密码学",
      author: "布鲁斯·施奈尔（Bruce Schneier）",
      description: "全面介绍加密、数字签名以及保护数字信息所用的其他密码学工具。",
      level: "高级",
      category: "密码学",
      link: "https://www.amazon.com/Applied-Cryptography-Protocols-Algorithms-Source/dp/1119096723",
      image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&q=80&w=1694"
    },
    {
      title: "Web 应用黑客手册",
      author: "Dafydd Stuttard 与 Marcus Pinto",
      description: "通过实用案例与解决方案，讲解如何在 Web 应用中发现并利用安全漏洞。",
      level: "中级",
      category: "Web 安全",
      link: "https://www.amazon.com/Web-Application-Hackers-Handbook-Exploiting/dp/1118026470",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1470"
    }
  ];

  const getLevelColor = (level: string) => {
    const colors = {
      初级: 'text-green-400',
      中级: 'text-yellow-400',
      高级: 'text-orange-400',
      专家: 'text-red-400'
    };
    return colors[level as keyof typeof colors] || 'text-gray-400';
  };

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
              <Shield className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                网络安全推荐书籍
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-cyan-500/30 hover:border-cyan-400/50
                    transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${book.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/90 to-transparent" />

                  <div className="relative p-6 h-full flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                        <span className={getLevelColor(book.level)}>{book.level}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">作者：{book.author}</p>
                      <p className="text-gray-300 mb-4 line-clamp-3">{book.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cyan-400">{book.category}</span>
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-500/30
                          text-cyan-300 px-4 py-2 rounded-lg transition-colors"
                      >
                        查看图书 <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
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

export default Books;
