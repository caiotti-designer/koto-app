"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type BackgroundOption = 'default' | 'custom' | 'none';

interface Props {
  open: boolean;
  onClose: () => void;
  backgroundOption: BackgroundOption;
  backgroundImage: string;
  onChangeOption: (opt: BackgroundOption) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MobileSettingsDialog: React.FC<Props> = ({
  open,
  onClose,
  backgroundOption,
  backgroundImage,
  onChangeOption,
  onUpload,
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Default Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Sun className="h-5 w-5 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Moon className="h-5 w-5 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'system'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Monitor className="h-5 w-5 mx-auto mb-1 text-gray-700 dark:text-gray-300" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">System</span>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Header Background</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Choose background option:</p>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="backgroundOption"
                      value="default"
                      checked={backgroundOption === 'default'}
                      onChange={() => onChangeOption('default')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 dark:text-gray-300">Default Background</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Use the default background image</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="backgroundOption"
                      value="custom"
                      checked={backgroundOption === 'custom'}
                      onChange={() => onChangeOption('custom')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 dark:text-gray-300">Custom Background</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Upload your own image</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="backgroundOption"
                      value="none"
                      checked={backgroundOption === 'none'}
                      onChange={() => onChangeOption('none')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 dark:text-gray-300">No Background</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Remove background image entirely</div>
                    </div>
                  </label>
                </div>

                {backgroundOption === 'custom' && (
                  <div className="mt-4 space-y-3">
                    <label htmlFor="mobile-bg-upload" className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg cursor-pointer w-full justify-center">
                      <input id="mobile-bg-upload" type="file" accept="image/*" onChange={onUpload} className="hidden" />
                      <span>Upload Image</span>
                    </label>
                    {backgroundImage && backgroundImage !== 'none' && (
                      <div className="relative group">
                        <img src={backgroundImage} alt="Background preview" className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => onChangeOption('default')}
                          className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 text-right">
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSettingsDialog;

