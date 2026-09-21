'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials } from '@/store/slices/authSlice';
import API from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      
      // Backend returns: { _id, username, email, isAdmin, token }
      const token = res.data.token;
      
      // Extract user object (excluding token)
      const userData = {
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email,
        isAdmin: res.data.isAdmin,
      };

      // Dispatch to Redux (setCredentials updates redux + localStorage properly)
      dispatch(setCredentials({ user: userData, token }));

      // Redirect based on role
      if (userData.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="military-card p-8 w-full max-w-md space-y-4">
        <h2 className="text-xl font-black text-amber-500 uppercase tracking-widest text-center">
          Commander Authentication
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

        <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors">
          Authorize Access
        </button>
      </form>
    </div>
  );
}