import * as React from "react";
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = "", ...rest } = props;
  return <div className={"rounded-xl border border-neutral-200 bg-white shadow-sm " + className} {...rest} />;
}
