'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Wait until component mounts on client side (Redux rehydration completes)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 2. Perform authentication check ONLY after hydration
  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated || !user?.isAdmin) {
        router.push('/login');
      }
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Show loading state while checking hydration & auth status
  if (!isHydrated || !isAuthenticated || !user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-amber-500 font-mono text-xs tracking-widest uppercase animate-pulse">
          [ VERIFYING COMMAND CLEARANCE... ]
        </p>
      </div>
    );
  }

  return <>{children}</>;
}