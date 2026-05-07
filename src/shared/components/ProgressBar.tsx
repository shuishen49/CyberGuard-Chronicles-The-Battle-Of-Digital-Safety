interface ProgressBarProps {
  current: number;
  max: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  current,
  max,
  color = 'cyan',
  height = 'h-2',
  showLabel = true,
  label,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (current / max) * 100));

  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-500 to-cyan-400',
    green: 'from-green-500 to-green-400',
    yellow: 'from-yellow-500 to-yellow-400',
    red: 'from-red-500 to-red-400',
    purple: 'from-purple-500 to-purple-400',
    orange: 'from-orange-500 to-orange-400',
    blue: 'from-blue-500 to-blue-400',
  };

  const glowMap: Record<string, string> = {
    cyan: 'shadow-cyan-500/30',
    green: 'shadow-green-500/30',
    yellow: 'shadow-yellow-500/30',
    red: 'shadow-red-500/30',
    purple: 'shadow-purple-500/30',
    orange: 'shadow-orange-500/30',
    blue: 'shadow-blue-500/30',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">{label}</span>
          <span className="text-xs text-gray-400">{current}/{max}</span>
        </div>
      )}
      <div className={`w-full bg-gray-800/60 rounded-full ${height} overflow-hidden progress-glow`}>
        <div
          className={`${height} bg-gradient-to-r ${colorMap[color] || colorMap.cyan} rounded-full shadow-lg ${glowMap[color] || glowMap.cyan} transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
