"use client";

import React from "react";

type Pt = { x: string; y: number };
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function polyline(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function Sparkline({ data, height = 72 }: { data: Pt[]; height?: number }) {
  const w = 320;
  const pad = 8;
  const ys = data.map((d) => d.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;

  const pts = data.map((d, i) => ({
    x: pad + (i * (w - 2 * pad)) / Math.max(1, data.length - 1),
    y: pad + (height - 2 * pad) - ((d.y - min) / span) * (height - 2 * pad),
  }));

  const line = polyline(pts);
  const area = `${line} ${w - pad},${height - pad} ${pad},${height - pad}`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} className="overflow-visible">
      <polyline points={line} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      <polyline points={area} fill="currentColor" opacity="0.08" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill="currentColor" />
    </svg>
  );
}

export function Bars({ values }: { values: number[] }) {
  const w = 320;
  const h = 72;
  const pad = 8;
  const max = Math.max(...values, 1);
  const bw = (w - 2 * pad) / values.length;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      {values.map((v, i) => {
        const bh = ((h - 2 * pad) * v) / max;
        const x = pad + i * bw;
        const y = h - pad - bh;
        return <rect key={i} x={x + 3} y={y} width={bw - 6} height={bh} rx="4" fill="currentColor" opacity="0.22" />;
      })}
    </svg>
  );
}

export function Donut({ value = 72 }: { value?: number }) {
  const v = clamp(value, 0, 100);
  const r = 18;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" opacity="0.12" strokeWidth="6" />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="currentColor"
        opacity="0.9"
        strokeWidth="6"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="28" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.9">
        {Math.round(v)}%
      </text>
    </svg>
  );
}
