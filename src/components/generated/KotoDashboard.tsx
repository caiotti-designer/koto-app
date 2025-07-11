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
  const [prompts, setPrompts] = useState<Prompt[]>([{
    id: '1',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['writing', 'creative', 'storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-15'),
    mpid: "97738ffa-1be7-4ff0-825a-dd2168e84143"
  }, {
    id: '2',
    title: 'Code Review Helper',
    content: 'Review my code for best practices, security issues, and optimization opportunities.',
    tags: ['coding', 'review', 'optimization'],
    model: 'Claude-3',
    category: 'Development',
    createdAt: new Date('2024-01-14'),
    mpid: "4c8143e1-2a48-4005-a909-7ada2e1a3d9e"
  }]);
  const [tools, setTools] = useState<Tool[]>([{
    id: '1',
    name: 'Figma',
    logo: '🎨',
    category: 'Design',
    url: 'https://figma.com',
    mpid: "6ae57900-7152-43d3-accb-cc2e96d5b648"
  }, {
    id: '2',
    name: 'GitHub',
    logo: '💻',
    category: 'Development',
    url: 'https://github.com',
    mpid: "3aa1330d-577d-421e-8044-36e585e2c068"
  }, {
    id: '3',
    name: 'Notion',
    logo: '📝',
    category: 'Productivity',
    url: 'https://notion.so',
    mpid: "f4102e0f-1370-4dee-83fe-85ef0a96d7ac"
  }]);
  const categories: Category[] = [{
    id: 'all',
    name: 'All',
    count: prompts.length,
    color: 'bg-gray-100 text-gray-700',
    mpid: "9e24487d-aac0-464c-a428-9ac24e18d684"
  }, {
    id: 'writing',
    name: 'Writing',
    count: prompts.filter(p => p.category === 'Writing').length,
    color: 'bg-blue-100 text-blue-700',
    mpid: "811681f3-e3a7-44ee-ae1e-faa02fc3cb01"
  }, {
    id: 'development',
    name: 'Development',
    count: prompts.filter(p => p.category === 'Development').length,
    color: 'bg-green-100 text-green-700',
    mpid: "f89f0def-2679-46cd-89a7-a719fade938f"
  }, {
    id: 'design',
    name: 'Design',
    count: 3,
    color: 'bg-purple-100 text-purple-700',
    mpid: "d943a530-fdfd-4d7a-bd66-5e2aaf3649af"
  }, {
    id: 'marketing',
    name: 'Marketing',
    count: 5,
    color: 'bg-orange-100 text-orange-700',
    mpid: "9c597471-0e20-4396-95a6-85dbce2ee302"
  }, {
    id: 'productivity',
    name: 'Productivity',
    count: 2,
    color: 'bg-indigo-100 text-indigo-700',
    mpid: "9811cf9a-8b9d-439a-8d1f-0f7528b36a9d"
  }];
  const toolCategories: Category[] = [{
    id: 'all',
    name: 'All',
    count: tools.length,
    color: 'bg-gray-100 text-gray-700',
    mpid: "ea684f0b-c020-4e05-af55-655c90bbafc6"
  }, {
    id: 'design',
    name: 'Design',
    count: tools.filter(t => t.category === 'Design').length,
    color: 'bg-purple-100 text-purple-700',
    mpid: "e9cef7f4-8de0-4ee9-9968-1b4c267406ca"
  }, {
    id: 'development',
    name: 'Development',
    count: tools.filter(t => t.category === 'Development').length,
    color: 'bg-green-100 text-green-700',
    mpid: "40f96742-989e-4164-8ea5-2f162b479875"
  }, {
    id: 'productivity',
    name: 'Productivity',
    count: tools.filter(t => t.category === 'Productivity').length,
    color: 'bg-indigo-100 text-indigo-700',
    mpid: "953f4cfa-161b-4e3c-b2c0-285a985bd5fe"
  }];
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <div className="h-screen w-full bg-gray-50 flex overflow-hidden" data-magicpath-id="0" data-magicpath-path="KotoDashboard.tsx">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} activeTab={activeTab} onTabChange={setActiveTab} tools={tools} data-magicpath-id="1" data-magicpath-path="KotoDashboard.tsx" />

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
            
            <motion.button className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors" whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} data-magicpath-id="11" data-magicpath-path="KotoDashboard.tsx">
              <FolderPlus className="w-4 h-4 mr-2" data-magicpath-id="12" data-magicpath-path="KotoDashboard.tsx" />
              Add Category
            </motion.button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3" data-magicpath-id="13" data-magicpath-path="KotoDashboard.tsx">
          <div className="flex items-center space-x-2 overflow-x-auto" data-magicpath-id="14" data-magicpath-path="KotoDashboard.tsx">
            {(activeTab === 'prompts' ? categories : toolCategories).map(category => <motion.button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : category.color}`} whileHover={{
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
                      {activeCategory === 'all' ? 'All Prompts' : `${categories.find(c => c.id === activeCategory)?.name} Prompts`}
                    </h1>
                    <p className="text-gray-600 mt-1" data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                      {filteredPrompts.length} prompts available
                    </p>
                  </div>
                </div>

                {/* Prompts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} onUpdateCover={coverImage => handleUpdatePromptCover(prompt.id, coverImage)} data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx" />)}
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
                    {activeCategory === 'all' ? 'All Tools' : `${toolCategories.find(c => c.id === activeCategory)?.name} Tools`}
                  </h1>
                  <p className="text-gray-600 mt-1" data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx">
                    Your favorite tools and resources
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="32" data-magicpath-path="KotoDashboard.tsx">
                  {filteredTools.map(tool => <motion.a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group" whileHover={{
                y: -2
              }} whileTap={{
                scale: 0.98
              }} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="33" data-magicpath-path="KotoDashboard.tsx">
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
                    </motion.a>)}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence data-magicpath-id="46" data-magicpath-path="KotoDashboard.tsx">
        {mobileMenuOpen && <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setMobileMenuOpen(false)} data-magicpath-id="47" data-magicpath-path="KotoDashboard.tsx" />}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;