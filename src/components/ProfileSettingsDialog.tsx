"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Upload, Copy, Check, Globe, Lock, Save, X, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import supabase from '../lib/supabaseClient';
import { fetchUserProfile, type UserProfile, updateUserProfile, uploadAvatar, removeAvatar } from '../lib/data';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
  initialProfile: UserProfile | null;
  onSaved?: (profile: UserProfile) => void;
};

const usernamePattern = /^[a-z0-9_\-]+$/; // lowercase letters, numbers, underscore, hyphen

const ProfileSettingsDialog: React.FC<Props> = ({ open, onOpenChange, userId, initialProfile, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    profile_public: false,
  });
  const profileUrl = useMemo(() => {
    const u = formData.username?.trim();
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return u ? `${base}/profile/${u}` : `${base}/profile/`;
  }, [formData.username]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      try {
        if (userId) {
          const p = await fetchUserProfile(userId);
          const profile: UserProfile | null = (p as UserProfile | null) ?? (initialProfile as UserProfile | null) ?? null;
          if (profile) {
            setFormData({
              username: profile.username || '',
              display_name: profile.display_name || '',
              bio: profile.bio || '',
              avatar_url: profile.avatar_url || '',
              profile_public: !!profile.profile_public,
            });
          } else if (initialProfile) {
            setFormData({
              username: initialProfile.username || '',
              display_name: initialProfile.display_name || '',
              bio: initialProfile.bio || '',
              avatar_url: initialProfile.avatar_url || '',
              profile_public: !!initialProfile.profile_public,
            });
          }
        }
      } catch (e) {
        console.error('Failed to load profile for modal:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, userId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
      toast.success('Profile link copied');
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploadingAvatar(true);
    try {
      // If existing, attempt to remove old
      if (formData.avatar_url) {
        try { await removeAvatar(formData.avatar_url); } catch {}
      }
      const url = await uploadAvatar(file, userId);
      setFormData((p) => ({ ...p, avatar_url: url }));
      setAvatarPreview(url);
    } catch (e) {
      console.error('Avatar upload failed', e);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatarLocal = async () => {
    if (!formData.avatar_url) return;
    try { await removeAvatar(formData.avatar_url); } catch {}
    setFormData((p) => ({ ...p, avatar_url: '' }));
    setAvatarPreview('');
  };

  const validate = async (): Promise<{ ok: boolean; msg?: string }> => {
    const u = formData.username.trim();
    if (u) {
      if (u !== u.toLowerCase()) return { ok: false, msg: 'Username must be lowercase' };
      if (!usernamePattern.test(u)) return { ok: false, msg: 'Only lowercase letters, numbers, _ and -' };
      // uniqueness
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username')
        .eq('username', u)
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn('Username check error:', error);
      }
      if (data && data.id !== userId) {
        return { ok: false, msg: 'Username already taken' };
      }
    }
    if (formData.bio.length > 200) return { ok: false, msg: 'Bio must be at most 200 characters' };
    return { ok: true };
  };

  const onSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const v = await validate();
      if (!v.ok) {
        toast.error(v.msg || 'Invalid form');
        return;
      }
      const updated = await updateUserProfile(userId, formData);
      if (updated) {
        toast.success('Profile updated');
        onSaved?.(updated);
        onOpenChange(false);
      } else {
        toast.error('Failed to save changes');
      }
    } catch (e) {
      console.error('Save failed', e);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const disabled = saving || loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Update your avatar, name, bio and visibility.</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
              {avatarPreview || formData.avatar_url ? (
                <img src={avatarPreview || formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <label className={`cursor-pointer ${uploadingAvatar || disabled ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={uploadingAvatar || disabled} />
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 text-sm">
                    {uploadingAvatar ? <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{uploadingAvatar ? 'Uploading...' : 'Choose Image'}</span>
                  </div>
                </label>
                {(avatarPreview || formData.avatar_url) && (
                  <Button variant="ghost" onClick={removeAvatarLocal} disabled={disabled} className="text-red-600 dark:text-red-400">
                    Remove
                  </Button>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Max 5MB. JPG, PNG, GIF, WebP.</div>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <Label className="mb-2 block">Username</Label>
              <Input
                placeholder="your-username"
                value={formData.username}
                onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value.toLowerCase() }))}
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Used in your public profile URL.</p>
            </div>
            <div>
              <Label className="mb-2 block">Display Name</Label>
              <Input
                placeholder="Your name"
                value={formData.display_name}
                onChange={(e) => setFormData((p) => ({ ...p, display_name: e.target.value }))}
                disabled={disabled}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            <Label className="mb-2 block">Bio</Label>
            <Textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, 200) }))}
              disabled={disabled}
              placeholder="Tell others about yourself (max 200 chars)"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formData.bio.length}/200</div>
          </div>

          {/* Public toggle */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center gap-2">
              {formData.profile_public ? (
                <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center"><Globe className="w-4 h-4 text-green-500" /></div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center"><Lock className="w-4 h-4 text-slate-500" /></div>
              )}
              <div>
                <div className="text-sm font-medium">Public Profile</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Allow others to view your profile</div>
              </div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={formData.profile_public} onChange={(e) => setFormData((p) => ({ ...p, profile_public: e.target.checked }))} />
              <div className={`w-10 h-6 rounded-full transition-colors ${formData.profile_public ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`h-6 w-6 bg-white rounded-full shadow -mt-0.5 transform transition-transform ${formData.profile_public ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>

          {/* Profile link */}
          <div className="mt-4 space-y-2">
            <Label className="block">Profile Link</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono truncate">{profileUrl}</div>
              <Button variant="secondary" onClick={handleCopy} disabled={!formData.username}>
                {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <a href={formData.username ? `/profile/${formData.username}` : '#'} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 ${formData.username ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 gap-2 sm:gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={onSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
