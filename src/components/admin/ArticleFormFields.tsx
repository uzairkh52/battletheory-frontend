import React from 'react';

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
  
  // 🌟 Slug ko clean aur URL friendly banane ka function
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Spaces ko dash (-) mein convert karega
      .replace(/[^\w\-]+/g, '') // Special characters remove kar dega
      .replace(/\-\-+/g, '-');  // Multiple dashes ko single dash mein badal dega
  };

  // Jab Title change ho, toh agar slug khali ho ya auto-generate karna ho toh optional hai, 
  // lekin agar user khud Slug field mein paste karega toh neechay wala handler chalega.
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSlug = slugify(e.target.value);
    onChange('slug', formattedSlug);
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
            // Agar aap chahte hain ke Title likhte hi slug khud ba khud generate ho jaye, 
                // toh aap yeh line bhi uncomment kar sakte hain:
            // onChange('slug', slugify(newTitle));
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
            onChange={handleSlugChange} // 🌟 Yahan slugify apply ho gaya hai
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

      {/* Content */}
      <div>
        <label className="block text-xs text-gray-400 uppercase mb-1">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => onChange('content', e.target.value)}
          placeholder="Detailed article body text..."
          rows={6}
          className="w-full bg-[#0b0f19] border border-gray-800 rounded p-2.5 text-white text-sm focus:outline-none focus:border-amber-500"
          required
        />
      </div>
    </div>
  );
}