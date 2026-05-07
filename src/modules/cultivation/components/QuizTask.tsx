import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Timer, CheckCircle, XCircle, BookOpen } from 'lucide-react';

interface Props {
  category: string;
  difficulty: number;
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const ALL_QUESTIONS: Record<string, Question[]> = {
  linux: [
    { question: '哪个命令可以查看当前目录下的所有文件（包括隐藏文件）？', options: ['ls', 'ls -a', 'ls -la', 'dir'], correctAnswer: 2, explanation: 'ls -la 会列出所有文件（含隐藏文件）的详细信息，包括权限、所有者、大小等。' },
    { question: '如何在Linux中查看文件内容？', options: ['show file', 'cat file', 'view file', 'read file'], correctAnswer: 1, explanation: 'cat 是最常用的文件查看命令，也可以用 less、more、head、tail 等。' },
    { question: '哪个命令用于搜索文件中的文本内容？', options: ['find', 'locate', 'grep', 'search'], correctAnswer: 2, explanation: 'grep 用于在文件中搜索匹配的文本模式，支持正则表达式。' },
    { question: 'chmod 755 file 的含义是？', options: ['所有者rwx，组rx，其他rx', '所有者rw，组r，其他r', '所有人rwx', '所有者rwx，其他人无权限'], correctAnswer: 0, explanation: '7=rwx(4+2+1), 5=r-x(4+0+1)，所以755表示所有者读写执行，组和其他用户读和执行。' },
    { question: '如何查找系统中名为 "flag.txt" 的文件？', options: ['search flag.txt', 'find / -name flag.txt', 'locate flag.txt', 'grep flag.txt /'], correctAnswer: 1, explanation: 'find / -name flag.txt 从根目录开始查找名为flag.txt的文件。' },
    { question: '查看当前系统所有进程的命令是？', options: ['ps', 'ps aux', 'top', '进程管理器'], correctAnswer: 1, explanation: 'ps aux 显示所有用户的所有进程详细信息。' },
    { question: '如何查看某个端口是否被占用？', options: ['ping port', 'netstat -tlnp', 'ifconfig port', 'telnet port'], correctAnswer: 1, explanation: 'netstat -tlnp 显示所有TCP监听端口及对应进程。' },
    { question: '将命令输出重定向到文件（覆盖）的符号是？', options: ['>>', '>', '|', '<<'], correctAnswer: 1, explanation: '> 覆盖写入，>> 追加写入，| 是管道符。' },
    { question: '哪个命令可以解压 .tar.gz 文件？', options: ['unzip file.tar.gz', 'tar -xzf file.tar.gz', 'gzip -d file.tar.gz', 'extract file.tar.gz'], correctAnswer: 1, explanation: 'tar -xzf 中 x=解压, z=处理gzip, f=指定文件名。' },
    { question: '查看系统环境变量的命令是？', options: ['set', 'env', 'vars', 'config'], correctAnswer: 1, explanation: 'env 命令显示当前所有环境变量。' },
    { question: '如何以root权限执行命令？', options: ['root command', 'sudo command', 'su command', 'admin command'], correctAnswer: 1, explanation: 'sudo (superuser do) 以root权限执行单条命令。' },
    { question: '查看文件最后10行的命令是？', options: ['head file', 'tail file', 'end file', 'last file'], correctAnswer: 1, explanation: 'tail 默认显示最后10行，head 显示前10行。' },
    { question: 'awk命令的主要用途是？', options: ['文件压缩', '文本处理和数据提取', '网络扫描', '进程管理'], correctAnswer: 1, explanation: 'awk是强大的文本处理工具，常用于日志分析和数据提取。' },
    { question: '如何在后台运行命令？', options: ['command &', 'bg command', 'command --bg', 'run command'], correctAnswer: 0, explanation: '在命令末尾加 & 可使其在后台运行。' },
    { question: '查看磁盘使用情况的命令是？', options: ['disk', 'du -sh', 'df -h', 'both B and C'], correctAnswer: 3, explanation: 'df -h 查看文件系统磁盘空间，du -sh 查看目录/文件大小。' },
  ],
  network: [
    { question: 'TCP三次握手的正确顺序是？', options: ['SYN→ACK→FIN', 'SYN→SYN/ACK→ACK', 'ACK→SYN→FIN', 'SYN→FIN→ACK'], correctAnswer: 1, explanation: 'TCP三次握手：客户端发SYN→服务端回SYN/ACK→客户端发ACK，确认双方收发能力。' },
    { question: 'HTTP状态码403表示什么？', options: ['未找到', '服务器错误', '禁止访问', '重定向'], correctAnswer: 2, explanation: '403 Forbidden表示服务器理解请求但拒绝执行，通常是权限不足。' },
    { question: 'nmap -sS 扫描方式是？', options: ['全连接扫描', 'SYN半开扫描', 'UDP扫描', '圣诞树扫描'], correctAnswer: 1, explanation: 'SYN扫描(-sS)只发送SYN包，不完成三次握手，速度快且较隐蔽。' },
    { question: 'DNS默认使用的端口号是？', options: ['80', '443', '53', '25'], correctAnswer: 2, explanation: 'DNS使用UDP/TCP 53端口，UDP用于查询，TCP用于区域传送。' },
    { question: '哪个协议用于安全的Web通信？', options: ['HTTP', 'HTTPS', 'FTP', 'Telnet'], correctAnswer: 1, explanation: 'HTTPS = HTTP + TLS/SSL加密，在HTTP基础上增加了加密和身份验证。' },
    { question: 'ARP协议的作用是？', options: ['IP地址解析为MAC地址', 'MAC地址解析为IP地址', '域名解析为IP', 'IP解析为域名'], correctAnswer: 0, explanation: 'ARP（地址解析协议）将网络层IP地址解析为数据链路层MAC地址。' },
    { question: '192.168.1.0/24 网段最多容纳多少台主机？', options: ['128', '254', '256', '512'], correctAnswer: 1, explanation: '/24有8位主机位，2^8=256，减去网络地址和广播地址=254台。' },
    { question: 'VPN的主要作用是？', options: ['加速网络', '加密通信隧道', '拦截攻击', 'DNS解析'], correctAnswer: 1, explanation: 'VPN（虚拟专用网络）在公共网络上建立加密隧道，保护数据传输安全。' },
    { question: '哪个端口通常用于SSH服务？', options: ['21', '22', '23', '25'], correctAnswer: 1, explanation: 'SSH默认使用22端口，21=FTP, 23=Telnet, 25=SMTP。' },
    { question: 'Traceroute命令的作用是？', options: ['测试网速', '追踪数据包路径', '查看路由表', '测试连通性'], correctAnswer: 1, explanation: 'Traceroute通过递增TTL来追踪数据包到达目标所经过的每一跳路由器。' },
  ],
  web: [
    { question: 'SQL注入中，用于注释掉后续SQL语句的符号是（MySQL）？', options: ['//', '-- ', '#', '/* */'], correctAnswer: 1, explanation: '在MySQL中，-- (后面需跟空格)和#都可以注释，-- 是标准SQL注释。' },
    { question: 'XSS攻击中，存储型XSS的特点是？', options: ['只影响当前页面', '恶意脚本存储在服务器', '通过URL参数触发', '不影响其他用户'], correctAnswer: 1, explanation: '存储型XSS的恶意脚本被存储到服务器数据库中，每次用户访问都会触发，危害最大。' },
    { question: 'CSRF攻击利用的是什么机制？', options: ['服务器漏洞', '浏览器自动携带Cookie', 'DNS劫持', 'SQL注入'], correctAnswer: 1, explanation: 'CSRF利用浏览器会自动在请求中携带Cookie的机制，伪造用户操作。' },
    { question: '下列哪个不是有效的SQL注入Payload？', options: ["' OR 1=1--", "' UNION SELECT 1,2,3--", "' AND SLEEP(5)--", "<script>alert(1)</script>"], correctAnswer: 3, explanation: '<script>alert(1)</script> 是XSS payload，不是SQL注入。' },
    { question: '文件上传漏洞中，最简单的绕过方式是？', options: ['修改Content-Type', '双写扩展名', '00截断', '以上都是'], correctAnswer: 3, explanation: '这三种都是常见的文件上传绕过方式，具体取决于服务器的验证逻辑。' },
    { question: 'SSRF攻击的全称是？', options: ['Server-Side Request Forgery', 'SQL Server Request Function', 'System Security Risk Factor', 'Secure Socket Request Framework'], correctAnswer: 0, explanation: 'SSRF（服务端请求伪造）让服务器发起请求，可以访问内网资源。' },
    { question: '在SQL注入中，UNION查询的前提条件是？', options: ['知道表名', '前后SELECT列数相同', '有写权限', '数据库是MySQL'], correctAnswer: 1, explanation: 'UNION SELECT要求前后两个SELECT语句返回相同数量的列。' },
    { question: 'OWASP Top 10中排名第一的安全风险是？', options: ['XSS', 'SQL注入', 'Broken Access Control', '敏感数据泄露'], correctAnswer: 2, explanation: '2021版OWASP Top 10中，Broken Access Control（失效的访问控制）排名第一。' },
    { question: 'XXE漏洞利用的协议通常是？', options: ['HTTP', 'FTP', 'file://', '以上都可以'], correctAnswer: 3, explanation: 'XXE可以利用file://读取本地文件，http/ftp发起请求，甚至gopher协议。' },
    { question: '反序列化漏洞的根本原因是？', options: ['输入未过滤', '反序列化时执行了恶意代码', '数据库未加密', '权限配置错误'], correctAnswer: 1, explanation: '反序列化漏洞发生在应用程序反序列化不可信数据时，攻击者构造恶意对象触发代码执行。' },
  ],
  crypto: [
    { question: '对称加密和非对称加密的主要区别是？', options: ['速度不同', '密钥数量不同', '算法不同', '安全性不同'], correctAnswer: 1, explanation: '对称加密用同一密钥加解密，非对称加密用公钥加密私钥解密。' },
    { question: '下列哪个是对称加密算法？', options: ['RSA', 'AES', 'ECC', 'DSA'], correctAnswer: 1, explanation: 'AES是对称加密，RSA/ECC/DSA都是非对称加密算法。' },
    { question: 'MD5哈希的输出长度是？', options: ['64位', '128位', '256位', '512位'], correctAnswer: 1, explanation: 'MD5输出128位（32个十六进制字符）的哈希值。已不推荐用于安全场景。' },
    { question: 'Base64编码的用途是？', options: ['加密数据', '压缩数据', '将二进制转为文本', '生成哈希'], correctAnswer: 2, explanation: 'Base64将二进制数据编码为ASCII字符，常用于在文本协议中传输二进制数据。' },
    { question: '盐值（Salt）在密码存储中的作用是？', options: ['增加密码长度', '防止彩虹表攻击', '加密密码', '压缩密码'], correctAnswer: 1, explanation: 'Salt是随机字符串，附加到密码后再哈希，使得相同密码产生不同哈希值，防止彩虹表攻击。' },
  ],
  tools: [
    { question: 'Burp Suite中用于重放HTTP请求的模块是？', options: ['Proxy', 'Repeater', 'Intruder', 'Decoder'], correctAnswer: 1, explanation: 'Repeater模块用于手动修改和重放HTTP请求，测试服务器响应。' },
    { question: 'sqlmap中 --dbs 参数的作用是？', options: ['删除数据库', '枚举所有数据库', '导出数据库', '创建数据库'], correctAnswer: 1, explanation: '--dbs 让sqlmap枚举目标数据库管理系统中的所有数据库名。' },
    { question: 'Metasploit中用于监听反弹shell的模块是？', options: ['exploit/multi/handler', 'payload/reverse_tcp', 'auxiliary/scanner', 'post/multi/manage'], correctAnswer: 0, explanation: 'exploit/multi/handler 用于监听来自目标的反弹连接（reverse shell）。' },
    { question: 'Wireshark中过滤HTTP流量的显示过滤器是？', options: ['tcp.port == 80', 'http', 'filter http', 'protocol.http'], correctAnswer: 1, explanation: '在Wireshark显示过滤器中直接输入 http 即可过滤HTTP协议流量。' },
    { question: 'John the Ripper的主要用途是？', options: ['网络扫描', '密码破解', '漏洞利用', '流量分析'], correctAnswer: 1, explanation: 'John the Ripper是一款密码破解工具，支持多种哈希格式的暴力破解和字典攻击。' },
    { question: 'dirb/gobuster等工具用于？', options: ['端口扫描', '目录枚举', '漏洞扫描', '密码破解'], correctAnswer: 1, explanation: 'dirb、gobuster等是Web目录/文件枚举工具，用于发现隐藏路径。' },
  ],
  general: [
    { question: 'CIA三要素中的C代表？', options: ['Control', 'Confidentiality', 'Compliance', 'Certificate'], correctAnswer: 1, explanation: 'CIA = Confidentiality（保密性）+ Integrity（完整性）+ Availability（可用性）。' },
    { question: '零日漏洞（0-day）是指？', options: ['已修复的漏洞', '厂商未知且无补丁的漏洞', '低危漏洞', '只影响一天的漏洞'], correctAnswer: 1, explanation: '零日漏洞是指已被发现但厂商尚未知晓或尚未发布补丁的安全漏洞。' },
    { question: '社会工程学攻击利用的是？', options: ['软件漏洞', '人性弱点', '硬件故障', '网络协议'], correctAnswer: 1, explanation: '社会工程学攻击利用人的心理弱点（信任、恐惧、好奇心等）来获取敏感信息。' },
    { question: '什么是蜜罐（Honeypot）？', options: ['加密工具', '诱捕攻击者的仿真系统', '防火墙', '密码管理器'], correctAnswer: 1, explanation: '蜜罐是故意设置的诱饵系统，用于吸引、检测和分析攻击者的行为。' },
    { question: '安全渗透测试的PTES标准包含几个阶段？', options: ['3个', '5个', '7个', '10个'], correctAnswer: 2, explanation: 'PTES（渗透测试执行标准）包含7个阶段：前期交互、情报收集、威胁建模、漏洞分析、渗透利用、后渗透、报告。' },
  ],
};

export default function QuizTask({ category, difficulty, onComplete, onBack }: Props) {
  const questions = ALL_QUESTIONS[category] || ALL_QUESTIONS.general;

  const selected = useMemo(() => {
    const filtered = questions.filter((_, i) => (i % 3) + 1 <= difficulty);
    return filtered.sort(() => Math.random() - 0.5).slice(0, 5);
  }, [category, difficulty]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  // 计时器
  useEffect(() => {
    if (finished || showResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIdx, showResult, finished]);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === selected[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < selected.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const percent = Math.round((score / selected.length) * 100);
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-8">
        <div className="bg-[#0B0F19]/80 border border-cyan-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">{percent >= 60 ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {percent >= 80 ? '完美通过！' : percent >= 60 ? '顺利通过！' : '继续努力！'}
          </h2>
          <div className="text-gray-400 mb-4">
            答对 {score}/{selected.length} 题 ({percent}%)
          </div>
          <div className="text-yellow-400 text-lg mb-6">
            +{score * 10} 修为
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              返回
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90 transition-opacity"
            >
              领取奖励
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = selected[currentIdx];

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
      <div className="relative z-10 min-h-screen flex flex-col p-6 max-w-2xl mx-auto">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
            <ChevronLeft className="w-5 h-5" /> 返回
          </button>
          <div className="flex items-center gap-2 text-gray-400">
            <Timer className="w-4 h-4" />
            <span className={timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}>{timeLeft}s</span>
          </div>
          <span className="text-gray-500 text-sm">{currentIdx + 1}/{selected.length}</span>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-800/60 rounded-full h-1.5 mb-8">
          <div
            className="h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + (showResult ? 1 : 0)) / selected.length) * 100}%` }}
          />
        </div>

        {/* 题目 */}
        <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <h3 className="text-white text-lg font-medium leading-relaxed">{q.question}</h3>
          </div>

          <div className="space-y-3 stagger-in">
            {q.options.map((opt, idx) => {
              let cls = 'bg-gray-900/40 border-gray-700/30 hover:border-cyan-500/40 cursor-pointer card-hover btn-press';
              if (showResult) {
                if (idx === q.correctAnswer) {
                  cls = 'bg-green-900/20 border-green-500/50 flash-success';
                } else if (idx === selectedAnswer && idx !== q.correctAnswer) {
                  cls = 'bg-red-900/20 border-red-500/50 flash-error';
                } else {
                  cls = 'bg-gray-900/20 border-gray-800/30 opacity-50';
                }
              } else if (idx === selectedAnswer) {
                cls = 'bg-cyan-900/20 border-cyan-500/50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 animate-fade-in ${cls}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gray-800/60 flex items-center justify-center text-sm text-gray-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-gray-300">{opt}</span>
                    {showResult && idx === q.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto shrink-0" />
                    )}
                    {showResult && idx === selectedAnswer && idx !== q.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 解释 */}
        {showResult && (
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 mb-6">
            <div className="text-blue-400 text-sm font-medium mb-1">💡 解析</div>
            <div className="text-gray-400 text-sm leading-relaxed">{q.explanation}</div>
          </div>
        )}

        {/* 下一题按钮 */}
        {showResult && (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            {currentIdx < selected.length - 1 ? '下一题 →' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  );
}
