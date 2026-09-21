export default function AdBanner({ slotId }: { slotId?: string }) {
  return (
    <div className="my-8 w-full bg-gray-900/60 border border-amber-500/10 rounded-lg p-4 text-center">
      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest block mb-1">
        Sponsored Dispatch
      </span>
      <div className="h-20 flex items-center justify-center text-xs text-gray-500 font-mono bg-[#0b0f19] rounded border border-dashed border-gray-800">
        [ Ad Space / Google AdSense Slot #{slotId || 'MAIN_LEADERBOARD'} ]
      </div>
    </div>
  );
}