import React from 'react';
import { Search, Menu, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuToggle: () => void;
}
const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onMenuToggle
}) => {
  return <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuToggle} 
            className="md:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search prompts..." 
              value={searchQuery} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-10 pr-3 sm:text-sm" 
              style={{
                minWidth: '320px'
              }} 
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.div whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full"></span>
            </Button>
          </motion.div>

          {/* Profile Menu */}
          <div className="relative">
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button variant="ghost" className="flex items-center space-x-3 h-auto p-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">Alex Chen</div>
                  <div className="text-xs text-gray-500">alex@example.com</div>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;