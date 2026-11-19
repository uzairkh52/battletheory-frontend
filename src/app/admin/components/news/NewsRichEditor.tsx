'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['image', 'link', 'video'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'image',
  'link',
  'video',
];

interface NewsRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function NewsRichEditor({
  value,
  onChange,
  label = 'Full Content (Rich Text Editor) *',
  placeholder = 'Detailed news article body text...',
}: NewsRichEditorProps) {
  return (
    <div className="min-w-0 w-full">
      {label && (
        <label className="block text-gray-400 mb-1 uppercase font-bold">{label}</label>
      )}
      <div className="bg-white text-black rounded overflow-hidden min-w-0 w-full">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          placeholder={placeholder}
          className="min-h-[220px]"
        />
      </div>
    </div>
  );
}