import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import PromptCard from './PromptCard';
import NewPromptDialog from './NewPromptDialog';
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
const KotoDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'toolbox'>('prompts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPromptDialog, setShowNewPromptDialog] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([{
    id: '1',
    title: 'Creative Writing Assistant',
    content: 'Help me write engaging stories with vivid descriptions and compelling characters.',
    tags: ['writing', 'creative', 'storytelling'],
    model: 'GPT-4',
    category: 'Writing',
    createdAt: new Date('2024-01-15'),
    mpid: "f4efeb3c-c738-4b88-b2ee-1d8699a22f60"
  }, {
    id: '2',
    title: 'Code Review Helper',
    content: 'Review my code for best practices, security issues, and optimization opportunities.',
    tags: ['coding', 'review', 'optimization'],
    model: 'Claude-3',
    category: 'Development',
    createdAt: new Date('2024-01-14'),
    mpid: "c2923c27-1e0e-4939-8f3e-1b976fe7b666"
  }]);
  const tools: Tool[] = [{
    id: '1',
    name: 'Figma',
    logo: '🎨',
    category: 'Design',
    url: 'https://figma.com',
    mpid: "2e13f5d7-ff46-4d66-9975-8536a6878aa3"
  }, {
    id: '2',
    name: 'GitHub',
    logo: '💻',
    category: 'Development',
    url: 'https://github.com',
    mpid: "df4bbdbb-4eb2-42e0-a7a9-bf633580dfaf"
  }, {
    id: '3',
    name: 'Notion',
    logo: '📝',
    category: 'Productivity',
    url: 'https://notion.so',
    mpid: "21537be8-c7d2-49d2-804a-a67a97d36e32"
  }];
  const filteredPrompts = prompts.filter(prompt => prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
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

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6" data-magicpath-id="4" data-magicpath-path="KotoDashboard.tsx">
          <div className="max-w-7xl mx-auto" data-magicpath-id="5" data-magicpath-path="KotoDashboard.tsx">
            {activeTab === 'prompts' ? <>
                <div className="flex items-center justify-between mb-6" data-magicpath-id="6" data-magicpath-path="KotoDashboard.tsx">
                  <div data-magicpath-id="7" data-magicpath-path="KotoDashboard.tsx">
                    <h1 className="text-2xl font-semibold text-gray-900" data-magicpath-id="8" data-magicpath-path="KotoDashboard.tsx">Prompts</h1>
                    <p className="text-gray-600 mt-1" data-magicpath-id="9" data-magicpath-path="KotoDashboard.tsx">{filteredPrompts.length} prompts available</p>
                  </div>
                </div>

                {/* Prompts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="10" data-magicpath-path="KotoDashboard.tsx">
                  {filteredPrompts.map(prompt => <PromptCard key={prompt.id} prompt={prompt} onUpdateCover={coverImage => handleUpdatePromptCover(prompt.id, coverImage)} data-magicpath-uuid={(prompt as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="KotoDashboard.tsx" />)}
                </div>

                {filteredPrompts.length === 0 && <div className="text-center py-12" data-magicpath-id="12" data-magicpath-path="KotoDashboard.tsx">
                    <div className="text-gray-400 text-lg mb-2" data-magicpath-id="13" data-magicpath-path="KotoDashboard.tsx">No prompts found</div>
                    <p className="text-gray-500" data-magicpath-id="14" data-magicpath-path="KotoDashboard.tsx">Try adjusting your search or create a new prompt</p>
                  </div>}
              </> : <>
                <div className="mb-6" data-magicpath-id="15" data-magicpath-path="KotoDashboard.tsx">
                  <h1 className="text-2xl font-semibold text-gray-900" data-magicpath-id="16" data-magicpath-path="KotoDashboard.tsx">Tool Box</h1>
                  <p className="text-gray-600 mt-1" data-magicpath-id="17" data-magicpath-path="KotoDashboard.tsx">Your favorite tools and resources</p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-magicpath-id="18" data-magicpath-path="KotoDashboard.tsx">
                  {tools.map(tool => <motion.a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group" whileHover={{
                y: -2
              }} whileTap={{
                scale: 0.98
              }} data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="19" data-magicpath-path="KotoDashboard.tsx">
                      <div className="flex items-center justify-between mb-4" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="20" data-magicpath-path="KotoDashboard.tsx">
                        <div className="text-3xl" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="logo:string" data-magicpath-id="21" data-magicpath-path="KotoDashboard.tsx">{tool.logo}</div>
                        <div className="text-gray-400 group-hover:text-indigo-500 transition-colors" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="22" data-magicpath-path="KotoDashboard.tsx">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="23" data-magicpath-path="KotoDashboard.tsx">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-id="24" data-magicpath-path="KotoDashboard.tsx" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:string" data-magicpath-id="25" data-magicpath-path="KotoDashboard.tsx">{tool.name}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full" data-magicpath-uuid={(tool as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:string" data-magicpath-id="26" data-magicpath-path="KotoDashboard.tsx">
                        {tool.category}
                      </span>
                    </motion.a>)}
                </div>
              </>}
          </div>
        </main>
      </div>

      {/* Floating New Prompt Button */}
      {activeTab === 'prompts' && <motion.button onClick={() => setShowNewPromptDialog(true)} className="fixed bottom-6 right-6 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50" whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} initial={{
      scale: 0
    }} animate={{
      scale: 1
    }} transition={{
      type: "spring",
      stiffness: 260,
      damping: 20
    }} data-magicpath-id="27" data-magicpath-path="KotoDashboard.tsx">
          <Plus className="w-6 h-6" data-magicpath-id="28" data-magicpath-path="KotoDashboard.tsx" />
        </motion.button>}

      {/* New Prompt Dialog */}
      <NewPromptDialog open={showNewPromptDialog} onClose={() => setShowNewPromptDialog(false)} onSave={handleSavePrompt} data-magicpath-id="29" data-magicpath-path="KotoDashboard.tsx" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence data-magicpath-id="30" data-magicpath-path="KotoDashboard.tsx">
        {mobileMenuOpen && <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setMobileMenuOpen(false)} data-magicpath-id="31" data-magicpath-path="KotoDashboard.tsx" />}
      </AnimatePresence>
    </div>;
};
export default KotoDashboard;