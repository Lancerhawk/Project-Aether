export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]/70 backdrop-blur-sm cursor-wait pointer-events-auto">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-[rgba(255,255,255,0.1)] rounded-full absolute" />
        {/* Spinning ring */}
        <div className="w-16 h-16 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#eeeef0] animate-pulse">
        Loading...
      </p>
    </div>
  );
}
