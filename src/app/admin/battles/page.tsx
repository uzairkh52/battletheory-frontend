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
  const [editingBattle, setEditingBattle] = useState<any | null>(null); // 🌟 Edit battle state

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

  const handleEdit = (battle: any) => {
    setEditingBattle(battle); // 🌟 Set battle to edit
    setIsModalOpen(true);    // 🌟 Open modal
  };

  const handleOpenAddModal = () => {
    setEditingBattle(null);  // 🌟 Clear edit state for new creation
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider">
          Manage Tactical Battles
        </h1>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded uppercase hover:bg-amber-400 transition-colors"
        >
          + Add Battle
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs text-amber-500 animate-pulse">
          [ LOADING BATTLES DATA... ]
        </p>
      ) : error ? (
        <div className="p-8 text-center border border-dashed border-red-900/50 rounded">
          <p className="text-xs text-red-500 uppercase">
            [ ERROR: {error} ]
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {battles.map((item: any) => {
            const itemImage = item.featuredImage || item.imageUrl || item.image;

            return (
              <div
                key={item._id}
                className="p-4 bg-[#111827] border border-gray-800 rounded flex justify-between items-center hover:border-gray-700 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Thumbnail Preview */}
                  {itemImage ? (
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                      <img src={itemImage} alt={item.title || item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-[10px] text-gray-600 flex-shrink-0">
                      NO IMG
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white uppercase truncate">
                      {item.title || item.name} {item.year ? `(${item.year})` : ''}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {item.summary || item.description}
                    </p>
                  </div>
                </div>

                {/* Actions Buttons: Edit & Delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-xs text-amber-400 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/40 px-3 py-1 rounded transition-colors"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-3 py-1 rounded transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Extracted Battle Form Modal Component with Editing Support */}
      <BattleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBattle(null);
        }}
        editingBattle={editingBattle} // 🌟 Pass editing battle to modal
      />
    </div>
  );
}