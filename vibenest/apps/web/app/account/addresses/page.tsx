'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      line1: 'Flat 405, Block B, Premium Heights',
      line2: 'Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      isDefault: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !city || !state || !pincode) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      line1,
      line2,
      city,
      state,
      pincode,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, newAddr]);
    setShowAddForm(false);
    setLine1('');
    setLine2('');
    setCity('');
    setState('');
    setPincode('');
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 font-ui text-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">Saved Addresses</h2>
          <p className="text-brand-gray text-xs">Manage your shipping destinations</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1"
          >
            <Plus size={14} /> Add Address
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAddress} className="bg-white/[0.01] border border-white/5 p-6 rounded-lg space-y-4 max-w-lg">
          <h3 className="font-semibold text-white">Add New Shipping Address</h3>
          
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-white/70">Address Line 1 *</label>
            <input type="text" value={line1} onChange={e => setLine1(e.target.value)} placeholder="House, flat, building, street name" className="input-field" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-white/70">Address Line 2</label>
            <input type="text" value={line2} onChange={e => setLine2(e.target.value)} placeholder="Floor, landmark" className="input-field" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-bold text-white/70">City *</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="input-field" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-bold text-white/70">State *</label>
              <input type="text" value={state} onChange={e => setState(e.target.value)} className="input-field" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-bold text-white/70">Pincode *</label>
              <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="input-field" required />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary py-2 text-xs font-bold flex-1">Cancel</button>
            <button type="submit" className="btn-primary py-2 text-xs font-bold flex-1">Save Address</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className="border border-white/5 bg-white/[0.01] rounded-lg p-5 flex flex-col justify-between min-h-36">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <MapPin size={16} className="text-brand-blue" />
                {addr.isDefault && (
                  <span className="bg-brand-gold/10 text-brand-gold font-bold px-2 py-0.5 rounded text-[9px] uppercase border border-brand-gold/20">Default</span>
                )}
              </div>
              <p className="text-white/80 leading-relaxed text-xs">
                {addr.line1}
                {addr.line2 && `, ${addr.line2}`}
                <br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => handleDelete(addr.id)}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !showAddForm && (
          <p className="text-brand-gray/50 py-10 col-span-2 text-center text-xs">No saved shipping addresses found.</p>
        )}
      </div>
    </div>
  );
}
