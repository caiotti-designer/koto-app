import React from 'react';
import { Search, Menu, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuToggle: () => void;
  mpid?: string;
}
const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onMenuToggle
}) => {
  return <header className="bg-white border-b border-gray-200 px-6 py-4" data-magicpath-id="0" data-magicpath-path="Header.tsx">
      <div className="flex items-center justify-between" data-magicpath-id="1" data-magicpath-path="Header.tsx">
        {/* Left Section */}
        <div className="flex items-center space-x-4" data-magicpath-id="2" data-magicpath-path="Header.tsx">
          {/* Mobile Menu Button */}
          <button onClick={onMenuToggle} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="3" data-magicpath-path="Header.tsx">
            <Menu className="w-5 h-5 text-gray-600" data-magicpath-id="4" data-magicpath-path="Header.tsx" />
          </button>

          {/* Search Bar */}
          <div className="relative" data-magicpath-id="5" data-magicpath-path="Header.tsx">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-magicpath-id="6" data-magicpath-path="Header.tsx">
              <Search className="h-5 w-5 text-gray-400" data-magicpath-id="7" data-magicpath-path="Header.tsx" />
            </div>
            <input type="text" placeholder="Search prompts..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" style={{
            minWidth: '320px'
          }} data-magicpath-id="8" data-magicpath-path="Header.tsx" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4" data-magicpath-id="9" data-magicpath-path="Header.tsx">
          {/* Notifications */}
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" data-magicpath-id="10" data-magicpath-path="Header.tsx">
            <Bell className="w-5 h-5 text-gray-600" data-magicpath-id="11" data-magicpath-path="Header.tsx" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full" data-magicpath-id="12" data-magicpath-path="Header.tsx"></span>
          </motion.button>

          {/* Profile Menu */}
          <div className="relative" data-magicpath-id="13" data-magicpath-path="Header.tsx">
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors" data-magicpath-id="14" data-magicpath-path="Header.tsx">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center" data-magicpath-id="15" data-magicpath-path="Header.tsx">
                <User className="w-4 h-4 text-white" data-magicpath-id="16" data-magicpath-path="Header.tsx" />
              </div>
              <div className="hidden sm:block text-left" data-magicpath-id="17" data-magicpath-path="Header.tsx">
                <div className="text-sm font-medium text-gray-900" data-magicpath-id="18" data-magicpath-path="Header.tsx">Alex Chen</div>
                <div className="text-xs text-gray-500" data-magicpath-id="19" data-magicpath-path="Header.tsx">alex@example.com</div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;