'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Check, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock profile updates
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-ui">
      <div>
        <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">My Profile</h2>
        <p className="text-brand-gray text-xs">View and update your personal details</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-4 py-3 rounded flex items-center gap-2">
          <Check size={16} />
          <span>Profile records updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4 max-w-lg text-sm">
        <div className="space-y-1.5">
          <label className="text-xs uppercase font-bold text-white/70">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase font-bold text-white/70">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            disabled
            required
          />
          <p className="text-[10px] text-brand-gray/50">Email edits require support ticket verification.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase font-bold text-white/70">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary py-2.5 text-xs font-bold uppercase mt-6 px-8">
          Save Changes
        </button>
      </form>
    </div>
  );
}
