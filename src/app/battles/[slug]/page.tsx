'use client';

import { useEffect, use } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchBattleByIdOrSlug,
  clearBattleState,
} from '@/store/slices/battleSlice';
import CommentSection from '@/components/CommentSection'; // Apke path ke mutabiq adjust kar lein agar zaroorat ho

export default function BattleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const dispatch = useAppDispatch();

  const {
    currentBattle: battle,
    loading,
    submittingComment,
    error,
  } = useAppSelector((state) => state.battles);

  useEffect(() => {
    dispatch(fetchBattleByIdOrSlug(slug));

    return () => {
      dispatch(clearBattleState());
    };
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center">
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ DECRYPTING CLASSIFIED BATTLE DATA... ]
        </p>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center">
        <p className="text-red-500 font-mono text-sm">
          {error || 'Battle records not found.'}
        </p>
      </div>
    );
  }

  const battleTitle = battle.title || battle.name || 'CLASSIFIED ENGAGEMENT';
  const battleOverview =
    battle.description ||
    battle.summary ||
    'No briefing details logged for this record.';

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8">
      {/* Header Info */}
      <div className="border-b border-gray-800 pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded uppercase font-bold">
            THEATER: {battle.theater || 'OTHER'}
          </span>
          {battle.year && (
            <span className="text-xs font-mono text-gray-400 font-bold bg-gray-800 px-2.5 py-1 rounded">
              {battle.year}
            </span>
          )}
        </div>

        <h1 className="3xl font-black text-white uppercase tracking-wider text-3xl">
          {battleTitle} {battle.year ? `(${battle.year})` : ''}
        </h1>

        {battle.location && (
          <p className="text-xs font-mono text-amber-500">
            Sector: <span className="font-semibold">{battle.location}</span>
          </p>
        )}
      </div>

      {/* Briefing / Overview Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
          TACTICAL OVERVIEW
        </h3>
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-lg">
          <p className="text-gray-300 leading-relaxed font-sans text-sm whitespace-pre-line">
            {battleOverview}
          </p>
        </div>
      </div>

      {/* Tactical Phases (If present) */}
      {battle.tacticalPhases && battle.tacticalPhases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
            ENGAGEMENT PHASES
          </h3>
          <div className="space-y-3">
            {battle.tacticalPhases.map((phase, idx) => (
              <div
                key={idx}
                className="bg-[#111827] border border-gray-800 p-4 rounded-lg flex gap-4"
              >
                <span className="text-xs font-mono text-amber-500 font-bold">
                  0{idx + 1}.
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    {phase.phaseName}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{phase.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Officer Debriefs & Comments Section (Using Reusable CommentSection Component) */}
      <div className="pt-6 border-t border-gray-800">
        <CommentSection 
          battleId={battle._id} 
          comments={battle.comments || []} 
          submittingComment={submittingComment} 
          type="battle" 
        />
      </div>
    </div>
  );
}