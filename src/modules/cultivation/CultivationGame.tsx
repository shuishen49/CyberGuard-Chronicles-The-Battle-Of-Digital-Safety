import { useState } from 'react';
import { Sparkles, Star, Gem, BookOpen, Terminal as TerminalIcon, Code } from 'lucide-react';
import PageLayout from '../../shared/components/PageLayout';
import ProgressBar from '../../shared/components/ProgressBar';
import { useGameState, REALMS } from '../../shared/hooks/useGameState';
import { useDailyTasks } from '../../shared/hooks/useDailyTasks';
import QuizTask from './components/QuizTask';
import TerminalTask from './components/TerminalTask';
import PayloadTask from './components/PayloadTask';
import RealmBreakthrough from './components/RealmBreakthrough';

export default function CultivationGame() {
  const game = useGameState();
  const daily = useDailyTasks();
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showBreakthrough, setShowBreakthrough] = useState(false);
  const [prevRealm, setPrevRealm] = useState(game.state.realm);
  const [showKnowledge, setShowKnowledge] = useState(false);

  // 检查境界突破
  const checkBreakthrough = () => {
    if (game.state.realm !== prevRealm) {
      setShowBreakthrough(true);
      setPrevRealm(game.state.realm);
    }
  };

  const handleTaskComplete = (taskId: string, exp: number) => {
    daily.completeTask(taskId);
    game.addExp(exp);
    game.completeTask(taskId);
    setActiveTask(null);
    setTimeout(checkBreakthrough, 100);
  };

  const currentRealmInfo = REALMS.find(r => r.name === game.state.realm) || REALMS[0];
  const nextRealm = REALMS.find(r => r.minLevel > game.state.level);

  const typeIcons: Record<string, React.ReactNode> = {
    quiz: <BookOpen className="w-5 h-5" />,
    terminal: <TerminalIcon className="w-5 h-5" />,
    payload: <Code className="w-5 h-5" />,
  };

  const typeColors: Record<string, string> = {
    quiz: 'from-blue-600 to-cyan-600',
    terminal: 'from-green-600 to-emerald-600',
    payload: 'from-purple-600 to-pink-600',
  };

  const diffStars = (d: number) => '⭐'.repeat(d);

  // 渲染活跃任务
  if (activeTask) {
    const task = daily.tasks.find(t => t.id === activeTask);
    if (!task) return null;

    if (task.type === 'quiz') {
      return <QuizTask
        category={task.category}
        difficulty={task.difficulty}
        onComplete={() => handleTaskComplete(task.id, task.reward.exp)}
        onBack={() => setActiveTask(null)}
      />;
    }
    if (task.type === 'terminal') {
      return <TerminalTask
        category={task.category}
        difficulty={task.difficulty}
        onComplete={() => handleTaskComplete(task.id, task.reward.exp)}
        onBack={() => setActiveTask(null)}
      />;
    }
    if (task.type === 'payload') {
      return <PayloadTask
        category={task.category}
        difficulty={task.difficulty}
        onComplete={() => handleTaskComplete(task.id, task.reward.exp)}
        onBack={() => setActiveTask(null)}
      />;
    }
  }

  return (
    <PageLayout
      title="渗透测试基础·修仙录"
      icon={<Sparkles className="w-6 h-6 text-purple-400" />}
      headerExtra={
        <div className="flex items-center gap-4 text-sm">
          <span className="text-yellow-400 flex items-center gap-1">
            <Gem className="w-4 h-4" /> {game.state.spiritStones} 灵石
          </span>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 角色面板 */}
        <div className="bg-[#0B0F19]/80 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            {/* 境界图标 */}
            <div className="text-center">
              <div className="text-5xl mb-2">{currentRealmInfo.icon}</div>
              <div className="text-purple-400 font-bold text-lg">{game.state.realm}</div>
            </div>

            {/* 属性面板 */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">修炼等级</span>
                <span className="text-white font-bold text-xl">Lv.{game.state.level}</span>
              </div>
              <ProgressBar
                current={game.progressToNext}
                max={game.progressNeeded}
                color="purple"
                label="修为进度"
              />
              {nextRealm && (
                <div className="text-xs text-gray-500">
                  距离下一境界 [{nextRealm.name}] 还需 Lv.{nextRealm.minLevel - game.state.level}
                </div>
              )}
              <div className="flex gap-4 text-sm text-gray-400">
                <span>总修为: {game.state.exp}</span>
                <span>已完成任务: {game.state.completedTasks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 每日任务 */}
        <div className="bg-[#0B0F19]/80 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              📋 每日修炼任务
              <span className="text-xs text-gray-500 font-normal">
                ({daily.completedCount}/{daily.totalCount} 完成)
              </span>
            </h2>
            {daily.allCompleted && (
              <span className="text-green-400 text-sm animate-pulse">✨ 今日修炼完成！</span>
            )}
          </div>

          <div className="space-y-3 stagger-in">
            {daily.tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 card-hover btn-press ${
                  task.completed
                    ? 'bg-green-900/10 border-green-500/20 opacity-60'
                    : 'bg-gray-900/40 border-gray-700/30 hover:border-cyan-500/40 cursor-pointer hover:bg-gray-800/40'
                }`}
                onClick={() => !task.completed && setActiveTask(task.id)}
              >
                {/* 类型图标 */}
                <div className={`p-2.5 rounded-lg bg-gradient-to-r ${typeColors[task.type]} text-white shadow-lg`}>
                  {typeIcons[task.type]}
                </div>

                {/* 任务信息 */}
                <div className="flex-1">
                  <div className="text-white font-medium">{task.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {task.type === 'quiz' ? '问答挑战' : task.type === 'terminal' ? '命令实操' : 'Payload构造'}
                    {' · '}{diffStars(task.difficulty)}
                  </div>
                </div>

                {/* 奖励 */}
                <div className="text-right text-xs">
                  <div className="text-yellow-400">+{task.reward.exp} 修为</div>
                  <div className="text-cyan-400">+{task.reward.stones} 灵石</div>
                </div>

                {/* 状态 */}
                <div className="w-16 text-center">
                  {task.completed ? (
                    <span className="text-green-400 text-sm">✅ 完成</span>
                  ) : (
                    <span className="text-cyan-400 text-sm animate-pulse">开始 →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 境界一览 */}
        <div className="bg-[#0B0F19]/80 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            🏔️ 修炼境界一览
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {REALMS.map((r) => (
              <div
                key={r.name}
                className={`text-center p-2 rounded-lg border ${
                  r.name === game.state.realm
                    ? 'border-purple-500/50 bg-purple-900/20 shadow-lg shadow-purple-500/10'
                    : game.state.level >= r.minLevel
                    ? 'border-gray-700/30 bg-gray-800/30'
                    : 'border-gray-800/20 bg-gray-900/20 opacity-40'
                }`}
              >
                <div className="text-2xl">{r.icon}</div>
                <div className="text-xs text-gray-400 mt-1">{r.name}</div>
                <div className="text-[10px] text-gray-600">Lv.{r.minLevel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 功法秘籍（知识库） */}
        <div className="bg-[#0B0F19]/80 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <button
            onClick={() => setShowKnowledge(!showKnowledge)}
            className="w-full flex items-center justify-between text-white font-bold text-lg"
          >
            <span className="flex items-center gap-2">📚 功法秘籍（知识库）</span>
            <span className="text-gray-500">{showKnowledge ? '收起' : '展开'}</span>
          </button>
          {showKnowledge && (
            <div className="mt-4 space-y-4">
              {KNOWLEDGE_BASE.map((kb, i) => (
                <div key={i} className="bg-gray-900/40 rounded-lg p-4 border border-gray-800/30">
                  <h3 className="text-cyan-400 font-bold mb-2">{kb.title}</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {kb.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-cyan-500 mt-0.5">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 境界突破动画 */}
      {showBreakthrough && (
        <RealmBreakthrough
          realm={game.state.realm}
          onClose={() => setShowBreakthrough(false)}
        />
      )}
    </PageLayout>
  );
}

const KNOWLEDGE_BASE = [
  {
    title: '🌀 炼气篇 · Linux基础命令',
    items: [
      'ls -la: 列出目录下所有文件（含隐藏文件）及详细信息',
      'cat / grep / find: 文件查看、内容搜索、文件查找三板斧',
      'chmod / chown: 文件权限管理和所有权变更',
      'ps aux / top / netstat: 进程和网络状态监控',
      'awk / sed / cut: 文本处理三剑客，日志分析必备',
    ],
  },
  {
    title: '🏗️ 筑基篇 · 网络基础',
    items: [
      'TCP/IP三次握手四次挥手: SYN→SYN/ACK→ACK',
      'nmap扫描: -sS SYN扫描、-sV版本探测、-O系统识别',
      'Wireshark过滤: tcp.flags.syn==1 过滤SYN包',
      'DNS解析流程: 本地缓存→递归服务器→根→权威',
      'HTTP请求方法: GET/POST/PUT/DELETE/PATCH/OPTIONS',
    ],
  },
  {
    title: '💊 金丹篇 · Web漏洞基础',
    items: [
      'SQL注入: 单引号闭合、UNION查询、盲注(布尔/时间)',
      'XSS: 反射型、存储型、DOM型，payload如 <script>alert(1)</script>',
      'CSRF: 跨站请求伪造，利用Cookie自动携带特性',
      '文件上传: 绕过前端验证、Content-Type伪造、.htaccess利用',
      '目录遍历: ../../etc/passwd 路径穿越读取敏感文件',
    ],
  },
  {
    title: '👶 元婴篇 · 常用Payload',
    items: [
      "SQL: ' OR 1=1-- / ' UNION SELECT 1,2,3-- / ' AND SLEEP(5)--",
      'XSS: <script>alert(1)</script> / <img onerror=alert(1) src=x>',
      '命令注入: ;id / |whoami / $(cat /etc/passwd) / `whoami`',
      '文件包含: ../../etc/passwd / php://filter/convert.base64-encode/resource=index.php',
      'XXE: <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
    ],
  },
  {
    title: '🔮 化神篇 · 渗透工具',
    items: [
      'Burp Suite: 代理拦截、Repeater重放、Intruder爆破',
      'sqlmap: 自动化SQL注入 --dbs --tables --dump',
      'Metasploit: exploit/multi/handler 监听反弹shell',
      'Nikto: Web漏洞扫描器 nikto -h http://target',
      'John/Hashcat: 密码破解 john --wordlist=rockyou.txt hash.txt',
    ],
  },
];
