'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Next.js SSR error avoid karne ke liye Dynamic Import
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface ArticleFormFieldsProps {
  formData: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    featuredImage: string;
  };
  onChange: (field: string, value: string) => void;
  showSlug?: boolean;
}

export default function ArticleFormFields({ formData, onChange, showSlug = true }: ArticleFormFieldsProps) {
  
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Spaces ko dash (-) mein convert karega
      .replace(/[^\w\-]+/g, '') // Special characters remove kar dega
      .replace(/\-\-+/g, '-');  // Multiple dashes ko single dash mein badal dega
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSlug = slugify(e.target.value);
    onChange('slug', formattedSlug);
  };

  // Editor Toolbar Configuration (WordPress-style)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['image', 'link'],
      ['clean'],
    ],
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Title Field */}
      <div>
        <label className="block text-xs text-gray-400 uppercase mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            const newTitle = e.target.value;
            onChange('title', newTitle);
            // 🌟 Title likhte hi Slug automatic generate aur update ho jayega
            onChange('slug', slugify(newTitle));
          }}
          placeholder="Article Headline"
          className="w-full bg-[#0b0f19] border border-gray-800 rounded p-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
          required
        />
      </div>

      {/* Slug Field */}
      {showSlug && (
        <div>
          <label className="block text-xs text-gray-400 uppercase mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            placeholder="article-slug"
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
            required
          />
        </div>
      )}

      {/* Featured Image URL */}
      <div>
        <label className="block text-xs text-gray-400 uppercase mb-1">Featured Image URL</label>
        <input
          type="url"
          value={formData.featuredImage}
          onChange={(e) => onChange('featuredImage', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full bg-[#0b0f19] border border-gray-800 rounded p-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-xs text-gray-400 uppercase mb-1">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          placeholder="Short briefing summary..."
          rows={2}
          className="w-full bg-[#0b0f19] border border-gray-800 rounded p-2.5 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
        />
      </div>

      {/* Content Field (Rich Text Editor WordPress Style) */}
      <div>
        <label className="block text-xs text-gray-400 uppercase mb-1">Content (Rich Text Editor)</label>
        <div className="bg-white text-black rounded overflow-hidden">
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(contentValue) => onChange('content', contentValue)}
            modules={modules}
            placeholder="Detailed article body text... Insert H1, Bold, Italic, and Images here."
            className="min-h-[250px]"
          />
        </div>
      </div>
    </div>
  );
}