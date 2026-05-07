import { Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  icon?: React.ReactNode;
  backTo?: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
}

export default function PageLayout({ title, icon, backTo = '/', children, headerExtra }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")' }}
      />
      {/* 网格叠加 */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航 */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/10 bg-[#0B0F19]/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Link
              to={backTo}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <Home className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              {icon}
              <h1 className="text-xl font-bold text-white tracking-wide" style={{ textShadow: '0 0 15px rgba(6,182,212,0.4)' }}>
                {title}
              </h1>
            </div>
          </div>
          {headerExtra}
        </header>

        {/* 内容区域 */}
        <main className="flex-1 p-6 overflow-auto animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
