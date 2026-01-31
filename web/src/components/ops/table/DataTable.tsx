"use client";

/* eslint-disable react-hooks/incompatible-library */
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function DataTable<T extends { id: string }>(props: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  emptyTitle: string;
  emptySubtitle?: string;
  height?: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;
  const parentRef = useMemo(() => ({ current: null as null | HTMLDivElement }), []);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  return (
    <div className="rounded-2xl border bg-background/60 shadow-sm">
      <div className="border-b p-4">
        <div className="text-sm font-semibold">List</div>
        <div className="text-xs text-muted-foreground">Sort columns by clicking headers.</div>
      </div>

      {rows.length === 0 ? (
        <div className="p-10">
          <div className="text-lg font-semibold">{props.emptyTitle}</div>
          {props.emptySubtitle ? (
            <div className="mt-1 text-sm text-muted-foreground">{props.emptySubtitle}</div>
          ) : null}
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-12 gap-0 border-b bg-background/70 px-4 py-3 text-xs font-semibold text-muted-foreground">
            {table.getHeaderGroups().map((hg) =>
              hg.headers.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className="col-span-3 text-left hover:text-foreground"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </button>
              ))
            )}
          </div>

          <div
            ref={(el) => {
              parentRef.current = el;
            }}
            style={{ height: props.height ?? 520, overflow: "auto" }}
          >
            <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
              {rowVirtualizer.getVirtualItems().map((v) => {
                const row = rows[v.index];
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-12 gap-0 border-b px-4 py-3 text-sm hover:bg-muted/30"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${v.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <div key={cell.id} className="col-span-3 truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
