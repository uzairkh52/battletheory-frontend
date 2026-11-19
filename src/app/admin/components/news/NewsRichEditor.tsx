'use client';

import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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
  const quillRef = useRef<any>(null);
  const savedRangeRef = useRef<{ index: number; length: number } | null>(null);
  const [showUrlBar, setShowUrlBar] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'link', 'video'],
          ['clean'],
        ],
        handlers: {
          image: function () {
            const editor = quillRef.current?.getEditor?.();
            if (editor) {
              const range = editor.getSelection(true);
              savedRangeRef.current = {
                index: range?.index ?? editor.getLength(),
                length: range?.length ?? 0,
              };
            }
            setShowUrlBar(true);
          },
        },
      },
    }),
    []
  );

  const handleApplyImageUrl = () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;

    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      const targetIndex =
        savedRangeRef.current?.index ?? editor.getSelection(true)?.index ?? editor.getLength();

      if (savedRangeRef.current?.length) {
        editor.deleteText(targetIndex, savedRangeRef.current.length);
      }

      editor.insertEmbed(targetIndex, 'image', cleanUrl, 'user');
      editor.setSelection(targetIndex + 1, 0, 'user');
      onChange(editor.root.innerHTML);
    }

    setUrlInput('');
    setShowUrlBar(false);
    savedRangeRef.current = null;
  };

  return (
    <div className="min-w-0 w-full space-y-2">
      {label && (
        <label className="block text-gray-400 mb-1 uppercase font-bold">{label}</label>
      )}

      {showUrlBar && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#0b0f19] border border-amber-500/50 rounded p-2.5">
          <input
            type="url"
            autoFocus
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyImageUrl();
              } else if (e.key === 'Escape') {
                setShowUrlBar(false);
                setUrlInput('');
              }
            }}
            placeholder="Paste image URL (https://...)"
            className="flex-1 min-w-0 bg-black border border-gray-700 focus:border-amber-500 rounded px-3 py-1.5 text-xs text-white outline-none"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleApplyImageUrl}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded text-xs cursor-pointer"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlBar(false);
                setUrlInput('');
              }}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold uppercase rounded text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white text-black rounded overflow-hidden min-w-0 w-full [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:h-auto [&_.ql-editor_img]:rounded [&_.ql-editor_img]:my-2">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={QUILL_FORMATS}
          placeholder={placeholder}
          className="min-h-[220px]"
        />
      </div>
    </div>
  );
}