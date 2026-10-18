'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, Terminal, ArrowLeft, ShieldCheck, Radio, CheckCircle2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { sendContactMessage, resetContactState } from '@/store/slices/baseSlice';

export default function ContactPage() {
  const dispatch = useDispatch<AppDispatch>();

  // 🌟 Redux Store State
  const { loading: submitting, success, error } = useSelector(
    (state: RootState) => state.base.contact
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Operational Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🌟 Dispatching Redux Async Thunk Action
    const resultAction = await dispatch(sendContactMessage(formData));

    if (sendContactMessage.fulfilled.match(resultAction)) {
      setFormData({ name: '', email: '', subject: 'Operational Inquiry', message: '' });
    }
  };

  const handleReset = () => {
    dispatch(resetContactState());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 md:p-10 font-mono text-white">
      {/* Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        <span>Return to Command Center</span>
      </Link>

      {/* Hero Header Banner */}
      <div className="relative border border-amber-500/20 bg-black/40 rounded-lg p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-amber-500 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            SECURE COMMS // TRANSMISSION DESK
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider">
            CONTACT <span className="text-amber-500">COMMAND</span>
          </h1>

          <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Establish secure communication channels with Battle Theory research command, media syndication desks, or technical operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Communications Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-lg p-6 space-y-6">
            <div className="border-b border-gray-800 pb-3 flex items-center gap-2 text-amber-500 text-xs uppercase font-bold">
              <Terminal className="w-4 h-4" />
              <span>COMMS FREQUENCY</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Primary Email Desk</span>
                <a href="mailto:uzairkh52@gmail.com" className="text-amber-500 hover:text-amber-400 font-bold break-all">
                  uzairkh52@gmail.com
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Operational Status</span>
                <span className="text-emerald-400 inline-flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE // 24/7 MONITORING
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Response Protocol</span>
                <p className="text-gray-400 leading-relaxed font-sans">
                  All transmissions are encrypted and reviewed by research desk personnel within 24–48 tactical hours.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6 space-y-3">
            <div className="text-amber-500 font-bold uppercase text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>SECURE PROTOCOL</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed font-sans">
              Submissions are governed by our privacy directives. Data is strictly utilized for addressing operational inquiries.
            </p>
          </div>
        </div>

        {/* Right Side: Transmission Form */}
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-lg p-6 md:p-8">
          {success ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold uppercase text-white">Transmission Successful</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto font-sans leading-relaxed">
                Your briefing inquiry has been securely routed to Battle Theory communications command. We will respond via secure channel shortly.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-colors"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-800 pb-3 flex items-center gap-2 text-amber-500 text-xs uppercase font-bold">
                <Mail className="w-4 h-4" />
                <span>SECURE TRANSMISSION FORM</span>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-xs">
                  [ ERROR: {error} ]
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">
                    Commander / Sender Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Captain Miller"
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-xs text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider block">
                    Secure Email Address <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="miller@battletheory.com"
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-xs text-white focus:border-amber-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider block">
                  Inquiry Classification <span className="text-amber-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-xs text-white focus:border-amber-500 outline-none transition-colors uppercase"
                >
                  <option value="Operational Inquiry">Operational Inquiry</option>
                  <option value="Media Syndication & Partnership">Media Syndication & Partnership</option>
                  <option value="Content Corrections & Archives">Content Corrections & Archives</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider block">
                  Briefing Message / Details <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your tactical notes, feedback, or syndication inquiry here..."
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded p-3 text-xs text-white font-sans focus:border-amber-500 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-600/10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>[ TRANSMITTING BRIEFING... ]</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>TRANSMIT BRIEFING TO COMMAND</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}