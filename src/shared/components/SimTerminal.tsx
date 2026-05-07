import { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

interface SimTerminalProps {
  /** 当前工作目录提示符 */
  cwd?: string;
  /** 可接受的命令及对应输出 */
  commandMap?: Record<string, string>;
  /** 命令验证回调 */
  onCommand?: (cmd: string) => { correct: boolean; output: string; hint?: string };
  /** 是否显示提示 */
  showHint?: boolean;
  /** 当前提示文本 */
  hintText?: string;
  /** 高度 */
  height?: string;
}

const DEFAULT_COMMANDS: Record<string, string> = {
  'ls': 'bin  etc  home  lib  opt  root  tmp  usr  var',
  'ls -la': 'drwxr-xr-x  2 root root 4096 Jan  1 00:00 bin\ndrwxr-xr-x  3 root root 4096 Jan  1 00:00 etc\ndrwxr-xr-x  2 root root 4096 Jan  1 00:00 home\ndrwxr-xr-x  2 root root 4096 Jan  1 00:00 lib\ndrwxr-xr-x  2 root root 4096 Jan  1 00:00 opt\ndrwx------  2 root root 4096 Jan  1 00:00 root\ndrwxrwxrwt  2 root root 4096 Jan  1 00:00 tmp\ndrwxr-xr-x 10 root root 4096 Jan  1 00:00 usr\ndrwxr-xr-x  8 root root 4096 Jan  1 00:00 var',
  'pwd': '/root',
  'whoami': 'root',
  'id': 'uid=0(root) gid=0(root) groups=0(root)',
  'uname -a': 'Linux ctf-box 5.15.0-78-generic #85-Ubuntu SMP x86_64 GNU/Linux',
  'cat /etc/passwd': 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nmysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false',
  'ifconfig': 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\n        inet6 fe80::1  prefixlen 64  scopeid 0x20<link>\n        ether 00:0c:29:xx:xx:xx  txqueuelen 1000',
  'ip addr': '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0',
  'netstat -tlnp': 'Active Internet connections (only servers)\nProto Recv-Q Send-Q Local Address    State   PID/Program\ntcp        0      0 0.0.0.0:22      LISTEN  1234/sshd\ntcp        0      0 0.0.0.0:80      LISTEN  5678/apache2\ntcp        0      0 0.0.0.0:3306    LISTEN  9012/mysqld',
  'ps aux': 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1  33792  2104 ?        Ss   Jan01   0:01 /sbin/init\nroot      1234  0.0  0.2  72300  3456 ?        Ss   Jan01   0:00 /usr/sbin/sshd\nwww-data  5678  0.0  0.5 120456  8900 ?        S    Jan01   0:02 /usr/sbin/apache2\nmysql     9012  0.1  1.2 456789 23456 ?        Sl   Jan01   0:05 /usr/sbin/mysqld',
  'ps -ef': 'UID        PID  PPID  C STIME TTY          TIME CMD\nroot         1     0  0 Jan01 ?        00:00:01 /sbin/init\nroot      1234     1  0 Jan01 ?        00:00:00 /usr/sbin/sshd\nwww-data  5678     1  0 Jan01 ?        00:00:02 /usr/sbin/apache2',
  'hostname': 'ctf-box',
  'date': new Date().toString(),
  'uptime': ' 00:00:00 up 30 days,  1:23,  1 user,  load average: 0.00, 0.01, 0.05',
  'which python': '/usr/bin/python3',
  'which python3': '/usr/bin/python3',
  'which nmap': '/usr/bin/nmap',
  'which sqlmap': '/usr/bin/sqlmap',
  'env': 'SHELL=/bin/bash\nUSER=root\nHOME=/root\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nLANG=en_US.UTF-8\nTERM=xterm-256color',
  'history': '    1  ls\n    2  cd /var/www\n    3  cat config.php\n    4  mysql -u root -p',
  'help': '可用命令: ls, pwd, whoami, id, uname, cat, ifconfig, ip, netstat, ps, hostname, date, uptime, which, env, history, help, clear',
};

export default function SimTerminal({
  cwd = 'root@ctf-box:~',
  commandMap = {},
  onCommand,
  showHint = false,
  hintText = '',
  height = 'h-80',
}: SimTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', text: '🛡️ 网络安全模拟终端 v1.0 — 输入 help 查看可用命令' },
    { type: 'system', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const allCommands = { ...DEFAULT_COMMANDS, ...commandMap };

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    // 输入行
    setLines(prev => [...prev, { type: 'input', text: `${cwd}$ ${trimmed}` }]);

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    // 如果有自定义验证回调
    if (onCommand) {
      const result = onCommand(trimmed);
      setLines(prev => [
        ...prev,
        { type: result.correct ? 'output' : 'error', text: result.output },
      ]);
      if (result.hint) {
        setLines(prev => [...prev, { type: 'system', text: `💡 提示: ${result.hint}` }]);
      }
      return;
    }

    // 默认命令映射
    // 先精确匹配
    if (allCommands[trimmed]) {
      setLines(prev => [...prev, { type: 'output', text: allCommands[trimmed] }]);
      return;
    }

    // 前缀匹配（如 cat /etc/xxx）
    for (const [key, val] of Object.entries(allCommands)) {
      if (trimmed.startsWith(key + ' ') || trimmed === key) {
        setLines(prev => [...prev, { type: 'output', text: val }]);
        return;
      }
    }

    // cd 特殊处理
    if (trimmed.startsWith('cd ')) {
      setLines(prev => [...prev, { type: 'output', text: '' }]);
      return;
    }

    // 未知命令
    setLines(prev => [
      ...prev,
      { type: 'error', text: `bash: ${trimmed.split(' ')[0]}: command not found` },
    ]);
  }, [cwd, allCommands, onCommand]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx >= 0) {
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // 简单的 Tab 补全
      const partial = input.trim();
      if (partial) {
        const matches = Object.keys(allCommands).filter(c => c.startsWith(partial));
        if (matches.length === 1) {
          setInput(matches[0]);
        } else if (matches.length > 1) {
          setLines(prev => [
            ...prev,
            { type: 'input', text: `${cwd}$ ${partial}` },
            { type: 'system', text: matches.join('  ') },
          ]);
        }
      }
    }
  };

  return (
    <div className={`bg-gray-950 rounded-lg border border-gray-700/50 overflow-hidden font-mono text-sm ${height}`}>
      {/* 标题栏 */}
      <div className="bg-gray-800/80 px-3 py-1.5 flex items-center gap-2 border-b border-gray-700/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        <TerminalIcon className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400 text-xs">模拟终端</span>
      </div>

      {/* 终端内容 */}
      <div
        className="p-3 overflow-y-auto h-[calc(100%-2rem)] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className="leading-5 whitespace-pre-wrap break-all">
            {line.type === 'input' && (
              <span className="text-green-400">{line.text}</span>
            )}
            {line.type === 'output' && (
              <span className="text-gray-300">{line.text}</span>
            )}
            {line.type === 'error' && (
              <span className="text-red-400">{line.text}</span>
            )}
            {line.type === 'system' && (
              <span className="text-cyan-400">{line.text}</span>
            )}
          </div>
        ))}

        {/* 提示区域 */}
        {showHint && hintText && (
          <div className="text-yellow-400/70 text-xs mt-1 mb-1">💡 {hintText}</div>
        )}

        {/* 输入行 */}
        <div className="flex items-center gap-1">
          <span className="text-cyan-400">{cwd}$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none caret-green-400"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
