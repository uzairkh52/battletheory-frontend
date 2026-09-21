'use client';

import { useEffect, useState, use } from 'react';
import API from '@/lib/api';

interface Comment {
  _id: string;
  text?: string;
  content?: string;
  author?: { username: string };
  createdAt: string;
}

interface Battle {
  _id: string;
  name?: string;
  title?: string;
  year?: string | number;
  location?: string;
  theater?: string;
  description?: string;
  summary?: string;
  tacticalPhases?: { phaseName: string; details: string }[];
  comments?: Comment[];
}

export default function BattleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [battle, setBattle] = useState<Battle | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/battles/${slug}`)
      .then((res) => {
        setBattle(res.data);
      })
      .catch((err) => console.error('Error loading battle:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !battle) return;

    setSubmitting(true);
    try {
      const res = await API.post(`/battles/${battle._id}/comments`, {
        text: commentText,
      });

      setBattle((prev) =>
        prev
          ? {
              ...prev,
              comments: [res.data, ...(prev.comments || [])],
            }
          : null
      );
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center">
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ DECRYPTING CLASSIFIED BATTLE DATA... ]
        </p>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center">
        <p className="text-red-500 font-mono text-sm">Battle records not found.</p>
      </div>
    );
  }

  // Dynamic field fallbacks
  const battleTitle = battle.title || battle.name || 'CLASSIFIED ENGAGEMENT';
  const battleOverview = battle.description || battle.summary || 'No briefing details logged for this record.';

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

        <h1 className="text-3xl font-black text-white uppercase tracking-wider">
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
              <div key={idx} className="bg-[#111827] border border-gray-800 p-4 rounded-lg flex gap-4">
                <span className="text-xs font-mono text-amber-500 font-bold">0{idx + 1}.</span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">{phase.phaseName}</h4>
                  <p className="text-xs text-gray-400 mt-1">{phase.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Officer Debriefs & Comments */}
      <div className="pt-6 border-t border-gray-800 space-y-6">
        <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
          OFFICER DEBRIEFS & STRATEGIC FEEDBACK
        </h3>

        <form onSubmit={handlePostComment} className="space-y-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Submit battle commentary or tactical analysis..."
            rows={3}
            className="w-full bg-[#111827] border border-gray-800 rounded p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 font-sans"
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded disabled:opacity-50 transition-colors"
          >
            {submitting ? 'FILING ASSESSMENT...' : 'POST ASSESSMENT'}
          </button>
        </form>

        {/* Comment Roster */}
        <div className="space-y-3 pt-2">
          {battle.comments && battle.comments.length > 0 ? (
            battle.comments.map((c) => (
              <div key={c._id} className="bg-[#111827] border border-gray-800 p-4 rounded text-xs space-y-1">
                <div className="flex justify-between text-gray-400 font-mono text-[10px]">
                  <span className="text-amber-500 font-bold">
                    Cmdr. {c.author?.username || 'ANONYMOUS'}
                  </span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 font-sans">{c.text || c.content}</p>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-gray-500 italic">No officer assessments filed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}