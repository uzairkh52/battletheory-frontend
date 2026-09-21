'use client';

import { useState } from 'react';
import API from '@/lib/api';

export default function BattleForm() {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [theater, setTheater] = useState('European');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    try {
      await API.post('/battles', { 
        name, 
        year, 
        location, 
        theater, 
        description,
        coordinates: { lat: 0, lng: 0 } // Default coordinates for validation
      });
      setStatus({ type: 'success', msg: 'Battle archive added successfully!' });
      setName(''); setYear(''); setLocation(''); setTheater('European'); setDescription('');
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to add battle.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Archive New Battle</h3>

      {status.msg && (
        <div className={`p-3 rounded text-xs font-mono border ${
          status.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-red-900/30 border-red-800 text-red-400'
        }`}>
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">BATTLE NAME</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">YEAR</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">LOCATION</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1">THEATER OF WAR</label>
          <select
            value={theater}
            onChange={(e) => setTheater(e.target.value)}
            className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          >
            <option value="European">European</option>
            <option value="Pacific">Pacific</option>
            <option value="Eastern Front">Eastern Front</option>
            <option value="North Africa">North Africa</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 mb-1">TACTICAL DETAILS</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
        />
      </div>

      <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors">
        Save Battle Data
      </button>
    </form>
  );
}