'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  addCommentBySlug, 
  toggleLikeComment, 
  replyToComment,
  editComment,
  deleteComment
} from '@/store/slices/articleSlice';
import {
  addBattleComment,
  toggleLikeBattleComment,
  editBattleComment,
  deleteBattleComment
} from '@/store/slices/battleSlice';

interface CommentSectionProps {
  slug?: string;
  battleId?: string;
  comments: any[];
  submittingComment: boolean;
  type?: 'article' | 'battle';
}

export default function CommentSection({ 
  slug, 
  battleId, 
  comments = [], 
  submittingComment, 
  type = 'article' 
}: CommentSectionProps) {
  const dispatch = useAppDispatch();
  
  // Get current logged-in user
  const userInfo = useAppSelector((state: any) => state.auth?.userInfo || state.auth?.user);
  const currentUserId = userInfo?._id || userInfo?.id;

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Local comments state to handle instantaneous updates without page jumps
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Sync props comments to local state when props change initially or externally
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Close 3-dot menu on outside click
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (type === 'battle' && battleId) {
      const result = await dispatch(
        addBattleComment({ battleId, text: newComment })
      );
      if (addBattleComment.fulfilled.match(result)) {
        setNewComment('');
        if (result.payload) {
          setLocalComments(prev => {
            const exists = prev.some(c => c._id === result.payload._id);
            if (exists) return prev;
            return [result.payload, ...prev];
          });
        }
      } else if (addBattleComment.rejected.match(result)) {
        alert(result.payload || 'Failed to post debriefing.');
      }
    } else if (slug) {
      const result = await dispatch(
        addCommentBySlug({ slug, text: newComment })
      );
      if (addCommentBySlug.fulfilled.match(result)) {
        setNewComment('');
        if (result.payload?.comments) {
          setLocalComments(result.payload.comments);
        } else if (result.payload) {
          setLocalComments(prev => {
            const exists = prev.some(c => c._id === result.payload._id);
            if (exists) return prev;
            return [result.payload, ...prev];
          });
        }
      } else if (addCommentBySlug.rejected.match(result)) {
        alert(result.payload || 'Failed to post comment.');
      }
    }
  };

  const handleLike = async (commentId: string) => {
    const action = type === 'battle' ? toggleLikeBattleComment(commentId) : toggleLikeComment(commentId);
    const result = await dispatch(action);
    
    if (toggleLikeComment.fulfilled.match(result) || toggleLikeBattleComment.fulfilled.match(result)) {
      const updatedComment = result.payload; 
      setLocalComments(prev =>
        prev.map(c => c._id === commentId ? { ...c, likes: updatedComment.likes } : c)
      );
    }
  };

  const handleReplySubmit = async (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (type === 'battle' && battleId) {
      const result = await dispatch(addBattleComment({ battleId, text: replyText, parentComment: commentId }));
      if (addBattleComment.fulfilled.match(result)) {
        setReplyText('');
        setReplyingTo(null);
        const newReply = result.payload;
        setLocalComments(prev => {
          const exists = prev.some(c => c._id === newReply._id);
          if (exists) return prev;
          return [...prev, newReply];
        });
      } else if (addBattleComment.rejected.match(result)) {
        alert(result.payload || 'Failed to post reply.');
      }
    } else {
      const result = await dispatch(replyToComment({ commentId, text: replyText }));
      if (replyToComment.fulfilled.match(result)) {
        setReplyText('');
        setReplyingTo(null);
        const newReply = result.payload;
        setLocalComments(prev => {
          const exists = prev.some(c => c._id === newReply._id);
          if (exists) return prev;
          return [...prev, newReply];
        });
      } else if (replyToComment.rejected.match(result)) {
        alert(result.payload || 'Failed to post reply.');
      }
    }
  };

  const handleEditSubmit = async (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const action = type === 'battle' 
      ? editBattleComment({ commentId, text: editText }) 
      : editComment({ commentId, text: editText });

    const result = await dispatch(action);
    if (editComment.fulfilled.match(result) || editBattleComment.fulfilled.match(result)) {
      setEditingCommentId(null);
      setEditText('');
      const updated = result.payload;
      setLocalComments(prev =>
        prev.map(c => c._id === commentId ? { ...c, text: updated.text || updated.content, content: updated.content || updated.text } : c)
      );
    } else {
      alert('Failed to update comment.');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this transmission?')) {
      const action = type === 'battle' ? deleteBattleComment(commentId) : deleteComment(commentId);
      const result = await dispatch(action);
      
      if (deleteComment.fulfilled.match(result) || deleteBattleComment.fulfilled.match(result)) {
        setOpenMenuId(null);
        setLocalComments(prev => prev.filter(c => c._id !== commentId && c.parentComment !== commentId));
      } else {
        alert('Failed to delete comment.');
      }
    }
  };

  // Recursive function to render comments & nested replies with 3-dot menu
  const renderCommentItem = (comment: any, isNested = false) => {
    const replies = localComments.filter((r: any) => 
      r.parentComment === comment._id || r.parentComment?._id === comment._id
    );
    const isEditing = editingCommentId === comment._id;
    const isMenuOpen = openMenuId === comment._id;

    // Check if current user has liked this comment
    const isLiked = currentUserId 
      ? comment.likes?.some((id: any) => (typeof id === 'string' ? id : id._id)?.toString() === currentUserId.toString()) 
      : false;

    return (
      <div
        key={comment._id}
        className={`p-3 bg-[#0b0f19] border border-gray-800 rounded space-y-2 relative ${
          isNested ? 'mt-2 ml-3 md:ml-4 border-l-2 border-amber-500/40 bg-[#111827]' : ''
        }`}
      >
        {/* Top Header info & 3-Dot Menu */}
        <div className="flex justify-between items-center text-[10px] relative">
          <span className="text-amber-500 font-bold">
            {comment.author?.username || comment.name || 'GUEST OPERATIVE'}
          </span>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
            </span>

            {/* 3-Dot Menu Toggle Button */}
            <div className="relative" ref={isMenuOpen ? menuRef : null}>
              <button
                type="button"
                onClick={() => setOpenMenuId(isMenuOpen ? null : comment._id)}
                className="px-2 py-0.5 text-gray-400 hover:text-amber-500 text-sm font-bold transition-colors"
                title="Options"
              >
                ⋮
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-[#111827] border border-gray-700 rounded shadow-lg z-20 py-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditText(comment.text || comment.content);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-gray-300 hover:bg-amber-600 hover:text-black transition-colors"
                  >
                    ✏ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(comment._id)}
                    className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Body or Edit Input Form */}
        {isEditing ? (
          <form onSubmit={(e) => handleEditSubmit(comment._id, e)} className="space-y-2 pt-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              required
              className="w-full bg-[#111827] border border-amber-500 rounded p-2 text-xs text-gray-200 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px] uppercase rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingCommentId(null)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] uppercase rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-gray-300">{comment.text || comment.content}</p>
        )}

        {/* Like & Reply Action Buttons */}
        <div className="flex items-center gap-4 pt-1 text-[11px] text-gray-400">
          <button 
            type="button"
            onClick={() => handleLike(comment._id)}
            className="flex items-center gap-1.5 transition-colors group focus:outline-none"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="14" 
              height="14" 
              fill={isLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked 
                  ? 'text-amber-500 fill-amber-500' 
                  : 'text-gray-400 group-hover:text-amber-500'
              }`}
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span className={isLiked ? 'text-amber-500 font-semibold' : 'text-gray-400 group-hover:text-amber-500'}>
              Like ({comment.likes?.length || 0})
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
            className="hover:text-amber-500 transition-colors focus:outline-none"
          >
            💬 Reply
          </button>
        </div>

        {/* Reply Input Box */}
        {replyingTo === comment._id && (
          <form onSubmit={(e) => handleReplySubmit(comment._id, e)} className="mt-2 space-y-2 pl-3 border-l border-amber-500">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a tactical reply..."
              rows={2}
              required
              className="w-full bg-[#111827] border border-gray-700 rounded p-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px] uppercase rounded"
              >
                Send Reply
              </button>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] uppercase rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Render Child Replies recursively */}
        {replies.length > 0 && (
          <div className="space-y-2 pt-2">
            {replies.map((childReply: any) => renderCommentItem(childReply, true))}
          </div>
        )}
      </div>
    );
  };

  const mainComments = localComments.filter((c: any) => !c.parentComment);

  return (
    <section className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-6">
      <h3 className="text-xs text-amber-500 uppercase tracking-widest border-b border-gray-800 pb-2">
        TACTICAL DEBRIEFING & COMMENTS ({localComments.length})
      </h3>

      {/* Main Comment Input Form */}
      <form onSubmit={handleCommentSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Log tactical observation..."
          rows={3}
          required
          className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={submittingComment}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
        >
          {submittingComment ? 'TRANSMITTING...' : 'POST DEBRIEFING'}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        {mainComments.length > 0 ? (
          mainComments.map((comment: any) => renderCommentItem(comment, false))
        ) : (
          <p className="text-xs text-gray-500">
            No field observations recorded yet.
          </p>
        )}
      </div>
    </section>
  );
}