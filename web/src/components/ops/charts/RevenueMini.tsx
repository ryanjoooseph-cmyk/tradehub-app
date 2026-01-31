"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

type P = { x: string; y: number };

export default function RevenueMini(props: { data: P[] }) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={props.data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <XAxis dataKey="x" hide />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}
            labelStyle={{ fontSize: 12 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Area type="monotone" dataKey="y" strokeWidth={2} fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
