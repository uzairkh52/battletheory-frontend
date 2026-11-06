'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchBattleByIdOrSlug,
  clearBattleState,
} from '@/store/slices/battleSlice';
import CommentSection from '@/components/CommentSection';

export default function BattleDetailClient({ slug }: { slug: string }) {
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

  // ⚡ INSTANT BROWSER TAB TITLE UPDATE
  useEffect(() => {
    if (battle) {
      const titleName = battle.title || battle.name || 'Classified Engagement';
      const yearStr = battle.year ? ` (${battle.year})` : '';
      document.title = `${titleName}${yearStr} | Battle Theory`;
    }
  }, [battle]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center font-mono">
        <p className="text-xs text-amber-500 animate-pulse">
          [ DECRYPTING CLASSIFIED BATTLE DATA... ]
        </p>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center font-mono">
        <p className="text-red-500 text-sm">
          {error || 'Battle records not found.'}
        </p>
      </div>
    );
  }

  const battleTitle = battle.title || battle.name || 'CLASSIFIED ENGAGEMENT';
  
  // 🌟 EXACT DATABASE FIELD MAPPINGS
  const battleSummary = battle.summary || '';
  
  // MongoDB uses 'content' for the detailed breakdown
  const battleDescription =
    (battle as any).content ||
    battle.description ||
    'No detailed engagement history logged for this record.';

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8 font-mono text-white">
      {/* Header Info Banner */}
      <div className="border-b border-gray-800 pb-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            GEOSPATIAL RADAR // DIRECTIVE 01
          </span>
        </div>

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

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
          {battleTitle} {battle.year ? `(${battle.year})` : ''}
        </h1>

        {battle.location && (
          <p className="text-xs font-mono text-amber-500">
            Sector / Location: <span className="font-semibold text-gray-300">{battle.location}</span>
          </p>
        )}
      </div>

      {/* Featured Visual Image */}
      {battle.featuredImage && (
        <div className="w-full h-[320px] sm:h-[400px] rounded-lg overflow-hidden border border-gray-800 bg-black relative">
          <img
            src={battle.featuredImage}
            alt={battleTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 🌟 EXACT SUMMARY FROM DATABASE */}
      {battleSummary && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold flex items-center gap-2">
            <span>⚡</span> EXECUTIVE SUMMARY // BRIEFING
          </h3>
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <p className="text-amber-200 font-sans text-sm leading-relaxed italic">
              "{battleSummary}"
            </p>
          </div>
        </div>
      )}

      {/* Detailed Content / Description Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
          TACTICAL ENGAGEMENT OVERVIEW
        </h3>
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-lg overflow-hidden">
          <div
            className="text-gray-200 leading-relaxed font-sans text-sm break-all break-words [word-break:break-word] 
                       [&_*]:!text-gray-200 [&_p]:!text-gray-200 [&_span]:!text-gray-200
                       [&_p]:mb-4 [&_br]:block [&_br]:content-[''] [&_br]:my-2
                       [&_a]:!text-amber-500 [&_a]:underline [&_a]:font-bold [&_a]:my-2 [&_a]:inline-block"
            dangerouslySetInnerHTML={{ __html: battleDescription }}
          />
        </div>
      </div>

      {/* Tactical Phases */}
      {battle.tacticalPhases && battle.tacticalPhases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
            ENGAGEMENT PHASES
          </h3>
          <div className="space-y-3">
            {battle.tacticalPhases.map((phase: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#111827] border border-gray-800 p-4 rounded-lg flex gap-4 items-start"
              >
                <span className="text-xs font-mono text-amber-500 font-bold">
                  0{idx + 1}.
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    {phase.phaseName || phase.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                    {phase.details || phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌟 MOVED DOWN: TACTICAL VIDEO BRIEFING (YOUTUBE / FACEBOOK) */}
      {(battle as any).videoEmbed && (battle as any).videoEmbed.trim() !== '' && (
        <div className="space-y-3 max-w-2xl mx-auto pt-2">
          <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold flex items-center gap-2">
            <span>🎬</span> TACTICAL VIDEO BRIEFING // EMBED INTEL
          </h3>
          <div className="bg-[#111827] border border-gray-800 p-3 rounded-lg overflow-hidden shadow-lg">
            <div
              className="aspect-video w-full flex justify-center items-center rounded overflow-hidden bg-black
                         [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:rounded"
              dangerouslySetInnerHTML={{ __html: (battle as any).videoEmbed }}
            />
          </div>
        </div>
      )}

      {/* Comments Section */}
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