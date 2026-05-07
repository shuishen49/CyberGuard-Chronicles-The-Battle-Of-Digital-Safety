import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Timer, Trophy, Shield } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: Record<string, QuizQuestion[]> = {
  easy: [
    {
      question: "防火墙的主要作用是什么？",
      options: [
        "监控网络流量并阻止未授权访问",
        "提升上网速度",
        "安全地存储密码",
        "加密邮件"
      ],
      correctAnswer: 0
    },
    {
      question: "下列哪个是强密码？",
      options: [
        "password123",
        "qwerty",
        "P@ssw0rd!2023",
        "abc123"
      ],
      correctAnswer: 2
    },
    {
      question: "什么是网络钓鱼？",
      options: [
        "一种计算机病毒",
        "通过伪装成可信方来窃取个人信息的方法",
        "提升电脑速度的方法",
        "一种加密方式"
      ],
      correctAnswer: 1
    },
    {
      question: "在网络安全中，MFA 代表什么？",
      options: [
        "多因素认证（Multi-Factor Authentication）",
        "多重防火墙访问（Multiple Firewall Access）",
        "主框架授权（Main Framework Authorization）",
        "超大文件访问（Mega File Access）"
      ],
      correctAnswer: 0
    },
    {
      question: "下列哪一项是社会工程学攻击的例子？",
      options: [
        "黑客利用软件漏洞",
        "诈骗邮件诱骗用户泄露密码",
        "删除系统文件的病毒",
        "防火墙阻止未经授权的流量"
      ],
      correctAnswer: 1
    },
    {
      question: "使用公共 Wi-Fi 时，下列哪种做法是安全的？",
      options: [
        "未使用 VPN 访问银行账户",
        "使用强密码并启用双因素认证",
        "下载来源不明的文件",
        "禁用杀毒软件以提升速度"
      ],
      correctAnswer: 1
    },
    {
      question: "HTTPS 代表什么？",
      options: [
        "超文本传输安全协议（HyperText Transfer Protocol Secure）",
        "高科技传输协议系统",
        "超链接传输可信协议",
        "家庭传输技术安全协议"
      ],
      correctAnswer: 0
    },
    {
      question: "哪种恶意软件会锁住你的文件直到支付赎金？",
      options: [
        "病毒",
        "木马",
        "勒索软件",
        "间谍软件"
      ],
      correctAnswer: 2
    },
    {
      question: "防止身份盗用的最佳方法是什么？",
      options: [
        "所有账户使用同一个密码",
        "在社交媒体上分享个人信息",
        "监控财务账单并使用强密码",
        "点击收到的每个邮件链接"
      ],
      correctAnswer: 2
    },
    {
      question: "杀毒程序的主要目的是什么？",
      options: [
        "提升网速",
        "防御恶意软件和网络威胁",
        "为文件创建备份",
        "提供匿名浏览"
      ],
      correctAnswer: 1
    }
  ],
  medium: [
    {
      question: "什么是双因素认证？",
      options: [
        "使用两个不同的密码",
        "使用两个不同的用户名",
        "使用两种不同的方式验证身份",
        "使用两台不同的电脑"
      ],
      correctAnswer: 2
    },
    {
      question: "哪种加密协议被认为对网站是安全的？",
      options: [
        "HTTP",
        "HTTPS",
        "FTP",
        "SMTP"
      ],
      correctAnswer: 1
    },
    {
      question: "VPN 的用途是什么？",
      options: [
        "让网络更快",
        "安全存储文件",
        "加密上网流量并隐藏位置",
        "屏蔽所有网站"
      ],
      correctAnswer: 2
    },
    {
      question: "下列哪一项是强密码的例子？",
      options: [
        "12345678",
        "P@ssw0rd2024!",
        "qwerty123",
        "password"
      ],
      correctAnswer: 1
    },
    {
      question: "防火墙的主要作用是什么？",
      options: [
        "监控并阻止未经授权的网络流量",
        "安全存储敏感数据",
        "提升上网速度",
        "加密硬盘上的数据"
      ],
      correctAnswer: 0
    },
    {
      question: "哪种攻击通过利用人的心理来获取敏感数据？",
      options: [
        "SQL 注入",
        "社会工程学攻击",
        "暴力破解攻击",
        "拒绝服务攻击"
      ],
      correctAnswer: 1
    },
    {
      question: "下列哪一项是恶意软件的例子？",
      options: [
        "防火墙",
        "杀毒软件",
        "特洛伊木马",
        "VPN"
      ],
      correctAnswer: 2
    },
    {
      question: "保护在线个人数据最好的安全做法是什么？",
      options: [
        "在多个账户中重复使用密码",
        "点击未经请求的邮件链接",
        "及时更新软件和安全补丁",
        "禁用双因素认证"
      ],
      correctAnswer: 2
    },
    {
      question: "在网络安全中，蜜罐的作用是什么？",
      options: [
        "诱捕并分析潜在的攻击者",
        "安全存储敏感数据",
        "提升网速",
        "加密文件"
      ],
      correctAnswer: 0
    },
    {
      question: "黑客窃取密码的常用方法是？",
      options: [
        "网络钓鱼",
        "磁盘碎片整理",
        "绕过防火墙",
        "数据备份"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是勒索软件？",
      options: [
        "一种锁定文件直到支付赎金的软件",
        "一种防火墙保护方式",
        "一种安全的加密方法",
        "一种安全存储密码的方式"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是 SQL 注入攻击？",
      options: [
        "将恶意 SQL 代码插入到数据库查询中的攻击",
        "加密 SQL 数据库的方法",
        "数据库的备份方法",
        "软件升级流程"
      ],
      correctAnswer: 0
    },
    {
      question: "DDoS 攻击的作用是？",
      options: [
        "盗取用户凭据",
        "通过大量流量压垮系统从而中断服务",
        "加密文件并索取赎金",
        "检测安全漏洞"
      ],
      correctAnswer: 1
    },
    {
      question: "下列哪一项是安全浏览的例子？",
      options: [
        "使用公共 Wi-Fi 但不开 VPN",
        "在共享电脑上登录账户",
        "仅在 HTTPS 网站上输入敏感信息",
        "点击弹出广告"
      ],
      correctAnswer: 2
    },
    {
      question: "什么是入侵检测系统（IDS）？",
      options: [
        "检测并阻止网络攻击的系统",
        "一种防火墙",
        "一种安全的密码管理工具",
        "一种备份存储设备"
      ],
      correctAnswer: 0
    },
    {
      question: "存储密码最安全的方式是？",
      options: [
        "把密码写在纸上",
        "使用密码管理器",
        "保存在电脑上的文本文件中",
        "在多个网站重复使用密码"
      ],
      correctAnswer: 1
    },
    {
      question: "什么是暴力破解攻击？",
      options: [
        "通过尝试所有可能组合来猜测密码的攻击",
        "用恶意软件感染电脑的技术",
        "加密敏感数据的方法",
        "一种网络钓鱼攻击"
      ],
      correctAnswer: 0
    },
    {
      question: "“零日漏洞”指的是什么？",
      options: [
        "厂商尚不知晓且没有补丁的漏洞",
        "修复已知缺陷的系统更新",
        "阻止所有流量的防火墙规则",
        "一种网络钓鱼骗局"
      ],
      correctAnswer: 0
    },
    {
      question: "安全补丁的作用是什么？",
      options: [
        "为软件增加新功能",
        "修复安全漏洞并提升保护能力",
        "安装杀毒软件",
        "备份用户数据"
      ],
      correctAnswer: 1
    },
    {
      question: "下列哪一项是有效防止身份盗用的方法？",
      options: [
        "所有账户使用同一密码",
        "定期检查财务账单并使用双因素认证",
        "点击收到的每个邮件链接",
        "在社交媒体上发布个人详细信息"
      ],
      correctAnswer: 1
    }
  ],

  hard: [
    {
      question: "什么是零日漏洞？",
      options: [
        "已存在零天的安全漏洞",
        "厂商已知但尚未发布补丁的漏洞",
        "一种会删除所有文件的恶意软件",
        "需零天即可修复的安全漏洞"
      ],
      correctAnswer: 1
    },
    {
      question: "什么是 SQL 注入？",
      options: [
        "一种加快数据库查询的方式",
        "一种 SQL 数据库备份方法",
        "一种数据库软件",
        "通过输入字段利用数据库漏洞的技术"
      ],
      correctAnswer: 3
    },
    {
      question: "什么是中间人攻击？",
      options: [
        "有人拦截两方之间的通信",
        "针对中层管理人员的攻击",
        "只影响部分电脑的病毒",
        "一种密码破解方法"
      ],
      correctAnswer: 0
    },
    {
      question: "Rootkit 的主要目的是什么？",
      options: [
        "提升计算机性能",
        "为系统提供未经授权的特权访问",
        "扫描网络中的漏洞",
        "加密文件以便安全存储"
      ],
      correctAnswer: 1
    },
    {
      question: "哪种攻击利用 TCP 序列号的可预测性？",
      options: [
        "中间人攻击",
        "TCP 会话劫持",
        "DDoS 攻击",
        "网络钓鱼攻击"
      ],
      correctAnswer: 1
    },
    {
      question: "网络安全中蜜罐的作用是？",
      options: [
        "吸引并诱捕攻击者",
        "加快网络流量",
        "加密用户密码",
        "阻止恶意软件进入系统"
      ],
      correctAnswer: 0
    },
    {
      question: "高级持续性威胁（APT）的主要目标是？",
      options: [
        "迅速破坏系统并撤离",
        "建立长期访问权限以进行间谍活动或破坏",
        "造成临时的系统中断",
        "进行大规模垃圾邮件投递"
      ],
      correctAnswer: 1
    },
    {
      question: "哪个网络安全框架被广泛用于风险管理？",
      options: [
        "ISO 27001",
        "ITIL",
        "COBIT",
        "六西格玛"
      ],
      correctAnswer: 0
    },
    {
      question: "网络安全中的“CIA 三要素”代表什么？",
      options: [
        "网络安全、完整性、认证",
        "保密性（Confidentiality）、完整性（Integrity）、可用性（Availability）",
        "控制、调查、审计",
        "合规、情报、分析"
      ],
      correctAnswer: 1
    },
    {
      question: "什么是缓冲区溢出攻击？",
      options: [
        "用大量流量淹没网络的攻击",
        "利用程序内存管理缺陷的攻击",
        "盗取用户凭据的攻击",
        "阻止合法用户访问系统的攻击"
      ],
      correctAnswer: 1
    },
    {
      question: "什么是权限提升？",
      options: [
        "增加存储容量的方法",
        "用户获得超过预期访问权限的过程",
        "一种提升网络安全的技术",
        "一种社会工程学攻击"
      ],
      correctAnswer: 1
    },
    {
      question: "哪种恶意软件会加密用户文件并要求支付赎金？",
      options: [
        "间谍软件",
        "勒索软件",
        "特洛伊木马",
        "广告软件"
      ],
      correctAnswer: 1
    },
    {
      question: "什么是跨站脚本（XSS）？",
      options: [
        "一种从 Web 应用过滤恶意脚本的方法",
        "向 Web 应用注入恶意脚本的攻击",
        "一种提高网站加载速度的方法",
        "一种用于安全在线交易的协议"
      ],
      correctAnswer: 1
    },
    {
      question: "什么是僵尸网络（Botnet）？",
      options: [
        "用于合法计算任务的计算机网络",
        "互联的物联网设备组",
        "被攻陷并用于恶意活动的计算机网络",
        "企业使用的安全 VPN 网络"
      ],
      correctAnswer: 2
    },
    {
      question: "什么是多态病毒？",
      options: [
        "可以更改自身代码以躲避检测的病毒",
        "仅影响移动设备的病毒",
        "仅针对云服务的病毒",
        "需要用户交互才能传播的病毒"
      ],
      correctAnswer: 0
    },
    {
      question: "防火墙的主要功能是什么？",
      options: [
        "防止对网络的未授权访问",
        "检测并清除系统中的恶意软件",
        "加密网络流量",
        "管理用户认证"
      ],
      correctAnswer: 0
    },
    {
      question: "社会工程学攻击的主要目标是？",
      options: [
        "利用人的心理获取未授权访问",
        "用恶意软件感染计算机",
        "禁用网络防火墙",
        "提高社交媒体的安全性"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是竞争条件漏洞？",
      options: [
        "多个进程同时尝试访问同一资源时产生的漏洞",
        "一种快速传播的恶意软件",
        "仅影响高速网络的安全缺陷",
        "与密码加密相关的漏洞"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是物理隔离系统？",
      options: [
        "出于安全考虑与其他网络物理隔离的系统",
        "仅使用云端安全防护的系统",
        "仅在无线网络上运行的系统",
        "对所有传出流量加密的系统"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是鱼叉式钓鱼？",
      options: [
        "针对特定个人或组织的定向钓鱼攻击",
        "群发给众多收件人的普通钓鱼邮件",
        "一种提高邮件安全性的技术",
        "一种拒绝服务攻击"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是供应链攻击？",
      options: [
        "针对公司供应商或合作伙伴的攻击",
        "破坏物流网络的方法",
        "提高供应链效率的方式",
        "针对供应主管的钓鱼技术"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是双子恶意 Wi-Fi（Evil Twin）攻击？",
      options: [
        "伪装成合法 Wi-Fi 的恶意热点",
        "一种数据复制攻击",
        "针对云存储的攻击",
        "重复发送的钓鱼邮件技术"
      ],
      correctAnswer: 0
    },
    {
      question: "什么是水坑攻击（Watering Hole）？",
      options: [
        "黑客攻陷常被访问的网站",
        "使 DNS 服务器过载的方法",
        "一种拒绝服务技术",
        "针对物理网络基础设施的攻击"
      ],
      correctAnswer: 0
    }
  ]
};

const levelConfig = {
  easy: { questions: 10, time: 30, color: 'cyan', bgColor: 'cyan-600', label: '简单' },
  medium: { questions: 20, time: 25, color: 'red', bgColor: 'red-600', label: '中等' },
  hard: { questions: 30, time: 20, color: 'red', bgColor: 'red-800', label: '困难' }
};

function Quizzes() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (!selectedLevel || quizComplete) return;

    if (timeLeft > 0 && !isAnswered) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1);
    }
  }, [timeLeft, isAnswered, selectedLevel, quizComplete]);

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setTimeLeft(levelConfig[level as keyof typeof levelConfig].time);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!selectedLevel || isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(selectedIndex);

    const currentQuestion = quizQuestions[selectedLevel][currentQuestionIndex];
    if (currentQuestion && selectedIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(nextQuestion, 1500);
  };

  const nextQuestion = () => {
    if (!selectedLevel) return;

    if (currentQuestionIndex < quizQuestions[selectedLevel].length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(levelConfig[selectedLevel as keyof typeof levelConfig].time);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setSelectedLevel(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url("../BG.png")',

          }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="bg-[#0B0F19]/80 p-8 rounded-2xl backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                选择测验难度
              </h1>
            </div>

            <div className="grid gap-4">
              {Object.entries(levelConfig).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className={`w-full text-xl px-8 py-4 rounded-lg
                    bg-${config.color}-600/20 hover:bg-${config.color}-500/30
                    text-${config.color}-300 transition-all duration-300
                    border border-${config.color}-500/30 hover:border-${config.color}-400/50
                    hover:shadow-lg hover:shadow-${config.color}-500/20`}
                  style={{ textShadow: '0 0 10px rgba(6, 182, 212, 0.3)' }}
                >
                  {config.label}难度
                  <span className="block text-sm mt-1">
                    共 {config.questions} 道题 • 每题 {config.time} 秒
                  </span>
                </button>
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
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url("../BG.png")',

          }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="bg-[#0B0F19]/80 p-8 rounded-2xl backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-4">测验完成！</h2>
              <p className="text-2xl text-cyan-300 mb-8">
                你的得分：{score}/{quizQuestions[selectedLevel].length}
              </p>
              <div className="space-y-4">
                <button
                  onClick={resetQuiz}
                  className="w-full px-8 py-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300
                    transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/50"
                >
                  尝试其他难度
                </button>
                <Link
                  to="/"
                  className="block w-full px-8 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300
                    transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 text-center"
                >
                  返回菜单
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[selectedLevel][currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">题目加载失败，请重试。</p>
          <button
            onClick={resetQuiz}
            className="mt-4 px-6 py-2 bg-cyan-600/20 text-cyan-300 rounded-lg"
          >
            返回难度选择
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url("../BG.png")',
        }}
      />
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              切换难度
            </button>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-cyan-400">
                <Timer className="w-5 h-5 mr-2" />
                <span className="font-mono">{timeLeft} 秒</span>
              </div>
              <div className="flex items-center text-yellow-400">
                <Trophy className="w-5 h-5 mr-2" />
                <span>{score}/{quizQuestions[selectedLevel].length}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1F2E]/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              第 {currentQuestionIndex + 1} 题，共 {quizQuestions[selectedLevel].length} 题
            </h2>

            <p className="text-lg text-gray-200 mb-8">
              {currentQuestion.question}
            </p>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !isAnswered && handleAnswer(index)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    isAnswered
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-500/20 border-green-500'
                        : index === selectedAnswer
                        ? 'bg-red-500/20 border-red-500'
                        : 'bg-gray-800/50 border-transparent'
                      : 'bg-gray-800/50 hover:bg-gray-700/50 border-transparent'
                  } border ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                  disabled={isAnswered}
                >
                  <span className="text-gray-200">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;
