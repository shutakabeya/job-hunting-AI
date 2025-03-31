'use client';

import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function AppLayout({ children, title }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6 relative">
        <div className="max-w-7xl mx-auto">
          {title && (
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold mb-8 text-gray-800 dark:text-white"
            >
              {title}
            </motion.h1>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
} 