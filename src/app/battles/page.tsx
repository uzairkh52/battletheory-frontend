'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// SSR Bypass for Leaflet Map
const BattleMap = dynamic(() => import('@/components/BattleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] bg-[#111827] border border-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-xs font-mono text-amber-500 animate-pulse">
        [ INITIALIZING GEOSPATIAL RADAR & MAP TILES... ]
      </p>
    </div>
  ),
});

interface Battle {
  _id: string;
  name?: string;
  title?: string;
  slug?: string;
  year: string | number;
  location: string;
  theater: string;
  description?: string;
  summary?: string;
  coordinates?: { lat: number; lng: number };
  tacticalPhases?: { phaseName: string; details: string }[];
}

export default function BattlesVisualizerPage() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [filterTheater, setFilterTheater] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/battles')
      .then((res) => {
        setBattles(res.data);
        if (res.data.length > 0) setSelectedBattle(res.data[0]);
      })
      .catch((err) => console.error('Failed to load battles:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBattles =
    filterTheater === 'All'
      ? battles
      : battles.filter(
          (b) => b.theater?.toLowerCase() === filterTheater.toLowerCase()
        );

  return (
    <div className="space-y-6 my-6 max-w-6xl mx-auto px-4">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
        <div>
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
            TACTICAL MAP & GEOSPATIAL INTELLIGENCE
          </span>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">
            Historic Battles Archive
          </h1>
        </div>

        {/* Theater Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {['All', 'European', 'Pacific', 'Eastern Front', 'North Africa', 'Other'].map(
            (t) => (
              <button
                key={t}
                onClick={() => setFilterTheater(t)}
                className={`px-3 py-1.5 rounded transition-colors uppercase ${
                  filterTheater === t
                    ? 'bg-amber-600 text-black font-bold'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ LOADING GEOSPATIAL TACTICAL DATA... ]
        </p>
      ) : (
        <div className="space-y-6">
          {/* Interactive Tactical Map */}
          <BattleMap
            battles={filteredBattles}
            selectedBattle={selectedBattle}
            onSelectBattle={(b) => setSelectedBattle(b)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Battle Selector List */}
            <div className="space-y-3 lg:col-span-1 max-h-[60vh] overflow-y-auto pr-2">
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                Select Battle Engagement ({filteredBattles.length})
              </h3>
              {filteredBattles.map((b) => {
                const displayName =
                  b.title || b.name || `ENGAGEMENT-${b._id.slice(-4)}`;
                return (
                  <div
                    key={b._id}
                    onClick={() => setSelectedBattle(b)}
                    className={`p-4 rounded border cursor-pointer transition-all ${
                      selectedBattle?._id === b._id
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-[#111827] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-sm text-white uppercase">
                        {displayName}
                      </h4>
                      <span className="text-xs font-mono text-amber-500 font-bold">
                        {b.year || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-gray-500">
                      {b.location || b.theater || 'CLASSIFIED LOCATION'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Tactical Visualizer Panel */}
            <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-lg p-6 flex flex-col justify-between min-h-[450px]">
              {selectedBattle ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="border-b border-gray-800 pb-4">
                      <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">
                        THEATER: {selectedBattle.theater || 'EUROPEAN'}
                      </span>
                      <h2 className="text-2xl font-black text-white uppercase mt-2">
                        {selectedBattle.title || selectedBattle.name}{' '}
                        {selectedBattle.year ? `(${selectedBattle.year})` : ''}
                      </h2>
                      {selectedBattle.location && (
                        <p className="text-xs font-mono text-amber-500 mt-1">
                          📍 {selectedBattle.location}
                        </p>
                      )}
                    </div>

                    {/* Tactical Description */}
                    <div>
                      <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                        BRIEFING & OVERVIEW
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-sans">
                        {selectedBattle.description ||
                          selectedBattle.summary ||
                          'No detailed briefing provided.'}
                      </p>
                    </div>

                    {/* Tactical Phases / Timeline */}
                    {selectedBattle.tacticalPhases &&
                      selectedBattle.tacticalPhases.length > 0 && (
                        <div>
                          <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
                            ENGAGEMENT PHASES
                          </h4>
                          <div className="space-y-3">
                            {selectedBattle.tacticalPhases.map((phase, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-[#0b0f19] border border-gray-800 rounded flex gap-3 items-start"
                              >
                                <span className="text-xs font-mono text-amber-500 font-bold">
                                  0{idx + 1}.
                                </span>
                                <div>
                                  <h5 className="text-xs font-bold text-white uppercase">
                                    {phase.phaseName}
                                  </h5>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {phase.details}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Routing Link Button */}
                  <div className="pt-6 border-t border-gray-800 mt-auto">
                    <Link
                      href={`/battles/${selectedBattle.slug || selectedBattle._id}`}
                      className="inline-block w-full text-center py-3 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded transition-colors"
                    >
                      EXPLORE FULL TACTICAL BRIEFING & MAP →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center m-auto">
                  <p className="text-xs font-mono text-gray-500">
                    Select a battle from the roster or map marker.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}