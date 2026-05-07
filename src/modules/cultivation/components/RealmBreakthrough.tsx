import { useEffect, useState } from 'react';

interface Props {
  realm: string;
  onClose: () => void;
}

const REALM_DESC: Record<string, string> = {
  '凡人': '初入安全世界，一切从零开始',
  '炼气期': '掌握了Linux基础命令，踏入修炼之门',
  '筑基期': '网络基础扎实，根基稳固',
  '金丹期': 'Web漏洞初窥，凝结安全之丹',
  '元婴期': 'Payload构造精通，化出安全元婴',
  '化神期': '渗透工具熟练运用，神通初显',
  '大乘期': '渗透方法论融会贯通，接近大道',
  '仙尊期': '安全之道大成，成就仙尊之位',
};

export default function RealmBreakthrough({ realm, onClose }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* 粒子效果（CSS模拟） */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`gold-${i}`}
            className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* 光环 */}
      <div className="absolute w-80 h-80 rounded-full bg-purple-500/10 animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute w-60 h-60 rounded-full bg-cyan-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

      {/* 内容 */}
      <div className={`relative z-10 text-center ${show ? 'animate-bounce-in' : 'opacity-0 scale-50'}`}>
        <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
          {getRealmEmoji(realm)}
        </div>
        <div className="text-yellow-400 text-lg mb-2 tracking-widest">✦ 境界突破 ✦</div>
        <h1 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 0 40px rgba(168,85,247,0.6)' }}>
          {realm}
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          {REALM_DESC[realm] || '新的境界，新的力量'}
        </p>
        <div className="mt-8 text-gray-500 text-sm animate-pulse">点击任意处继续</div>
      </div>
    </div>
  );
}

function getRealmEmoji(realm: string): string {
  const map: Record<string, string> = {
    '凡人': '👤',
    '炼气期': '🌀',
    '筑基期': '🏗️',
    '金丹期': '💊',
    '元婴期': '👶',
    '化神期': '🔮',
    '大乘期': '⚡',
    '仙尊期': '👑',
  };
  return map[realm] || '✨';
}
