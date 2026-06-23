export function BackgroundFx() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-lime-500/10 blur-[120px] animate-drift" />
      <div className="absolute top-[60%] right-[5%] w-[600px] h-[600px] rounded-full bg-lime-400/8 blur-[140px] animate-drift" style={{ animationDelay: "10s" }} />
      <div className="absolute bottom-[10%] left-[40%] w-[400px] h-[400px] rounded-full bg-lime-600/8 blur-[100px] animate-drift" style={{ animationDelay: "20s" }} />
      <div className="absolute inset-0 pitch-grid opacity-50" />
    </div>
  );
}
