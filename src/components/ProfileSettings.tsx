"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Save, 
  Upload, 
  Globe, 
  Lock, 
  Copy,
  Check,
  ExternalLink,
  X
} from 'lucide-react';
import { 
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
  removeAvatar,
  onAuthChange,
  type UserProfile
} from '../lib/data';
import { toast } from 'sonner';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
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
    profile_public: false
  });

  // Auth subscription
  useEffect(() => {
    const { data: { subscription } } = onAuthChange((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await fetchUserProfile(userId);
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
    if (!user?.id) {
      console.error('No user ID found');
      return;
    }
    
    console.log('Saving profile with data:', formData);
    console.log('User ID:', user.id);
    
    setSaving(true);
    try {
      const updatedProfile = await updateUserProfile(user.id, formData);
      console.log('Updated profile result:', updatedProfile);
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Profile saved successfully');
        console.log('Profile saved successfully, navigating to dashboard');
        // Show success feedback and navigate back
         navigate('/');
      } else {
        console.error('updateUserProfile returned null');
        toast.error('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save profile. Please check the console for details.');
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

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Automatically upload the avatar immediately
      if (user?.id) {
        setUploadingAvatar(true);
        try {
          console.log('Auto-uploading avatar immediately after selection...');
          
          // Remove old avatar if exists
          if (formData.avatar_url) {
            try {
              await removeAvatar(formData.avatar_url);
            } catch (error) {
              console.warn('Failed to remove old avatar:', error);
            }
          }
          
          // Upload new avatar to Supabase storage
          const avatarUrl = await uploadAvatar(file, user.id);
          console.log('Avatar auto-uploaded successfully:', avatarUrl);
          
          // Update the avatar_url with the uploaded file URL
          handleInputChange('avatar_url', avatarUrl);
          toast.success('Avatar updated');
          
          // Clear the file state since it's now uploaded
          setAvatarFile(null);
          
        } catch (error) {
          console.error('Error auto-uploading avatar:', error);
          toast.error('Failed to upload avatar. Please try again.');
        } finally {
          setUploadingAvatar(false);
        }
      }
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user?.id) return;
    
    setUploadingAvatar(true);
    try {
      // Remove old avatar if exists
      if (formData.avatar_url) {
        try {
          await removeAvatar(formData.avatar_url);
        } catch (error) {
          console.warn('Failed to remove old avatar:', error);
        }
      }
      
      // Upload new avatar to Supabase storage
      const avatarUrl = await uploadAvatar(avatarFile, user.id);
      
      // Update the avatar_url with the uploaded file URL
      handleInputChange('avatar_url', avatarUrl);
      toast.success('Avatar updated');
      
      // Clear the file state
      setAvatarFile(null);
      setAvatarPreview('');
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (formData.avatar_url) {
      try {
        await removeAvatar(formData.avatar_url);
      } catch (error) {
        console.warn('Failed to remove avatar from storage:', error);
      }
    }
    setAvatarFile(null);
    setAvatarPreview('');
    handleInputChange('avatar_url', '');
    toast.success('Avatar removed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-none sm:rounded-3xl border-0 sm:border border-white/20 min-h-[100svh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-4 sm:p-8 border-b border-white/10 bg-slate-900/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/60">Manage your profile and sharing preferences</p>
              </div>
            </div>
            <button 
               onClick={() => navigate('/')}
               className="p-2 hover:bg-white/10 rounded-xl transition-colors"
             >
              <X className="w-6 h-6 text-white/60 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 sm:p-8 pb-28 sm:pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
            {/* Profile Information */}
            <div className="xl:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </h2>
            
                <div className="space-y-4">
                  {/* Avatar Section */}
                  <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
                    <label className="block text-sm font-medium text-white/80 mb-4">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        {(avatarPreview || formData.avatar_url) ? (
                          <img 
                            src={avatarPreview || formData.avatar_url} 
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-white/10 rounded-2xl border-2 border-dashed border-white/30 flex items-center justify-center">
                            <User className="w-8 h-8 text-white/40" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className={`cursor-pointer ${uploadingAvatar ? 'opacity-50 pointer-events-none' : ''}`}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFileChange}
                              className="hidden"
                              disabled={uploadingAvatar}
                            />
                            <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-colors min-h-[44px]">
                              {uploadingAvatar ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              <span>{uploadingAvatar ? 'Uploading...' : 'Choose Image'}</span>
                            </div>
                          </label>
                          
                          {(avatarPreview || formData.avatar_url) && (
                            <button
                              onClick={handleRemoveAvatar}
                              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="text-xs text-white/50">
                          Select an image file to upload automatically (max 5MB). Supported formats: JPG, PNG, GIF, WebP
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Username and Display Name - Side by Side */}
                  <div className="flex flex-wrap gap-4">
                    {/* Username */}
                    <div className="flex-1 min-w-0 bg-white/5 rounded-2xl p-4 sm:p-6">
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="your-username"
                      />
                      <p className="text-xs text-white/50 mt-2">
                        This will be used in your public profile URL
                      </p>
                    </div>

                    {/* Display Name */}
                    <div className="flex-1 min-w-0 bg-white/5 rounded-2xl p-4 sm:p-6">
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.display_name}
                        onChange={(e) => handleInputChange('display_name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Your Display Name"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                      placeholder="Tell others about yourself..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Sharing Sidebar */}
            <div className="xl:col-span-1">
              <div className="xl:sticky xl:top-8">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Privacy & Sharing
                </h2>
                
                {/* Public Profile Toggle */}
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {formData.profile_public ? (
                          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white/60" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">Public Profile</h3>
                          <p className="text-white/60 text-sm">
                            {formData.profile_public 
                              ? 'Your profile is visible to everyone'
                              : 'Your profile is private'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.profile_public}
                          onChange={(e) => handleInputChange('profile_public', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    
                    {/* Share URL */}
                    {formData.profile_public && formData.username && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-white/10 pt-6"
                      >
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-white/80">
                            Public Profile Link
                          </label>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 text-sm font-mono truncate">
                              {`${window.location.origin}/profile/${formData.username}`}
                            </div>
                            <motion.button
                              onClick={handleCopyShareUrl}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                              {copySuccess ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </motion.button>
                            <motion.a
                              href={`/profile/${formData.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Username Required Message */}
                    {formData.profile_public && !formData.username && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-white/10 pt-6"
                      >
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                          <p className="text-yellow-200 text-sm">
                            ⚠️ Please set a username to enable your public profile link.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button (desktop/tablet) */}
        <div className="hidden sm:block p-8">
          <div className="flex justify-end pt-6 border-t border-white/10">
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

        {/* Mobile action bar */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 px-4 pb-[env(safe-area-inset-bottom)] pt-3 border-t border-white/10 bg-slate-900/60 backdrop-blur">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
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