import { useState } from 'react';
import { ChevronLeft, Terminal as TerminalIcon, CheckCircle, Lightbulb } from 'lucide-react';
import SimTerminal from '../../../shared/components/SimTerminal';

interface Props {
  category: string;
  difficulty: number;
  onComplete: () => void;
  onBack: () => void;
}

interface TermTask {
  title: string;
  description: string;
  hint: string;
  expectedCommands: string[];
  feedback: string;
}

const TASKS: TermTask[] = [
  {
    title: '探索系统信息',
    description: '查看当前系统的内核版本和系统信息。',
    hint: '使用 uname 命令，加 -a 参数显示所有信息',
    expectedCommands: ['uname -a'],
    feedback: '很好！uname -a 显示了完整的系统信息，包括内核版本、主机名、架构等。',
  },
  {
    title: '查看当前用户',
    description: '确认当前登录的用户身份和权限。',
    hint: 'whoami 可以显示当前用户名，id 可以显示更详细的权限信息',
    expectedCommands: ['whoami', 'id'],
    feedback: '当前是 root 用户，拥有最高权限！在渗透测试中，获取root权限通常是最终目标。',
  },
  {
    title: '查看开放端口',
    description: '服务器上运行了哪些服务？查看当前监听的网络端口。',
    hint: 'netstat 配合 -t(只显示TCP) -l(只显示监听) -n(显示数字地址) -p(显示进程名)',
    expectedCommands: ['netstat -tlnp', 'ss -tlnp'],
    feedback: '发现了三个服务：SSH(22)、Apache(80)、MySQL(3306)。Web服务和数据库都在运行，这是渗透的突破口！',
  },
  {
    title: '查找Web目录',
    description: 'Apache Web服务器的默认网站根目录在哪里？列出 /var/www/ 下的内容。',
    hint: '先用 ls 查看 /var/www/ 目录',
    expectedCommands: ['ls /var/www/', 'ls -la /var/www/', 'ls /var/www'],
    feedback: '/var/www/html/ 是Apache的默认网站根目录，Web应用的源代码就在这里。',
  },
  {
    title: '查看系统用户',
    description: '查看系统中有哪些用户账户，找出可登录的用户。',
    hint: 'cat 命令查看 /etc/passwd 文件，其中包含所有用户信息',
    expectedCommands: ['cat /etc/passwd'],
    feedback: '/etc/passwd 中可以看到所有用户。shell为 /bin/bash 或 /bin/sh 的用户可以登录系统。',
  },
  {
    title: '检查进程详情',
    description: '查看系统中运行的所有进程，找出可疑的高CPU占用进程。',
    hint: 'ps aux 可以显示所有进程的详细信息',
    expectedCommands: ['ps aux', 'ps -ef', 'top -bn1'],
    feedback: '通过ps aux可以看到每个进程的CPU和内存占用。异常高CPU的进程可能是挖矿程序。',
  },
  {
    title: '搜索日志中的登录失败',
    description: '在系统日志中搜索登录失败记录，检测是否有暴力破解攻击。',
    hint: '使用 grep 在 /var/log/auth.log 中搜索 "Failed password"',
    expectedCommands: ['grep "Failed password" /var/log/auth.log', 'grep Failed password /var/log/auth.log'],
    feedback: '发现大量登录失败记录！同一个IP的连续失败是暴力破解的典型特征。',
  },
  {
    title: '查看网络连接',
    description: '查看当前的网络连接状态，找出已建立的外部连接。',
    hint: 'netstat 配合 -an 显示所有连接，或用 ss 命令',
    expectedCommands: ['netstat -an', 'ss -tunap', 'netstat -tunap'],
    feedback: 'ESTABLISHED 状态的连接是当前活跃连接。未知的外部连接可能是C2通信或数据外泄。',
  },
  {
    title: '查找SUID文件',
    description: '查找系统中设置了SUID权限的可执行文件，这些可能被用于提权。',
    hint: '使用 find 命令，-perm 参数匹配SUID权限位(4000)',
    expectedCommands: ['find / -perm -4000 2>/dev/null', 'find / -perm -u=s 2>/dev/null'],
    feedback: 'SUID文件以文件所有者权限运行。如果找到可写的SUID文件或特殊程序，可能实现本地提权！',
  },
  {
    title: '查看定时任务',
    description: '检查系统中是否有可疑的定时任务（crontab），攻击者常用定时任务维持权限。',
    hint: 'crontab -l 查看当前用户的定时任务',
    expectedCommands: ['crontab -l', 'cat /etc/crontab', 'ls -la /etc/cron.*'],
    feedback: '定时任务是攻击者常用的持久化手段。要检查所有用户的crontab和系统级cron目录。',
  },
  {
    title: '检查异常文件',
    description: '在 /tmp 目录下查找最近24小时内修改过的文件，攻击者常在/tmp下存放恶意文件。',
    hint: 'find 命令配合 -mtime 参数查找最近修改的文件',
    expectedCommands: ['find /tmp -mtime -1', 'find /tmp -mmin -1440', 'ls -lt /tmp/'],
    feedback: '/tmp 目录默认所有人可写，是攻击者存放工具和临时文件的首选位置。',
  },
  {
    title: '查看防火墙规则',
    description: '检查当前系统的防火墙（iptables）规则。',
    hint: 'iptables -L 列出防火墙规则',
    expectedCommands: ['iptables -L', 'iptables -L -n', 'iptables -L -n -v'],
    feedback: '防火墙规则决定了哪些流量被允许或拒绝。规则为空或全部ACCEPT意味着没有防护！',
  },
];

export default function TerminalTask({ category, difficulty, onComplete, onBack }: Props) {
  const filtered = TASKS.filter((_, i) => (i % 3) + 1 <= difficulty);
  const [taskIdx] = useState(Math.floor(Math.random() * filtered.length));
  const task = filtered[taskIdx] || filtered[0];

  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleCommand = (cmd: string) => {
    const normalized = cmd.trim().toLowerCase();
    const isCorrect = task.expectedCommands.some(
      ec => ec.toLowerCase() === normalized || normalized.startsWith(ec.toLowerCase() + ' ')
    );

    if (isCorrect) {
      setCompleted(true);
      setFeedback(task.feedback);
      return { correct: true, output: '✅ 命令执行成功！' };
    }

    setAttempts(prev => prev + 1);
    const hint = attempts >= 2 ? task.hint : undefined;
    return {
      correct: false,
      output: `❌ 命令不正确，再试一次。${attempts >= 2 ? '点击下方提示按钮获取帮助。' : ''}`,
      hint,
    };
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
      <div className="relative z-10 min-h-screen flex flex-col p-6 max-w-4xl mx-auto">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
            <ChevronLeft className="w-5 h-5" /> 返回
          </button>
          <div className="flex items-center gap-2 text-green-400">
            <TerminalIcon className="w-5 h-5" />
            <span className="font-bold">终端实操任务</span>
          </div>
        </div>

        {/* 任务描述 */}
        <div className="bg-[#0B0F19]/80 border border-green-500/20 rounded-xl p-5 mb-4">
          <h3 className="text-white font-bold text-lg mb-2">📋 {task.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
        </div>

        {/* 提示按钮 */}
        {!completed && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-900/30 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? '隐藏提示' : '显示提示'}
            </button>
          </div>
        )}

        {showHint && !completed && (
          <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 mb-4 text-yellow-400 text-sm">
            💡 {task.hint}
          </div>
        )}

        {/* 终端 */}
        <SimTerminal
          onCommand={handleCommand}
          height="h-96"
          showHint={showHint}
          hintText={task.hint}
        />

        {/* 完成反馈 */}
        {completed && (
          <div className="mt-4 space-y-4">
            <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                <CheckCircle className="w-5 h-5" /> 任务完成！
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{feedback}</p>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              领取奖励 +35 修为 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
