'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/context';
import { Card, CardContent, CardHeader, CardTitle } from '../../lib/ui/card';
import { Button } from '../../lib/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ open, onClose }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setBio(user.bio || '');
    }
  }, [user, open]);

  if (!open) return null;

  const onSave = () => {
    updateUser({ name, avatar, bio });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-2xl p-6 text-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display text-purple-300">Edit Profile</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">✕</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-neutral-400 mb-1">Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"/>
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Avatar URL</label>
            <input value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100"/>
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-neutral-100" rows={4}/>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" className="border-neutral-600/50" onClick={onClose}>Cancel</Button>
          <Button className="btn-professional btn-primary" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};
