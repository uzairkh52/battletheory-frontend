'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllBattles,
  fetchCategories,
  deleteBattle,
} from '@/store/slices/battleSlice';
import BattleFormModal from '@/components/admin/BattleFormModal';

export default function ManageBattlesPage() {
  const dispatch = useAppDispatch();
  const {
    battles,
    loading: isLoading,
    error,
  } = useAppSelector((state) => state.battles);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBattles());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this battle?')) return;
    const resultAction = await dispatch(deleteBattle(id));
    if (deleteBattle.rejected.match(resultAction)) {
      alert((resultAction.payload as string) || 'Failed to delete battle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider">
          Manage Tactical Battles
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded uppercase hover:bg-amber-400 transition-colors font-mono"
        >
          + Add Battle
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs font-mono text-amber-500 animate-pulse">
          [ LOADING BATTLES DATA... ]
        </p>
      ) : error ? (
        <div className="p-8 text-center border border-dashed border-red-900/50 rounded">
          <p className="text-xs font-mono text-red-500 uppercase">
            [ ERROR: {error} ]
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {battles.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-[#111827] border border-gray-800 rounded flex justify-between items-center hover:border-gray-700 transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-white uppercase">
                  {item.title || item.name} {item.year ? `(${item.year})` : ''}
                </h4>
                <p className="text-xs font-mono text-gray-500 line-clamp-1">
                  {item.summary || item.description}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-xs font-mono text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-3 py-1 rounded transition-colors"
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Extracted Battle Form Modal Component */}
      <BattleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}