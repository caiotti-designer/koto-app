"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Save, 
  Upload, 
  Globe, 
  Lock, 
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { 
  fetchUserProfile,
  updateUserProfile,
  onAuthChange,
  type UserProfile
} from '../lib/data';

const ProfileSettings: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    profile_public: false
  });

  // Auth subscription
  useEffect(() => {
    const sub = onAuthChange((u) => setUser(u));
    return () => {
      // best-effort cleanup for supabase v2 subscription wrapper
      try { (sub as any)?.data?.subscription?.unsubscribe?.(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const profileData = await fetchUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setFormData({
          username: profileData.username || '',
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || '',
          profile_public: profileData.profile_public || false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const updatedProfile = await updateUserProfile(user.id, formData);
      if (updatedProfile) {
        setProfile(updatedProfile);
        // Show success feedback
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error feedback
    } finally {
      setSaving(false);
    }
  };



  const handleCopyShareUrl = async () => {
    if (!profile?.username) return;
    
    const shareUrl = `${window.location.origin}/profile/${profile.username}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <p className="text-white/60">Manage your profile and sharing preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Avatar URL
              </label>
              <div className="flex items-center space-x-4">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white/60" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="your-username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-white/50 text-xs mt-1">
                This will be used in your public profile URL
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                placeholder="Your Display Name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell others about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Privacy & Sharing */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Privacy & Sharing</h2>
            
            {/* Public Profile Toggle */}
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {formData.profile_public ? (
                    <Globe className="w-6 h-6 text-green-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">Public Profile</h3>
                    <p className="text-white/60 text-sm">
                      Allow others to view your profile and public content
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleInputChange('profile_public', !formData.profile_public)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.profile_public ? 'bg-green-500' : 'bg-white/20'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{
                      x: formData.profile_public ? 24 : 2
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
              
              {formData.profile_public && formData.username && (
                <div className="mt-4 p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Your public profile URL:</p>
                      <code className="text-green-400 text-sm">
                        {window.location.origin}/profile/{formData.username}
                      </code>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={handleCopyShareUrl}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </motion.button>
                      <motion.a
                        href={`/profile/${formData.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-white/20">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;