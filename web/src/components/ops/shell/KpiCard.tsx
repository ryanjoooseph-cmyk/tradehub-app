"use client";

import { ReactNode } from "react";

export default function KpiCard(props: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-muted-foreground">{props.label}</div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight">{props.value}</div>
          {props.delta ? (
            <div className="mt-2 inline-flex items-center rounded-full border bg-background px-2 py-1 text-xs text-muted-foreground">
              {props.delta}
            </div>
          ) : null}
        </div>
        {props.icon ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
