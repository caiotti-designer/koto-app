"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Wrench, 
  ExternalLink, 
  Copy, 
  User, 
  Globe,
  ArrowLeft,
  Check
} from 'lucide-react';
import { 
  fetchSharedPrompt, 
  fetchSharedTool, 
  fetchPublicProfile,
  type PromptRow,
  type ToolRow,
  type UserProfile
} from '../lib/data';

interface SharedViewProps {
  type: 'prompt' | 'tool' | 'profile';
}

const SharedView: React.FC<SharedViewProps> = ({ type }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // State for different content types
  const [prompt, setPrompt] = useState<PromptRow | null>(null);
  const [tool, setTool] = useState<ToolRow | null>(null);
  const [profileData, setProfileData] = useState<{
    profile: UserProfile;
    prompts: PromptRow[];
    tools: ToolRow[];
  } | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (type === 'prompt') {
          const token = params.token || searchParams.get('token');
          if (!token) {
            setError('Share token is required');
            return;
          }
          const data = await fetchSharedPrompt(token);
          if (!data) {
            setError('Prompt not found or no longer shared');
            return;
          }
          setPrompt(data);
        } else if (type === 'tool') {
          const token = params.token || searchParams.get('token');
          if (!token) {
            setError('Share token is required');
            return;
          }
          const data = await fetchSharedTool(token);
          if (!data) {
            setError('Tool not found or no longer shared');
            return;
          }
          setTool(data);
        } else if (type === 'profile') {
          const username = params.username;
          if (!username) {
            setError('Username is required');
            return;
          }
          const data = await fetchPublicProfile(username);
          if (!data) {
            setError('Profile not found or not public');
            return;
          }
          setProfileData(data);
        }
      } catch (err) {
        console.error('Error loading shared content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [type, params, searchParams]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              {type === 'prompt' && 'Shared Prompt'}
              {type === 'tool' && 'Shared Tool'}
              {type === 'profile' && `${profileData?.profile.display_name || profileData?.profile.username}'s Profile`}
            </h1>
          </div>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        {type === 'prompt' && prompt && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              {prompt.cover_image && (
                <div className="mb-6">
                  <img 
                    src={prompt.cover_image} 
                    alt={prompt.title}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{prompt.title}</h2>
                  <div className="flex items-center space-x-4 text-white/60">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{prompt.model}</span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{prompt.category}</span>
                    {prompt.subcategory && (
                      <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{prompt.subcategory}</span>
                    )}
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleCopy(prompt.content)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                >
                  {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
              
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag, index) => (
                      <span key={index} className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Prompt Content</h3>
                <pre className="text-white/90 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {prompt.content}
                </pre>
              </div>
            </div>
          </div>
        )}

        {type === 'tool' && tool && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {tool.favicon && (
                    <img src={tool.favicon} alt={tool.name} className="w-12 h-12 rounded-xl" />
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{tool.name}</h2>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
                      {tool.category}
                    </span>
                  </div>
                </div>
                
                <motion.a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Tool</span>
                </motion.a>
              </div>
              
              {tool.description && (
                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                  <p className="text-white/90 leading-relaxed">{tool.description}</p>
                </div>
              )}
              
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">URL</h3>
                <div className="flex items-center justify-between">
                  <code className="text-white/90 font-mono text-sm bg-white/10 px-3 py-2 rounded-lg flex-1 mr-4">
                    {tool.url}
                  </code>
                  <motion.button
                    onClick={() => handleCopy(tool.url)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'profile' && profileData && (
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
              <div className="flex items-center space-x-6">
                {profileData.profile.avatar_url ? (
                  <img 
                    src={profileData.profile.avatar_url} 
                    alt={profileData.profile.display_name || profileData.profile.username}
                    className="w-20 h-20 rounded-2xl"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profileData.profile.display_name || profileData.profile.username}
                  </h1>
                  {profileData.profile.username && (
                    <p className="text-white/60 mb-2">@{profileData.profile.username}</p>
                  )}
                  {profileData.profile.bio && (
                    <p className="text-white/80">{profileData.profile.bio}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profileData.prompts.length}</div>
                  <div className="text-white/60 text-sm">Public Prompts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{profileData.tools.length}</div>
                  <div className="text-white/60 text-sm">Public Tools</div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Prompts */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Public Prompts</span>
                </h2>
                
                {profileData.prompts.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.prompts.map((prompt) => (
                      <div key={prompt.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                          <motion.button
                            onClick={() => handleCopy(prompt.content)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/60">{prompt.model}</span>
                          <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/60">{prompt.category}</span>
                        </div>
                        
                        <p className="text-white/80 text-sm line-clamp-3">
                          {prompt.content.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No public prompts yet</p>
                  </div>
                )}
              </div>

              {/* Tools */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Wrench className="w-6 h-6" />
                  <span>Public Tools</span>
                </h2>
                
                {profileData.tools.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.tools.map((tool) => (
                      <div key={tool.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {tool.favicon && (
                              <img src={tool.favicon} alt={tool.name} className="w-8 h-8 rounded" />
                            )}
                            <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                          </div>
                          <motion.a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        </div>
                        
                        {tool.description && (
                          <p className="text-white/80 text-sm mb-4">{tool.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="bg-white/10 px-2 py-1 rounded text-xs text-white/60">
                            {tool.category}
                          </span>
                          <code className="text-white/60 text-xs">
                            {new URL(tool.url).hostname}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <Wrench className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No public tools yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedView;