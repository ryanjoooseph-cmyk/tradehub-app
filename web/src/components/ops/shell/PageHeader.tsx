"use client";

import { ReactNode } from "react";

export default function PageHeader(props: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-3xl font-extrabold tracking-tight">{props.title}</div>
          {props.subtitle ? (
            <div className="mt-1 text-sm text-muted-foreground">{props.subtitle}</div>
          ) : null}
          {props.meta ? <div className="mt-3">{props.meta}</div> : null}
        </div>
        {props.right ? <div className="shrink-0">{props.right}</div> : null}
      </div>
    </div>
  );
}
