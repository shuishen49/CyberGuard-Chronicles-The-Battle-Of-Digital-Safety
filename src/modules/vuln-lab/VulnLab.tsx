import { useState } from 'react';
import { Bug, Star, Filter } from 'lucide-react';
import PageLayout from '../../shared/components/PageLayout';
import VulnChallenge from './components/VulnChallenge';
import { VULN_DATABASE } from './data/vulns';

type Category = 'all' | 'sql_injection' | 'rce' | 'file_upload' | 'xss' | 'ssrf' | 'deserialization' | 'auth_bypass' | 'info_disclosure';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'sql_injection', label: 'SQL注入' },
  { key: 'rce', label: 'RCE' },
  { key: 'file_upload', label: '文件上传' },
  { key: 'xss', label: 'XSS' },
  { key: 'ssrf', label: 'SSRF' },
  { key: 'deserialization', label: '反序列化' },
  { key: 'auth_bypass', label: '权限绕过' },
  { key: 'info_disclosure', label: '信息泄露' },
];

const DIFF_COLORS = ['', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-purple-400'];
const DIFF_LABELS = ['', '入门', '初级', '中级', '高级', '地狱'];

export default function VulnLab() {
  const [activeVuln, setActiveVuln] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('all');
  const [maxDiff, setMaxDiff] = useState(5);

  if (activeVuln) {
    const vuln = VULN_DATABASE.find(v => v.id === activeVuln);
    if (vuln) {
      return <VulnChallenge vuln={vuln} onBack={() => setActiveVuln(null)} />;
    }
  }

  const filtered = VULN_DATABASE.filter(v => {
    if (category !== 'all' && v.category !== category) return false;
    if (v.difficulty > maxDiff) return false;
    return true;
  });

  return (
    <PageLayout
      title="漏洞复现实验室"
      icon={<Bug className="w-6 h-6 text-red-400" />}
    >
      <div className="max-w-5xl mx-auto">
        {/* 筛选栏 */}
        <div className="bg-[#0B0F19]/80 border border-gray-700/30 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="text-sm">筛选：</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  category === c.key
                    ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/30'
                    : 'bg-gray-800/40 text-gray-500 border border-gray-700/30 hover:text-gray-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">难度：</span>
            <input
              type="range"
              min={1}
              max={5}
              value={maxDiff}
              onChange={e => setMaxDiff(Number(e.target.value))}
              className="w-24 accent-cyan-500"
            />
            <span className="text-xs text-gray-400">≤{maxDiff}⭐</span>
          </div>
        </div>

        {/* 漏洞卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-in">
          {filtered.map(vuln => (
            <div
              key={vuln.id}
              onClick={() => setActiveVuln(vuln.id)}
              className="group bg-[#0B0F19]/80 border border-red-500/10 hover:border-red-500/30 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/10 card-hover btn-press"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-cyan-400 font-mono text-xs mb-1">{vuln.cveId}</div>
                  <h3 className="text-white font-bold group-hover:text-cyan-300 transition-colors">{vuln.title}</h3>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: vuln.difficulty }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${DIFF_COLORS[vuln.difficulty]} fill-current`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{vuln.targetInfo.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] rounded bg-red-900/20 text-red-400 border border-red-500/20">
                    {vuln.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] rounded bg-gray-800/40 ${DIFF_COLORS[vuln.difficulty]}`}>
                    {DIFF_LABELS[vuln.difficulty]}
                  </span>
                </div>
                <span className="text-gray-600 text-xs group-hover:text-cyan-500 transition-colors">
                  {vuln.targetInfo.name} {vuln.targetInfo.version}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Bug className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无匹配的漏洞关卡</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
