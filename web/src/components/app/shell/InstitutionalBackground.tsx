export default function InstitutionalBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-35 blur-3xl
                      bg-[radial-gradient(circle_at_center,hsl(var(--primary))_0%,transparent_60%)]" />
      <div className="absolute -bottom-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl
                      bg-[radial-gradient(circle_at_center,hsl(var(--muted-foreground))_0%,transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}
