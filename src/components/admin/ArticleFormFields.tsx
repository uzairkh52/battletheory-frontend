'use client';

import React, { useState, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface ArticleFormFieldsProps {
  formData: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    featuredImage: string;
    videoEmbed?: string;
    category?: string;
  };
  tags?: string[];
  setTags?: React.Dispatch<React.SetStateAction<string[]>>;
  categories?: any[];
  newCatName: string;
  showAddCat: boolean;
  setNewCatName: (val: string) => void;
  setShowAddCat: React.Dispatch<React.SetStateAction<boolean>>;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onChange: (field: string, value: any) => void;
  showSlug?: boolean;
}

export default function ArticleFormFields({ 
  formData, 
  tags = [],
  setTags,
  categories = [],
  newCatName,
  showAddCat,
  setNewCatName,
  setShowAddCat,
  onAddCategory,
  onDeleteCategory,
  onChange, 
  showSlug = true
}: ArticleFormFieldsProps) {
  const [tagInput, setTagInput] = useState('');

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     
      .replace(/[^\w\-]+/g, '') 
      .replace(/\-\-+/g, '-');  
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSlug = slugify(e.target.value);
    onChange('slug', formattedSlug);
  };

  const processTags = (rawInput: string) => {
    if (!rawInput) return;
    const rawTags = rawInput.split(/[,,\n]+/);
    const newTagsList: string[] = [];

    rawTags.forEach((item) => {
      const cleaned = item.trim().toLowerCase().replace(/^[#,\s]+|[,\s]+$/g, '');
      if (cleaned && !tags.includes(cleaned) && !newTagsList.includes(cleaned)) {
        newTagsList.push(cleaned);
      }
    });

    if (newTagsList.length > 0) {
      const updatedTags = [...tags, ...newTagsList];
      if (typeof setTags === 'function') {
        setTags(updatedTags);
      } else {
        onChange('tags', updatedTags);
      }
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        processTags(tagInput);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    if (typeof setTags === 'function') {
      setTags(updated);
    } else {
      onChange('tags', updated);
    }
  };

  const handleClearAllTags = () => {
    if (typeof setTags === 'function') {
      setTags([]);
    } else {
      onChange('tags', []);
    }
    setTagInput('');
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['image', 'link', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'image', 'link', 'video'
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Title Field */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            const newTitle = e.target.value;
            onChange('title', newTitle);
            if (showSlug) {
              onChange('slug', slugify(newTitle));
            }
          }}
          placeholder="Article Headline"
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
          required
        />
      </div>

      {/* Slug Field */}
      {showSlug && (
        <div>
          <label className="block text-gray-400 mb-1 uppercase">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="article-slug"
            className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
            required
          />
        </div>
      )}

      {/* Category Selection */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-gray-400 uppercase">Category</label>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowAddCat((prev) => !prev);
            }}
            className="text-[10px] text-amber-500 hover:underline uppercase font-bold cursor-pointer"
          >
            {showAddCat ? '- Cancel' : '+ Add New'}
          </button>
        </div>

        {showAddCat ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New Category Name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onAddCategory();
              }}
              className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-3 text-xs uppercase rounded cursor-pointer whitespace-nowrap"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              required
              value={formData.category || ''}
              onChange={(e) => onChange('category', e.target.value)}
              className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
            >
              <option value="" className="text-gray-500 bg-black">-- SELECT CATEGORY --</option>
              {categories && categories.length > 0 ? (
                categories.map((cat: any, idx: number) => {
                  const catId = cat._id || cat.id || idx;
                  const catName = typeof cat === 'object' && cat !== null ? (cat.name || cat.title)?.trim() : cat;
                  return (
                    <option key={catId} value={catId} className="bg-[#111827] text-white py-1">
                      {catName}
                    </option>
                  );
                })
              ) : (
                <option value="" disabled className="text-gray-500">
                  No article categories found (+ Add New to create)
                </option>
              )}
            </select>

            {formData.category && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteCategory(formData.category!);
                }}
                title="Delete selected category"
                className="bg-red-900/40 hover:bg-red-800 border border-red-800 text-red-400 font-bold px-3 text-xs rounded transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* WordPress-Style Tags Input Section */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-gray-400 uppercase">
            Tags (Paste comma-separated text or press Enter/Comma)
          </label>
          {tags && tags.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllTags}
              className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold cursor-pointer"
            >
              Clear All ✕
            </button>
          )}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            const val = e.target.value;
            if (val.includes(',')) {
              processTags(val);
              setTagInput('');
            } else {
              setTagInput(val);
            }
          }}
          onKeyDown={handleTagKeyDown}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData('text');
            if (pastedText) {
              e.preventDefault();
              processTags(pastedText);
              setTagInput('');
            }
          }}
          placeholder="e.g. ww2, submarines, pacific-theater"
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
        />

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded-full font-mono"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-amber-500 hover:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured Image URL */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Featured Image URL</label>
        <input
          type="url"
          value={formData.featuredImage}
          onChange={(e) => onChange('featuredImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          placeholder="Short briefing summary..."
          rows={2}
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs resize-none"
        />
      </div>

      {/* Content Field (Rich Text Editor) */}
      <div>
        <label className="block text-gray-400 mb-1 uppercase">Content (Rich Text Editor)</label>
        <div className="bg-white text-black rounded overflow-hidden">
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(contentValue) => onChange('content', contentValue)}
            modules={modules}
            formats={formats}
            placeholder="Detailed article body text..."
            className="min-h-[250px]"
          />
        </div>
      </div>

      {/* Dedicated Facebook Video Embed Field */}
      <div className="space-y-1 pt-2">
        <label className="block text-amber-500 uppercase tracking-wider font-bold">
          Facebook Video Embed Code (Optional)
        </label>
        <textarea
          value={formData.videoEmbed || ''}
          onChange={(e) => onChange('videoEmbed', e.target.value)}
          placeholder='Yahan Facebook ka iframe code paste karein (e.g. <iframe src="..."></iframe>)'
          rows={3}
          className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-white focus:border-amber-500 outline-none text-xs"
        />
      </div>
    </div>
  );
}