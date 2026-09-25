'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginUser } from '@/store/slices/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload.user;
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="military-card p-8 w-full max-w-md space-y-4">
        <h2 className="text-xl font-black text-amber-500 uppercase tracking-widest text-center">
          User Login
        </h2>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs font-mono rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Normal Register Navigation Link */}
        <div className="pt-4 border-t border-gray-800/80 text-center">
          <p className="text-xs text-gray-400 font-mono">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-amber-500 font-bold hover:underline uppercase ml-1"
            >
              Register Here →
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}