import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SparklineProps {
  data: (number | null)[];
  color: string;
  width: number;
  height?: number;
}

/**
 * Minimal SVG sparkline. Null values break the line.
 * Includes a subtle gradient fill below each segment.
 */
export function Sparkline({ data, color, width, height = 44 }: SparklineProps) {
  const values = data.filter((v): v is number => v !== null);
  if (values.length < 2 || width === 0) return null;

  const pad = 3;
  const chartW = width - pad * 2;
  const chartH = height - pad * 2;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max === min ? 1 : max - min;

  const xAt = (i: number) => pad + (i / (data.length - 1)) * chartW;
  const yAt = (v: number) => pad + chartH - ((v - min) / range) * chartH;

  // Build line path (M on first point of each segment, L thereafter)
  let linePath = '';
  let newSeg = true;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v === null) { newSeg = true; continue; }
    const x = xAt(i);
    const y = yAt(v);
    linePath += newSeg ? `M ${x} ${y} ` : `L ${x} ${y} `;
    newSeg = false;
  }

  // Build fill path — close each contiguous segment to the bottom
  let fillPath = '';
  let seg: { x: number; y: number }[] = [];

  const closeSeg = () => {
    if (seg.length < 2) { seg = []; return; }
    const first = seg[0];
    const last = seg[seg.length - 1];
    let s = `M ${first.x} ${first.y} `;
    for (let j = 1; j < seg.length; j++) s += `L ${seg[j].x} ${seg[j].y} `;
    s += `L ${last.x} ${height} L ${first.x} ${height} Z `;
    fillPath += s;
    seg = [];
  };

  for (let i = 0; i <= data.length; i++) {
    const v = i < data.length ? data[i] : null;
    if (v !== null) {
      seg.push({ x: xAt(i), y: yAt(v) });
    } else {
      closeSeg();
    }
  }

  // Unique gradient id per color to avoid SVG id collisions between cards
  const gradId = `sg${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.18" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {fillPath ? <Path d={fillPath} fill={`url(#${gradId})`} /> : null}
      <Path
        d={linePath}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
