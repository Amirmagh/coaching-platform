import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Lightweight, dependency-free chart card supporting bar, line and pie
 * charts. Data is `[{ label, value }]`. Renders inline SVG so it stays
 * responsive and RTL friendly without pulling in a chart library.
 */
export const ChartCard = ({ title, type = 'bar', data = [], color = '#0284c7', height = 200 }) => {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.value)), [data]);

  const pieSlices = useMemo(() => {
    if (type !== 'pie') return [];
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    let angle = 0;
    const palette = [color, '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];
    return data.map((d, i) => {
      const portion = (d.value / total) * Math.PI * 2;
      const startAngle = angle;
      angle += portion;
      const largeArc = portion > Math.PI ? 1 : 0;
      const x1 = 50 + 40 * Math.cos(startAngle);
      const y1 = 50 + 40 * Math.sin(startAngle);
      const x2 = 50 + 40 * Math.cos(angle);
      const y2 = 50 + 40 * Math.sin(angle);
      return {
        path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: palette[i % palette.length],
        label: d.label,
      };
    });
  }, [type, data, color]);

  const linePoints = useMemo(() => {
    if (type !== 'line' || data.length === 0) return '';
    const width = 100;
    const step = data.length > 1 ? width / (data.length - 1) : width;
    return data
      .map((d, i) => `${i * step},${100 - (d.value / max) * 90 - 5}`)
      .join(' ');
  }, [type, data, max]);

  return (
    <div className="card">
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">{title}</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">داده‌ای برای نمایش وجود ندارد.</p>
      ) : type === 'bar' ? (
        <div className="flex items-end gap-2" style={{ height }} role="img" aria-label={title}>
          {data.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{d.value}</span>
              <div
                className="w-full rounded-t"
                style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: 2 }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      ) : type === 'line' ? (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }} className="w-full" role="img" aria-label={title}>
          <polyline fill="none" stroke={color} strokeWidth="2" points={linePoints} vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 100 100" style={{ height }} className="w-1/2" role="img" aria-label={title}>
            {pieSlices.map((s) => (
              <path key={s.label} d={s.path} fill={s.color} />
            ))}
          </svg>
          <ul className="space-y-1">
            {pieSlices.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bar', 'line', 'pie']),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  color: PropTypes.string,
  height: PropTypes.number,
};

export default ChartCard;
