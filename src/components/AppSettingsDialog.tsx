"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type BackgroundOption = 'default' | 'custom' | 'none';

interface Props {
  open: boolean;
  onClose: () => void;
  backgroundOption: BackgroundOption;
  backgroundImage: string;
  onChangeOption: (opt: BackgroundOption) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppSettingsDialog: React.FC<Props> = ({
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            <div className="grid gap-8">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      theme === 'light'
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <Sun className="w-4 h-4 inline-block mr-2" />Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      theme === 'dark'
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <Moon className="w-4 h-4 inline-block mr-2" />Dark
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      theme === 'system'
                        ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <Monitor className="w-4 h-4 inline-block mr-2" />System
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Header Background</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <input
                      type="radio"
                      name="bg-option"
                      checked={backgroundOption === 'default'}
                      onChange={() => onChangeOption('default')}
                    />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">Default background</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Use the app default header image</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <input
                      type="radio"
                      name="bg-option"
                      checked={backgroundOption === 'custom'}
                      onChange={() => onChangeOption('custom')}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 dark:text-slate-200">Custom image</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Upload a custom image for the header</div>
                    </div>
                    <label className="ml-auto inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                      Upload
                    </label>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <input
                      type="radio"
                      name="bg-option"
                      checked={backgroundOption === 'none'}
                      onChange={() => onChangeOption('none')}
                    />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">No background</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Remove the header background image</div>
                    </div>
                  </label>
                </div>

                {backgroundOption === 'custom' && backgroundImage !== 'none' && (
                  <div className="mt-4 relative">
                    <img src={backgroundImage} alt="Background preview" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => onChangeOption('default')}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-right">
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600">
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

export default AppSettingsDialog;

