import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Link, FolderPlus } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import PromptCard from './PromptCard';
import NewPromptDialog from './NewPromptDialog';
import NewToolDialog from './NewToolDialog';
interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  model: string;
  category: string;
  coverImage?: string;
  createdAt: Date;
  mpid?: string;
}
interface Tool {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
  mpid?: string;
}
interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  mpid?: string;
}
const KotoDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>('prompts');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [showNewToolDialog, setShowNewToolDialog] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState<Prompt | null>(null);
  const [showToolModal, setShowToolModal] = useState<Tool | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('bg-blue-100 text-blue-700');
  const [prompts, setPrompts] = useState<Prompt[]>([{
    id: '1',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['writing', 'creative', 'storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-15'),
    mpid: "f126b820-8806-450b-b26b-ae263c807188"
  }, {
    id: '2',
    title: 'Code Review Helper',
    content: 'Review my code for best practices, security issues, and optimization opportunities.',
    tags: ['coding', 'review', 'optimization'],
    model: 'Claude-3',
    category: 'Development',
    createdAt: new Date('2024-01-14'),
    mpid: "9ed6cb3e-8d45-4170-98f3-5cbc391d89e7"
  }]);
  const [tools, setTools] = useState<Tool[]>([{
    id: '1',
    name: 'Figma',
    logo: '🎨',
    category: 'Design',
    url: 'https://figma.com',
    mpid: "5c26ce03-4c7f-4392-aa9e-ddaf920f19cf"
  }, {
    id: '2',
    name: 'GitHub',
    logo: '💻',
    category: 'Development',
    url: 'https://github.com',
    mpid: "967690be-5c40-49b2-9f9a-53b54396a10e"
  }, {
    id: '3',
    name: 'Notion',
    logo: '📝',
    category: 'Productivity',
    url: 'https://notion.so',
    mpid: "13bd9487-b170-49c3-abec-5fcbd5f129f6"
  }]);
  const [categories, setCategories] = useState<Category[]>([{
    id: 'all',
    name: 'All',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-gray-100 text-gray-700',
    mpid: "279b9deb-cdf1-4d6e-8bd0-ea09a4e08f50"
  }, {
    id: 'writing',
    name: 'Writing',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-blue-100 text-blue-700',
    mpid: "dbc121d4-e760-4e42-b3cf-9d80797ba367"
  }, {
    id: 'development',
    name: 'Development',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-green-100 text-green-700',
    mpid: "de06585c-2aaa-40ab-b13c-57af14fa191a"
  }, {
    id: 'design',
    name: 'Design',
    count: 3,
    color: 'bg-purple-100 text-purple-700',
    mpid: "20ba90cf-4f62-407d-b97f-15058520a375"
  }, {
    id: 'marketing',
    name: 'Marketing',
    count: 5,
    color: 'bg-orange-100 text-orange-700',
    mpid: "027318e2-fc87-4017-8698-d62f674b5a1d"
  }, {
    id: 'productivity',
    name: 'Productivity',
    count: 2,
    color: 'bg-indigo-100 text-indigo-700',
    mpid: "ac58af15-0b21-4aeb-969d-93cec3c29b0b"
  }]);
  const [toolCategories, setToolCategories] = useState<Category[]>([{
    id: 'all',
    name: 'All',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-gray-100 text-gray-700',
    mpid: "3dec3161-49fe-43dc-91a2-4a1064aa0845"
  }, {
    id: 'design',
    name: 'Design',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-purple-100 text-purple-700',
    mpid: "2812dbd2-cbaa-4d42-811b-3339d4387968"
  }, {
    id: 'development',
    name: 'Development',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-green-100 text-green-700',
    mpid: "620c54ea-4c10-404f-9af9-394ac78fe6c5"
  }, {
    id: 'productivity',
    name: 'Productivity',
    count: 0,
    // Will be calculated dynamically
    color: 'bg-indigo-100 text-indigo-700',
    mpid: "bd2c1974-7ad1-4c72-8689-1bdb8e97ac34"
  }]);
  // Update category counts dynamically
  const updatedCategories = categories.map(category => ({
    ...category,
    count: category.id === 'all' ? prompts.length : prompts.filter(p => p.category.toLowerCase() === category.id).length
  }));
  const updatedToolCategories = toolCategories.map(category => ({
    ...category,
    count: category.id === 'all' ? tools.length : tools.filter(t => t.category.toLowerCase() === category.id).length
  }));
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || prompt.category.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category.toLowerCase() === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const handleSavePrompt = (promptData: Omit<Prompt, 'id' | 'createdAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPrompts(prev => [newPrompt, ...prev]);
    setShowNewPromptDialog(false);
  };
  const handleUpdatePromptCover = (promptId: string, coverImage: string) => {
    setPrompts(prev => prev.map(prompt => prompt.id === promptId ? {
      ...prompt,
      coverImage
    } : prompt));
  };
  const handleSaveTool = (toolData: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...toolData,
      id: Date.now().toString()
    };
    setTools(prev => [newTool, ...prev]);
    setShowNewToolDialog(false);
  };
  const handleDeletePrompt = (promptId: string) => {
    setPrompts(prev => prev.filter(p => p.id !== promptId));
    setShowPromptModal(null);
  };
  const handleDeleteTool = (toolId: string) => {
    setTools(prev => prev.filter(t => t.id !== toolId));
    setShowToolModal(null);
  };
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    const newTag: Category = {
      id: newTagName.toLowerCase().replace(/\s+/g, '-'),
      name: newTagName,
      count: 0,
      color: newTagColor,
      mpid: `tag-${Date.now()}`
    };
    if (activeTab === 'prompts') {
      setCategories(prev => [...prev, newTag]);
    } else {
      setToolCategories(prev => [...prev, newTag]);
    }
    setNewTagName('');
    setNewTagColor('bg-blue-100 text-blue-700');
    setShowAddTagDialog(false);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return <div className={`h-screen w-full ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} flex overflow-hidden`} data-magicpath-id="0" data-magicpath-path="KotoDashboard.tsx">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} activeTab={activeTab} onTabChange={setActiveTab} tools={tools} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} data-magicpath-id="1" data-magicpath-path="KotoDashboard.tsx" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" data-magicpath-id="2" data-magicpath-path="KotoDashboard.tsx">
        {/* Header */}
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onMenuToggle={() => setMobileMenuOpen(true)} data-magicpath-id="3" data-magicpath-path="KotoDashboard.tsx" />

        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4" data-magicpath-id="4" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="5" data-magicpath-path="KotoDashboard.tsx">
            <div className="flex items-center space-x-4" data-magicpath-id="6" data-magicpath-path="KotoDashboard.tsx">
              {activeTab === 'prompts' ? <motion.button onClick={() => setShowNewPromptDialog(true)} className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} data-magicpath-id="7" data-magicpath-path="KotoDashboard.tsx">
                  <Plus className="w-4 h-4 mr-2" data-magicpath-id="8" data-magicpath-path="KotoDashboard.tsx" />
                  Add Prompt
                </motion.button> : <motion.button onClick={() => setShowNewToolDialog(true)} className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} data-magicpath-id="9" data-magicpath-path="KotoDashboard.tsx">
                  <Link className="w-4 h-4 mr-2" data-magicpath-id="10" data-magicpath-path="KotoDashboard.tsx" />
                  Add Tool
                </motion.button>}
            </div>
            
            <motion.button onClick={() => setShowAddTagDialog(true)} className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors" whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} data-magicpath-id="11" data-magicpath-path="KotoDashboard.tsx">
              <FolderPlus className="w-4 h-4 mr-2" data-magicpath-id="12" data-magicpath-path="KotoDashboard.tsx" />
              Add Tag
            </motion.button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3" data-magicpath-id="13" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center space-x-2 overflow-x-auto" data-magicpath-id="14" data-magicpath-path="KotoDashboard.tsx">
            {(activeTab === 'prompts' ? updatedCategories : updatedToolCategories).map(category => <motion.button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : category.color}`} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} data-magicpath-id="15" data-magicpath-path="KotoDashboard.tsx">
                <span data-magicpath-id="16" data-magicpath-path="KotoDashboard.tsx">{category.name}</span>
                <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-50 rounded-full text-xs" data-magicpath-id="17" data-magicpath-path="KotoDashboard.tsx">
                  {category.count}
                </span>
              </motion.button>)}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6" data-magicpath-id="18" data-magicpath-path="KotoDashboard.tsx">
          <div className="max-w-7xl mx-auto" data-magicpath-id="19" data-magicpath-path="KotoDashboard.tsx">
            {activeTab === 'prompts' ? <>
                <div className="flex items-center justify-between mb-6" data-magicpath-id="20" data-magicpath-path="KotoDashboard.tsx">
                  <div data-magicpath-id="21" data-magicpath-path="KotoDashboard.tsx">
                    <h1 className="text-2xl font-semibold text-gray-900" data-magicpath-id="22" data-magicpath-path="KotoDashboard.tsx">
                      {activeCategory === 'all' ? 'All Prompts' : `${updatedCategories.find(c => c.id === activeCategory)?.name} Prompts`}
                    </h1>
                    <p className="text-gray-600 mt-1" data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                      {filteredPrompts.length} prompts available
                    </p>
                  </div>
                </div>

                {/* Prompts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} onUpdateCover={coverImage => handleUpdatePromptCover(prompt.id, coverImage)} onClick={() => setShowPromptModal(prompt)} data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx" />)}
                </div>

                {filteredPrompts.length === 0 && <div className="text-center py-12" data-magicpath-id="26" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-gray-400 text-lg mb-2" data-magicpath-id="27" data-magicpath-path="KotoDashboard.tsx">
                      No prompts found
                    </div>
                    <p className="text-gray-500" data-magicpath-id="28" data-magicpath-path="KotoDashboard.tsx">
                      Try adjusting your search or create a new prompt
                    </p>
                  </div>}
              </> : <>
                <div className="mb-6" data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx">
                  <h1 className="text-2xl font-semibold text-gray-900" data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
                    {activeCategory === 'all' ? 'All Tools' : `${updatedToolCategories.find(c => c.id === activeCategory)?.name} Tools`}
                  </h1>
                  <p className="text-gray-600 mt-1" data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
                    Your favorite tools and resources
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="32" data-magicpath-path="KotoDashboard.tsx">
                  {filteredTools.map(tool => <motion.div key={tool.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer" whileHover={{
                y: -2
              }} whileTap={{
                scale: 0.98
              }} onClick={() => setShowToolModal(tool)} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-center justify-between mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="KotoDashboard.tsx">
                        <div className="text-3xl" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="logo:unknown" data-magicpath-id="35" data-magicpath-path="KotoDashboard.tsx">
                          {tool.logo}
                        </div>
                        <div className="text-gray-400 group-hover:text-indigo-500 transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="KotoDashboard.tsx">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="37" data-magicpath-path="KotoDashboard.tsx">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="KotoDashboard.tsx" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:unknown" data-magicpath-id="39" data-magicpath-path="KotoDashboard.tsx">
                        {tool.name}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="40" data-magicpath-path="KotoDashboard.tsx">
                        {tool.category}
                      </span>
                    </motion.div>)}
                </div>

                {filteredTools.length === 0 && <div className="text-center py-12" data-magicpath-id="41" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-gray-400 text-lg mb-2" data-magicpath-id="42" data-magicpath-path="KotoDashboard.tsx">
                      No tools found
                    </div>
                    <p className="text-gray-500" data-magicpath-id="43" data-magicpath-path="KotoDashboard.tsx">
                      Try adjusting your search or add a new tool
                    </p>
                  </div>}
              </>}
          </div>
        </main>
      </div>

      {/* New Prompt Dialog */}
      <NewPromptDialog open={showNewPromptDialog} onClose={() => setShowNewPromptDialog(false)} onSave={handleSavePrompt} data-magicpath-id="44" data-magicpath-path="KotoDashboard.tsx" />

      {/* New Tool Dialog */}
      <NewToolDialog open={showNewToolDialog} onClose={() => setShowNewToolDialog(false)} onSave={handleSaveTool} data-magicpath-id="45" data-magicpath-path="KotoDashboard.tsx" />

      {/* Add Tag Dialog */}
      <AnimatePresence data-magicpath-id="46" data-magicpath-path="KotoDashboard.tsx">
        {showAddTagDialog && <motion.div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowAddTagDialog(false)} data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="48" data-magicpath-path="KotoDashboard.tsx">
              <h2 className="text-xl font-semibold text-gray-900 mb-4" data-magicpath-id="49" data-magicpath-path="KotoDashboard.tsx">Add New Tag</h2>
              
              <div className="space-y-4" data-magicpath-id="50" data-magicpath-path="KotoDashboard.tsx">
                <div data-magicpath-id="51" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="52" data-magicpath-path="KotoDashboard.tsx">
                    Tag Name
                  </label>
                  <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="Enter tag name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-magicpath-id="53" data-magicpath-path="KotoDashboard.tsx" />
                </div>

                <div data-magicpath-id="54" data-magicpath-path="KotoDashboard.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="55" data-magicpath-path="KotoDashboard.tsx">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2" data-magicpath-id="56" data-magicpath-path="KotoDashboard.tsx">
                    {[{
                  value: 'bg-blue-100 text-blue-700',
                  color: 'bg-blue-100',
                  mpid: "93eb0dd4-e5fc-4b39-a943-6cae41c91484"
                }, {
                  value: 'bg-green-100 text-green-700',
                  color: 'bg-green-100',
                  mpid: "08fb50a4-b00f-4d74-a831-3ed97b487041"
                }, {
                  value: 'bg-purple-100 text-purple-700',
                  color: 'bg-purple-100',
                  mpid: "8f0408c5-bd28-4b0b-b293-46ac5ddbd4ca"
                }, {
                  value: 'bg-orange-100 text-orange-700',
                  color: 'bg-orange-100',
                  mpid: "edc5584f-0606-4cdc-b560-881b95c939d3"
                }, {
                  value: 'bg-pink-100 text-pink-700',
                  color: 'bg-pink-100',
                  mpid: "d0096e7e-0dcf-4fc3-96dc-f842d0edd95d"
                }, {
                  value: 'bg-yellow-100 text-yellow-700',
                  color: 'bg-yellow-100',
                  mpid: "f3bb2dfe-38f5-44a5-8604-710c056179db"
                }].map(colorOption => <button key={colorOption.value} onClick={() => setNewTagColor(colorOption.value)} className={`w-full h-8 rounded-lg border-2 transition-all ${newTagColor === colorOption.value ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'} ${colorOption.color}`} data-magicpath-uuid={(colorOption as any)["mpid"] ?? "unsafe"} data-magicpath-id="57" data-magicpath-path="KotoDashboard.tsx" />)}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4" data-magicpath-id="58" data-magicpath-path="KotoDashboard.tsx">
                  <button onClick={() => setShowAddTagDialog(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" data-magicpath-id="59" data-magicpath-path="KotoDashboard.tsx">
                    Cancel
                  </button>
                  <button onClick={handleAddTag} disabled={!newTagName.trim()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg transition-colors" data-magicpath-id="60" data-magicpath-path="KotoDashboard.tsx">
                    Add Tag
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence data-magicpath-id="61" data-magicpath-path="KotoDashboard.tsx">
        {mobileMenuOpen && <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setMobileMenuOpen(false)} data-magicpath-id="62" data-magicpath-path="KotoDashboard.tsx" />}
      </AnimatePresence>

      {/* Prompt Detail Modal */}
      <AnimatePresence data-magicpath-id="63" data-magicpath-path="KotoDashboard.tsx">
        {showPromptModal && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowPromptModal(null)} data-magicpath-id="64" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="65" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="66" data-magicpath-path="KotoDashboard.tsx">
                <div className="flex-1" data-magicpath-id="67" data-magicpath-path="KotoDashboard.tsx">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2" data-magicpath-id="68" data-magicpath-path="KotoDashboard.tsx">{showPromptModal.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500" data-magicpath-id="69" data-magicpath-path="KotoDashboard.tsx">
                    <span className="bg-gray-100 px-2 py-1 rounded-full" data-magicpath-id="70" data-magicpath-path="KotoDashboard.tsx">{showPromptModal.model}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full" data-magicpath-id="71" data-magicpath-path="KotoDashboard.tsx">{showPromptModal.category}</span>
                    <span data-magicpath-id="72" data-magicpath-path="KotoDashboard.tsx">{new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }).format(showPromptModal.createdAt)}</span>
                  </div>
                </div>
                <button onClick={() => handleDeletePrompt(showPromptModal.id)} className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete prompt" data-magicpath-id="73" data-magicpath-path="KotoDashboard.tsx">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-id="74" data-magicpath-path="KotoDashboard.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-magicpath-id="75" data-magicpath-path="KotoDashboard.tsx" />
                  </svg>
                </button>
              </div>

              <div className="mb-6" data-magicpath-id="76" data-magicpath-path="KotoDashboard.tsx">
                <h3 className="text-lg font-semibold text-gray-900 mb-3" data-magicpath-id="77" data-magicpath-path="KotoDashboard.tsx">Prompt Content</h3>
                <div className="bg-gray-50 rounded-lg p-4 border" data-magicpath-id="78" data-magicpath-path="KotoDashboard.tsx">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" data-magicpath-id="79" data-magicpath-path="KotoDashboard.tsx">{showPromptModal.content}</p>
                </div>
              </div>

              <div className="mb-6" data-magicpath-id="80" data-magicpath-path="KotoDashboard.tsx">
                <h3 className="text-lg font-semibold text-gray-900 mb-3" data-magicpath-id="81" data-magicpath-path="KotoDashboard.tsx">Tags</h3>
                <div className="flex flex-wrap gap-2" data-magicpath-id="82" data-magicpath-path="KotoDashboard.tsx">
                  {showPromptModal.tags.map((tag, index) => <span key={index} className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full" data-magicpath-id="83" data-magicpath-path="KotoDashboard.tsx">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-id="84" data-magicpath-path="KotoDashboard.tsx">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" data-magicpath-id="85" data-magicpath-path="KotoDashboard.tsx" />
                      </svg>
                      {tag}
                    </span>)}
                </div>
              </div>

              <div className="flex justify-end space-x-3" data-magicpath-id="86" data-magicpath-path="KotoDashboard.tsx">
                <button onClick={() => navigator.clipboard.writeText(showPromptModal.content)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2" data-magicpath-id="87" data-magicpath-path="KotoDashboard.tsx">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-id="88" data-magicpath-path="KotoDashboard.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" data-magicpath-id="89" data-magicpath-path="KotoDashboard.tsx" />
                  </svg>
                  <span data-magicpath-id="90" data-magicpath-path="KotoDashboard.tsx">Copy Prompt</span>
                </button>
                <button onClick={() => setShowPromptModal(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" data-magicpath-id="91" data-magicpath-path="KotoDashboard.tsx">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>

      {/* Tool Detail Modal */}
      <AnimatePresence data-magicpath-id="92" data-magicpath-path="KotoDashboard.tsx">
        {showToolModal && <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setShowToolModal(null)} data-magicpath-id="93" data-magicpath-path="KotoDashboard.tsx">
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} onClick={e => e.stopPropagation()} data-magicpath-id="94" data-magicpath-path="KotoDashboard.tsx">
              <div className="flex items-start justify-between mb-6" data-magicpath-id="95" data-magicpath-path="KotoDashboard.tsx">
                <div className="flex items-center space-x-4" data-magicpath-id="96" data-magicpath-path="KotoDashboard.tsx">
                  <div className="text-4xl" data-magicpath-id="97" data-magicpath-path="KotoDashboard.tsx">{showToolModal.logo}</div>
                  <div data-magicpath-id="98" data-magicpath-path="KotoDashboard.tsx">
                    <h2 className="text-xl font-bold text-gray-900" data-magicpath-id="99" data-magicpath-path="KotoDashboard.tsx">{showToolModal.name}</h2>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mt-1" data-magicpath-id="100" data-magicpath-path="KotoDashboard.tsx">
                      {showToolModal.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDeleteTool(showToolModal.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete tool" data-magicpath-id="101" data-magicpath-path="KotoDashboard.tsx">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-id="102" data-magicpath-path="KotoDashboard.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-magicpath-id="103" data-magicpath-path="KotoDashboard.tsx" />
                  </svg>
                </button>
              </div>

              <div className="mb-6" data-magicpath-id="104" data-magicpath-path="KotoDashboard.tsx">
                <h3 className="text-lg font-semibold text-gray-900 mb-3" data-magicpath-id="105" data-magicpath-path="KotoDashboard.tsx">Website URL</h3>
                <div className="bg-gray-50 rounded-lg p-3 border" data-magicpath-id="106" data-magicpath-path="KotoDashboard.tsx">
                  <a href={showToolModal.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 break-all">
                    {showToolModal.url}
                  </a>
                </div>
              </div>

              <div className="flex justify-end space-x-3" data-magicpath-id="107" data-magicpath-path="KotoDashboard.tsx">
                <a href={showToolModal.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-id="108" data-magicpath-path="KotoDashboard.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-magicpath-id="109" data-magicpath-path="KotoDashboard.tsx" />
                  </svg>
                  <span data-magicpath-id="110" data-magicpath-path="KotoDashboard.tsx">Open Tool</span>
                </a>
                <button onClick={() => setShowToolModal(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" data-magicpath-id="111" data-magicpath-path="KotoDashboard.tsx">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;