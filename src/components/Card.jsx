'use client';

import { motion } from 'framer-motion';

export default function Card({ 
  title, 
  children, 
  className = '', 
  icon: Icon = null,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={`glass-card overflow-hidden ${className}`}
    >
      <div className="p-5">
        {(title || Icon) && (
          <div className="flex items-center gap-2 mb-4">
            {Icon && <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            {title && <h3 className="text-lg font-medium text-gray-800 dark:text-white">{title}</h3>}
          </div>
        )}
        <div>{children}</div>
      </div>
    </motion.div>
  );
} 