'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactFormProps {
  playInteraction: (type: 'chakra' | 'pulse' | 'sword' | 'lightning') => void;
}

export function ContactForm({ playInteraction }: ContactFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playInteraction('lightning');
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        playInteraction('chakra');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-[#f7f3e9] border-[6px] border-[#8b5a2b] rounded-lg shadow-2xl relative overflow-hidden text-amber-950 font-serif">
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(139,90,43,0.05)_90%)] pointer-events-none" />
      
      {/* Scroll core title */}
      <div className="border-b-2 border-amber-900/25 pb-2 text-center">
        <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest font-bold">SEND AN S-RANK MISSION PROPOSAL</span>
        <h2 className="text-xl font-bold font-serif mt-1">{"THE HOKAGE'S SUMMONS"}</h2>
      </div>

      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-8 text-center"
        >
          <span className="text-4xl">📜</span>
          <h3 className="text-lg font-bold text-emerald-800 mt-4">MISSION SCROLL DELIVERED!</h3>
          <p className="text-xs text-amber-900/80 font-mono mt-2 leading-relaxed">
            {"\"Your message has been encrypted and sent via messenger hawk. Roshan Bhagat will respond soon.\""}
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 px-4 py-2 bg-amber-900 text-white rounded text-xs font-mono transition-all"
          >
            WRITE ANOTHER SUMMONS
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 text-xs font-mono">
          <div>
            <label className="block text-amber-900 font-bold uppercase tracking-wider mb-1">PROTAGONIST NAME:</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-[#fdfbf7] border border-amber-900/35 rounded focus:outline-none focus:border-orange-500 font-serif text-sm"
              placeholder="e.g. Kakashi Hatake"
            />
          </div>

          <div>
            <label className="block text-amber-900 font-bold uppercase tracking-wider mb-1">CONTACT CHANNELS (EMAIL):</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 bg-[#fdfbf7] border border-amber-900/35 rounded focus:outline-none focus:border-orange-500 font-serif text-sm"
              placeholder="e.g. copy-ninja@konoha.org"
            />
          </div>

          <div>
            <label className="block text-amber-900 font-bold uppercase tracking-wider mb-1">MISSION SCROLL CONTENT:</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 bg-[#fdfbf7] border border-amber-900/35 rounded focus:outline-none focus:border-orange-500 font-serif text-sm leading-relaxed"
              placeholder="Detail your S-Rank project specifications..."
            />
          </div>

          {status === 'error' && (
            <p className="text-red-600 font-bold text-center">Hawk failed to deliver. Please check connection.</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-white rounded font-bold tracking-widest font-mono transition-all text-xs flex justify-center items-center gap-2"
          >
            <span>{status === 'submitting' ? 'DISPATCHING HAWK...' : 'DISPATCH MISSION SCROLL'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
export default ContactForm;
