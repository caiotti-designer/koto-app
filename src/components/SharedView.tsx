"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
          const token = searchParams.get('token');
          if (!token) throw new Error('Share token is required');
          const promptData = await fetchSharedPrompt(token);
          if (!promptData) throw new Error('Prompt not found');
          setPrompt(promptData);
        } else if (type === 'tool') {
          const token = searchParams.get('token');
          if (!token) throw new Error('Share token is required');
          const toolData = await fetchSharedTool(token);
          if (!toolData) throw new Error('Tool not found');
          setTool(toolData);
        } else if (type === 'profile') {
          const username = params.username;
          if (!username) throw new Error('Username is required');
          const data = await fetchPublicProfile(username);
          setProfileData(data);
        }
      } catch (err) {
        console.error('Error loading content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [type, params.username, searchParams]);

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
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <motion.button
            onClick={handleGoBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <motion.button
          onClick={handleGoBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 sm:mb-8 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all min-h-[44px] sm:min-h-auto"
        >
          <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline text-sm sm:text-base">Back</span>
        </motion.button>
        
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            {type === 'prompt' && 'Shared Prompt'}
            {type === 'tool' && 'Shared Tool'}
            {type === 'profile' && `${profileData?.profile.display_name || profileData?.profile.username}'s Profile`}
          </h1>
          <div className="w-[44px] sm:w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {type === 'prompt' && prompt && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
              {prompt.cover_image && (
                <img
                  src={prompt.cover_image}
                  alt={prompt.title}
                  className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-6"
                />
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-2 leading-tight">{prompt.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/60">
                    <span className="bg-white/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{prompt.model}</span>
                    <span className="bg-white/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{prompt.category}</span>
                    {prompt.subcategory && (
                      <span className="bg-white/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{prompt.subcategory}</span>
                    )}
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleCopy(prompt.content)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 px-4 py-3 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors min-h-[44px] w-full sm:w-auto"
                >
                  {copySuccess ? <Check className="w-5 h-5 sm:w-4 sm:h-4" /> : <Copy className="w-5 h-5 sm:w-4 sm:h-4" />}
                  <span className="text-sm sm:text-base">{copySuccess ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
              
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {prompt.tags.map((tag, index) => (
                      <span key={index} className="bg-white/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white/80 leading-tight">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Prompt Content</h3>
                <div className="bg-black/20 rounded-lg p-3 sm:p-4 max-h-[60vh] overflow-y-auto">
                  <pre className="text-white/90 whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed break-words">
                    {prompt.content}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {type === 'tool' && tool && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  {tool.favicon ? (
                    <img src={tool.favicon} alt={tool.name} className="w-12 h-12 rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-white/60" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{tool.name}</h2>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
                      {tool.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">{tool.description}</p>
                
                <motion.a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Tool</span>
                </motion.a>
                
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">URL:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/80 text-sm font-mono">
                        {tool.url}
                      </span>
                      <motion.button
                        onClick={() => handleCopy(tool.url)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'profile' && profileData && (
            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <div className="flex items-center space-x-6">
                  {profileData.profile.avatar_url ? (
                    <img
                      src={profileData.profile.avatar_url}
                      alt={profileData.profile.display_name || profileData.profile.username}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white/60" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {profileData.profile.display_name || profileData.profile.username}
                    </h1>
                    {profileData.profile.bio && (
                      <p className="text-white/80">{profileData.profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="space-y-8">
                {/* Prompts */}
                {profileData.prompts.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <MessageSquare className="w-6 h-6 mr-2" />
                      Prompts ({profileData.prompts.length})
                    </h2>
                    <div className="grid gap-6">
                      {profileData.prompts.map((prompt) => (
                        <div key={prompt.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-white">{prompt.title}</h3>
                            <motion.button
                              onClick={() => handleCopy(prompt.content)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </motion.button>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
                              {prompt.model}
                            </span>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
                              {prompt.category}
                            </span>
                          </div>
                          <p className="text-white/80 line-clamp-3">{prompt.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools */}
                {profileData.tools.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Wrench className="w-6 h-6 mr-2" />
                      Tools ({profileData.tools.length})
                    </h2>
                    <div className="grid gap-6">
                      {profileData.tools.map((tool) => (
                        <div key={tool.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                          <div className="flex items-start space-x-4">
                            {tool.favicon ? (
                              <img src={tool.favicon} alt={tool.name} className="w-10 h-10 rounded-lg" />
                            ) : (
                              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-white/60" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
                              <motion.a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                              >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">Visit</span>
                              </motion.a>
                              <p className="text-white/80 mt-2">{tool.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
                                  {tool.category}
                                </span>
                                <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/60">
                                  {new URL(tool.url).hostname}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedView;