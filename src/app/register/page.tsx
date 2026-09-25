'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/store/store';
import { registerUser } from '@/store/slices/authSlice';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(registerUser({ username, email, password }));

    if (registerUser.fulfilled.match(resultAction)) {
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 military-card space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black tracking-wider text-amber-500 uppercase">
          Request Field Clearance
        </h1>
        <p className="text-xs text-gray-400">Register new profile</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 text-xs p-3 rounded text-center font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
            placeholder="Vanguard"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
            placeholder="user@battletheory.com"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">SECURITY PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full amber-glow-btn mt-2 font-black uppercase text-sm tracking-wider cursor-pointer disabled:opacity-50"
        >
          {loading ? 'REGISTERING...' : 'CREATE PROFILE'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500">
        Already have clearance?{' '}
        <Link href="/login" className="text-amber-500 hover:underline font-bold">
          Authenticate
        </Link>
      </p>
    </div>
  );
}