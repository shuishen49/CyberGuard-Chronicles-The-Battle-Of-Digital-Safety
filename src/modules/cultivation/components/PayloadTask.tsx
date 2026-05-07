import { useState } from 'react';
import { ChevronLeft, Code, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface Props {
  category: string;
  difficulty: number;
  onComplete: () => void;
  onBack: () => void;
}

interface PayloadChallenge {
  title: string;
  scenario: string;
  description: string;
  hint: string;
  validationPatterns: string[];
  exampleAnswer: string;
  explanation: string;
}

const CHALLENGES: PayloadChallenge[] = [
  {
    title: 'SQL注入：绕过登录',
    scenario: '目标登录页面，用户名输入框存在SQL注入。后端SQL: SELECT * FROM users WHERE username=\'$input\' AND password=\'xxx\'',
    description: '构造一个Payload，使无论密码是否正确都能登录成功（绕过认证）。',
    hint: '用单引号闭合前面的引号，然后用 OR 让条件永远为真，--注释掉后面的语句',
    validationPatterns: ["' or 1=1", "'or 1=1", "' or '1'='1", "'or'1'='1", "' or 1=1--", "' or 1=1 #"],
    exampleAnswer: "' OR 1=1--",
    explanation: "用单引号闭合username字段，OR 1=1使WHERE条件永真，--注释掉后续的密码检查。这是最经典的SQL注入入门payload。",
  },
  {
    title: 'SQL注入：UNION查询',
    scenario: '目标搜索页面存在SQL注入，已知查询返回3列。后端SQL: SELECT id,title,content FROM articles WHERE title LIKE \'%$input%\'',
    description: '构造UNION注入Payload，查询数据库中管理员的用户名和密码。',
    hint: '使用UNION SELECT合并查询，从users表中提取数据',
    validationPatterns: ["' union select", "'union select", "union select 1,username,password", "union select 1,user,pas"],
    exampleAnswer: "' UNION SELECT 1,username,password FROM users--",
    explanation: "UNION SELECT将攻击者的查询结果合并到原始查询结果中。需要保证列数匹配（这里是3列），然后从users表中提取敏感数据。",
  },
  {
    title: 'XSS：弹窗测试',
    scenario: '目标网站的搜索框会将用户输入直接显示在页面上，未做任何过滤。',
    description: '构造一个XSS Payload，当搜索内容显示时执行JavaScript弹窗。',
    hint: '最简单的XSS payload是使用script标签',
    validationPatterns: ["<script>alert", "<script >alert", "<script > alert", "alert(1)", "alert('xss')"],
    exampleAnswer: "<script>alert(1)</script>",
    explanation: "当用户输入被直接插入HTML而不做转义时，<script>标签会被浏览器执行。alert(1)是最常见的XSS验证方法。",
  },
  {
    title: 'XSS：事件处理器绕过',
    scenario: '目标网站过滤了<script>标签，但未过滤其他HTML标签和事件处理器。',
    description: '构造不使用script标签的XSS Payload。',
    hint: '可以使用HTML标签的事件属性，如onerror、onload、onfocus等',
    validationPatterns: ["<img", "onerror", "<svg", "onload", "<body", "onfocus"],
    exampleAnswer: '<img src=x onerror=alert(1)>',
    explanation: "即使过滤了<script>标签，还有很多HTML标签支持事件处理器。img标签的onerror在图片加载失败时触发，可以执行任意JS代码。",
  },
  {
    title: '命令注入：执行系统命令',
    scenario: '目标网站的ping功能，用户输入IP地址后直接拼接到系统命令: ping -c 3 $input',
    description: '构造Payload，在ping的同时执行id命令查看当前用户权限。',
    hint: '使用分号、&&、|| 或管道符分隔多条命令',
    validationPatterns: [";id", "|id", "&&id", "||id", "; id", "| id", "&& id", "$(id)", "`id`"],
    exampleAnswer: ';id',
    explanation: "分号在shell中用于分隔多条命令。;id会在ping命令执行完后接着执行id命令。其他方式如$(id)命令替换也可以。",
  },
  {
    title: '命令注入：读取敏感文件',
    scenario: '目标网站的诊断功能存在命令注入，输入被拼接到: cat /var/log/$input.log',
    description: '构造Payload，读取 /etc/passwd 文件内容。',
    hint: '使用命令替换 $(command) 或反引号 `command` 来嵌入命令',
    validationPatterns: ["$(cat /etc/passwd)", "`cat /etc/passwd`", ";cat /etc/passwd", "|cat /etc/passwd", "&&cat /etc/passwd", "$(cat/etc/passwd)"],
    exampleAnswer: '$(cat /etc/passwd)',
    explanation: "命令替换 $(cat /etc/passwd) 会先执行内部命令并将结果替换到外部命令中。这样cat /etc/passwd的输出会被当作文件名参数。",
  },
  {
    title: '文件包含：读取系统文件',
    scenario: '目标页面URL: http://target.com/page.php?file=home，存在本地文件包含（LFI）漏洞。',
    description: '构造Payload，利用路径遍历读取 /etc/passwd 文件。',
    hint: '使用 ../ 向上跳转目录，直到到达根目录',
    validationPatterns: ["../../../etc/passwd", "....//....//....//etc/passwd", "..%2f..%2f..%2fetc/passwd", "....//etc/passwd"],
    exampleAnswer: '../../../etc/passwd',
    explanation: "通过多个 ../ 向上跳转目录层级。从Web目录（如/var/www/html）到根目录通常需要4-5个 ../ 。编码绕过时可用 %2f 代替 /。",
  },
  {
    title: '文件包含：PHP伪协议',
    scenario: '目标存在文件包含漏洞，且运行PHP环境。你想读取index.php的源代码。',
    description: '使用PHP伪协议构造Payload，以Base64编码方式读取index.php源码。',
    hint: 'php://filter 是PHP的伪协议，可以用convert.base64-encode过滤器',
    validationPatterns: ["php://filter", "convert.base64-encode", "resource=index.php"],
    exampleAnswer: 'php://filter/convert.base64-encode/resource=index.php',
    explanation: "php://filter 是PHP特有的伪协议，可以在读取文件时应用过滤器。convert.base64-encode将文件内容Base64编码，避免被当作PHP执行。",
  },
  {
    title: 'XXE：读取本地文件',
    scenario: '目标网站接受XML格式的用户数据，解析器未禁用外部实体。',
    description: '构造XXE Payload，定义外部实体读取 /etc/passwd 文件。',
    hint: '使用DOCTYPE定义外部实体，SYSTEM关键字指定文件路径',
    validationPatterns: ["<!DOCTYPE", "ENTITY", "SYSTEM", "file:///etc/passwd"],
    exampleAnswer: '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>',
    explanation: "XXE（XML外部实体注入）通过DOCTYPE定义外部实体，SYSTEM关键字指定文件路径。解析器会读取文件内容替换到实体引用位置。",
  },
  {
    title: 'SSTI：服务端模板注入',
    scenario: '目标网站使用模板引擎，用户输入直接嵌入模板渲染：Hello {{input}}',
    description: '构造SSTI Payload，测试是否存在模板注入漏洞。',
    hint: '使用数学表达式 {{7*7}} 测试是否会被计算',
    validationPatterns: ["{{7*7}}", "{{7*7", "{{ 7*7 }}", "{{7 *7}}"],
    exampleAnswer: '{{7*7}}',
    explanation: "如果页面显示 Hello 49 而不是 Hello {{7*7}}，说明输入被模板引擎执行了，存在SSTI漏洞。后续可利用执行系统命令。",
  },
];

export default function PayloadTask({ category, difficulty, onComplete, onBack }: Props) {
  const filtered = CHALLENGES.filter((c, i) => {
    if (category === 'sql_injection') return c.title.includes('SQL');
    if (category === 'xss') return c.title.includes('XSS');
    if (category === 'command_injection') return c.title.includes('命令');
    return true;
  });
  const selected = filtered.length > 0 ? filtered : CHALLENGES;
  const [taskIdx] = useState(Math.floor(Math.random() * selected.length));
  const task = selected[taskIdx] || selected[0];

  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const validate = () => {
    const normalized = input.trim().toLowerCase();
    const isMatch = task.validationPatterns.some(p => normalized.includes(p.toLowerCase()));

    if (isMatch) {
      setResult('correct');
      return;
    }
    setResult('wrong');
    setAttempts(prev => prev + 1);
  };

  if (result === 'correct') {
    return (
      <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="bg-[#0B0F19]/80 border border-green-500/20 rounded-2xl p-8 max-w-lg w-full text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Payload 构造成功！</h2>
            <div className="bg-gray-900/40 rounded-lg p-4 mb-4 text-left">
              <div className="text-cyan-400 text-sm mb-1">你的Payload：</div>
              <code className="text-green-400 text-sm break-all">{input}</code>
            </div>
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 mb-6 text-left">
              <div className="text-blue-400 text-sm font-medium mb-1">💡 原理解析</div>
              <p className="text-gray-400 text-sm leading-relaxed">{task.explanation}</p>
            </div>
            <div className="text-yellow-400 text-lg mb-6">+30 修为</div>
            <div className="flex gap-3 justify-center">
              <button onClick={onBack} className="px-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">返回</button>
              <button onClick={onComplete} className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90 transition-opacity">领取奖励</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }} />
      <div className="relative z-10 min-h-screen flex flex-col p-6 max-w-3xl mx-auto">
        {/* 顶部 */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
            <ChevronLeft className="w-5 h-5" /> 返回
          </button>
          <div className="flex items-center gap-2 text-purple-400">
            <Code className="w-5 h-5" />
            <span className="font-bold">Payload 构造挑战</span>
          </div>
        </div>

        {/* 任务卡片 */}
        <div className="bg-[#0B0F19]/80 border border-purple-500/20 rounded-2xl p-6 mb-4">
          <h3 className="text-white font-bold text-lg mb-3">🎯 {task.title}</h3>
          <div className="bg-gray-900/60 rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-500 mb-1">场景描述</div>
            <p className="text-gray-300 text-sm leading-relaxed font-mono">{task.scenario}</p>
          </div>
          <div className="text-gray-400 text-sm leading-relaxed">{task.description}</div>
        </div>

        {/* 提示 */}
        {attempts >= 2 && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-1 px-4 py-2 mb-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-900/30"
          >
            <Lightbulb className="w-4 h-4" /> 显示提示
          </button>
        )}
        {showHint && (
          <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 mb-4 text-yellow-400 text-sm">
            💡 {task.hint}
          </div>
        )}

        {/* 输入区 */}
        <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-2xl p-6">
          <label className="text-gray-400 text-sm mb-2 block">输入你的Payload：</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setResult(null); }}
              onKeyDown={e => e.key === 'Enter' && validate()}
              placeholder="在此构造你的Payload..."
              className="flex-1 bg-gray-900/60 border border-gray-700/30 rounded-lg px-4 py-3 text-green-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-600"
              spellCheck={false}
            />
            <button
              onClick={validate}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              提交
            </button>
          </div>

          {/* 错误反馈 */}
          {result === 'wrong' && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              <span>Payload不正确，再想想。{attempts >= 2 ? '试试看提示吧。' : ''}</span>
            </div>
          )}

          {/* 参考答案 */}
          {attempts >= 5 && (
            <div className="mt-4 bg-gray-900/40 rounded-lg p-3 border border-gray-800/30">
              <div className="text-xs text-gray-500 mb-1">参考答案（学习用）</div>
              <code className="text-cyan-400 text-sm">{task.exampleAnswer}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
