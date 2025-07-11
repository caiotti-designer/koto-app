"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link, Loader2, Globe, Sparkles } from 'lucide-react';
interface NewToolDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (toolData: {
    name: string;
    url: string;
    category: string;
    logo: string;
    description?: string;
  }) => void;
  mpid?: string;
}
const NewToolDialog: React.FC<NewToolDialogProps> = ({
  open,
  onClose,
  onSave
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const categories = ['Design', 'Development', 'Productivity', 'Marketing', 'Analytics', 'Communication', 'Finance', 'Education'];
  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);

    // Auto-fill logic when URL is pasted
    if (newUrl && newUrl.startsWith('http')) {
      setIsAnalyzing(true);

      // Simulate AI analysis delay
      setTimeout(() => {
        // Extract domain name for basic info
        try {
          const domain = new URL(newUrl).hostname.replace('www.', '');
          const siteName = domain.split('.')[0];

          // Basic auto-fill based on common sites
          const siteInfo = getSiteInfo(domain);
          setName(siteInfo.name || siteName.charAt(0).toUpperCase() + siteName.slice(1));
          setCategory(siteInfo.category || 'Productivity');
          setLogo(siteInfo.logo || '🔗');
          setDescription(siteInfo.description || `A useful tool from ${domain}`);
        } catch (error) {
          console.error('Error parsing URL:', error);
        }
        setIsAnalyzing(false);
      }, 1500);
    }
  };
  const getSiteInfo = (domain: string) => {
    const siteMap: Record<string, {
      name: string;
      category: string;
      logo: string;
      description: string;
    }> = {
      'figma.com': {
        name: 'Figma',
        category: 'Design',
        logo: '🎨',
        description: 'Collaborative interface design tool'
      },
      'github.com': {
        name: 'GitHub',
        category: 'Development',
        logo: '💻',
        description: 'Code hosting and collaboration platform'
      },
      'notion.so': {
        name: 'Notion',
        category: 'Productivity',
        logo: '📝',
        description: 'All-in-one workspace for notes and collaboration'
      },
      'slack.com': {
        name: 'Slack',
        category: 'Communication',
        logo: '💬',
        description: 'Team communication and collaboration'
      },
      'trello.com': {
        name: 'Trello',
        category: 'Productivity',
        logo: '📋',
        description: 'Visual project management tool'
      },
      'canva.com': {
        name: 'Canva',
        category: 'Design',
        logo: '🎨',
        description: 'Easy-to-use design platform'
      }
    };
    return siteMap[domain] || {
      name: '',
      category: '',
      logo: '',
      description: ''
    };
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url && category) {
      onSave({
        name,
        url,
        category,
        logo: logo || '🔗',
        description
      });
      handleClose();
    }
  };
  const handleClose = () => {
    setUrl('');
    setName('');
    setCategory('');
    setLogo('');
    setDescription('');
    setIsAnalyzing(false);
    onClose();
  };
  return <AnimatePresence data-magicpath-id="0" data-magicpath-path="NewToolDialog.tsx">
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-magicpath-id="1" data-magicpath-path="NewToolDialog.tsx">
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black bg-opacity-50" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={handleClose} data-magicpath-id="2" data-magicpath-path="NewToolDialog.tsx" />

          {/* Dialog */}
          <motion.div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden" initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} transition={{
        type: "spring",
        duration: 0.3
      }} data-magicpath-id="3" data-magicpath-path="NewToolDialog.tsx">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200" data-magicpath-id="4" data-magicpath-path="NewToolDialog.tsx">
              <div className="flex items-center space-x-3" data-magicpath-id="5" data-magicpath-path="NewToolDialog.tsx">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center" data-magicpath-id="6" data-magicpath-path="NewToolDialog.tsx">
                  <Link className="w-5 h-5 text-indigo-600" data-magicpath-id="7" data-magicpath-path="NewToolDialog.tsx" />
                </div>
                <div data-magicpath-id="8" data-magicpath-path="NewToolDialog.tsx">
                  <h2 className="text-xl font-semibold text-gray-900" data-magicpath-id="9" data-magicpath-path="NewToolDialog.tsx">Add New Tool</h2>
                  <p className="text-sm text-gray-500" data-magicpath-id="10" data-magicpath-path="NewToolDialog.tsx">Paste a URL for automatic info filling</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="11" data-magicpath-path="NewToolDialog.tsx">
                <X className="w-5 h-5 text-gray-500" data-magicpath-id="12" data-magicpath-path="NewToolDialog.tsx" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6" data-magicpath-id="13" data-magicpath-path="NewToolDialog.tsx">
              {/* URL Input */}
              <div data-magicpath-id="14" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="15" data-magicpath-path="NewToolDialog.tsx">
                  Website URL *
                </label>
                <div className="relative" data-magicpath-id="16" data-magicpath-path="NewToolDialog.tsx">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-magicpath-id="17" data-magicpath-path="NewToolDialog.tsx">
                    <Globe className="h-5 w-5 text-gray-400" data-magicpath-id="18" data-magicpath-path="NewToolDialog.tsx" />
                  </div>
                  <input type="url" id="url" value={url} onChange={e => handleUrlChange(e.target.value)} placeholder="https://example.com" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required data-magicpath-id="19" data-magicpath-path="NewToolDialog.tsx" />
                  {isAnalyzing && <div className="absolute inset-y-0 right-0 pr-3 flex items-center" data-magicpath-id="20" data-magicpath-path="NewToolDialog.tsx">
                      <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" data-magicpath-id="21" data-magicpath-path="NewToolDialog.tsx" />
                    </div>}
                </div>
                {isAnalyzing && <div className="mt-2 flex items-center text-sm text-indigo-600" data-magicpath-id="22" data-magicpath-path="NewToolDialog.tsx">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Analyzing website and auto-filling information...
                  </div>}
              </div>

              {/* Name Input */}
              <div data-magicpath-id="23" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="24" data-magicpath-path="NewToolDialog.tsx">
                  Tool Name *
                </label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Figma" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required data-magicpath-id="25" data-magicpath-path="NewToolDialog.tsx" />
              </div>

              {/* Category Select */}
              <div data-magicpath-id="26" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="27" data-magicpath-path="NewToolDialog.tsx">
                  Category *
                </label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" required data-magicpath-id="28" data-magicpath-path="NewToolDialog.tsx">
                  <option value="" data-magicpath-id="29" data-magicpath-path="NewToolDialog.tsx">Select a category</option>
                  {categories.map(cat => <option key={cat} value={cat} data-magicpath-uuid={(cat as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="NewToolDialog.tsx">
                      {cat}
                    </option>)}
                </select>
              </div>

              {/* Logo Input */}
              <div data-magicpath-id="31" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="32" data-magicpath-path="NewToolDialog.tsx">
                  Logo (Emoji)
                </label>
                <div className="flex items-center space-x-3" data-magicpath-id="33" data-magicpath-path="NewToolDialog.tsx">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl" data-magicpath-id="34" data-magicpath-path="NewToolDialog.tsx">
                    {logo || '🔗'}
                  </div>
                  <input type="text" id="logo" value={logo} onChange={e => setLogo(e.target.value)} placeholder="🎨" className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" maxLength={2} data-magicpath-id="35" data-magicpath-path="NewToolDialog.tsx" />
                </div>
              </div>

              {/* Description Input */}
              <div data-magicpath-id="36" data-magicpath-path="NewToolDialog.tsx">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="37" data-magicpath-path="NewToolDialog.tsx">
                  Description
                </label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of what this tool does..." rows={3} className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none" data-magicpath-id="38" data-magicpath-path="NewToolDialog.tsx" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4" data-magicpath-id="39" data-magicpath-path="NewToolDialog.tsx">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="40" data-magicpath-path="NewToolDialog.tsx">
                  Cancel
                </button>
                <motion.button type="submit" disabled={!name || !url || !category || isAnalyzing} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} data-magicpath-id="41" data-magicpath-path="NewToolDialog.tsx">
                  Add Tool
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export default NewToolDialog;