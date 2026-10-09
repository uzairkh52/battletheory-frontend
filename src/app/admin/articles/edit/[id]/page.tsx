'use client'; // 🌟 Isay Client Component bana dein

import EditArticleForm from '@/components/admin/article/EditArticleForm';
import { use } from 'react';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <EditArticleForm articleId={articleId} />
    </div>
  );
}