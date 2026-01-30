"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Dialog({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  widthClass?: string;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className="backdrop:bg-black/40 rounded-2xl border border-neutral-200 p-0 shadow-2xl"
      onClose={onClose}
    >
      <div className={`w-[92vw] ${widthClass} bg-white`}>
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <div className="min-w-0">
            <div className="text-base font-semibold tracking-tight truncate">{title}</div>
            <div className="mt-0.5 text-xs text-neutral-500">TradeHub Console</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </dialog>
  );
}
