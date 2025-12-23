interface PieChartSlice {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title?: string;
  data: PieChartSlice[];
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export function PieChart({ title, data }: PieChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  // Calculate pie slices as SVG paths
  let currentAngle = -90; // Start from top
  const slices = data.map((slice, index) => {
    const percentage = (slice.value / total) * 100;
    const angle = (slice.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathD =
      angle >= 360
        ? `M 50 10 A 40 40 0 1 1 49.99 10 A 40 40 0 1 1 50 10`
        : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...slice,
      pathD,
      percentage,
      color: slice.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mt-6 mb-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}

      <div className="flex items-center gap-6">
        {/* SVG Pie Chart */}
        <svg viewBox="0 0 100 100" className="w-32 h-32 flex-shrink-0">
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.pathD}
              fill={slice.color}
              className="transition-opacity hover:opacity-80"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-gray-700">
                {slice.label}{" "}
                <span className="text-gray-500">
                  ({slice.percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

