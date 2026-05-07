import { useState, useRef } from 'react';
import { Search } from 'lucide-react';

interface Props {
  content: string;
  name: string;
  type: string;
}

export default function LogViewer({ content, name, type }: Props) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const lines = content.split('\n');

  const handleSearch = (term: string) => {
    setSearch(term);
    if (!term) {
      setSearchResults([]);
      return;
    }
    const matches: number[] = [];
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes(term.toLowerCase())) {
        matches.push(i);
      }
    });
    setSearchResults(matches);
  };

  const highlightLine = (line: string) => {
    if (!search) return line;
    const parts = line.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={i} className="bg-yellow-500/30 text-yellow-300 px-0.5 rounded">{part}</mark>
      ) : part
    );
  };

  // 自动高亮IOC
  const highlightIOC = (text: React.ReactNode): React.ReactNode => {
    if (typeof text !== 'string') return text;
    // IP地址
    const ipPattern = /(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/g;
    // 简单处理
    return text;
  };

  return (
    <div className="bg-gray-950 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* 标题栏 */}
      <div className="bg-gray-800/80 px-4 py-2 flex items-center justify-between border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${type === 'log' ? 'bg-green-500' : type === 'process_list' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
          <span className="text-gray-300 text-sm font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="搜索..."
              className="bg-gray-900/60 border border-gray-700/30 rounded pl-7 pr-3 py-1 text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50 w-40"
            />
          </div>
          {search && (
            <span className="text-xs text-gray-500">{searchResults.length} 个匹配</span>
          )}
        </div>
      </div>

      {/* 日志内容 */}
      <div ref={containerRef} className="p-3 overflow-auto max-h-80 font-mono text-xs">
        {lines.map((line, i) => {
          const isMatch = searchResults.includes(i);
          return (
            <div
              key={i}
              className={`flex leading-5 ${isMatch ? 'bg-yellow-500/10' : ''}`}
            >
              <span className="text-gray-600 w-8 text-right mr-3 shrink-0 select-none">{i + 1}</span>
              <span className={`whitespace-pre-wrap break-all ${
                line.includes('[SUSPICIOUS]') || line.includes('异常') || line.includes('恶意')
                  ? 'text-red-400'
                  : line.includes('<--')
                  ? 'text-red-400 font-bold'
                  : 'text-gray-300'
              }`}>
                {highlightLine(highlightIOC(line) as string)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
