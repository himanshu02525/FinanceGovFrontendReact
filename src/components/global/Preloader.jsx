import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreloader } from '../../hooks/usePreloader';
import './Preloader.css';

const Preloader = () => {
  const { showPreloader, hidePreloaderScreen } = usePreloader();

  useEffect(() => {
    if (showPreloader) {
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        hidePreloaderScreen();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPreloader, hidePreloaderScreen]);

  return (
    <AnimatePresence>
      {showPreloader && (
        <div className="preloader-overlay">
          <motion.div 
            initial={{ scale: 0.5, filter: 'blur(15px)', opacity: 0 }} 
            animate={{ scale: [0.5, 1.1, 1], filter: 'blur(0px)', opacity: 1 }} 
            transition={{ duration: 2.5, ease: "easeInOut" }} 
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="preloader-brand"
          > 
            <h1 className="display-1 fw-bold text-white"> 
              Finance<span className="text-warning">Gov</span> 
            </h1> 
            <p className="letter-spacing">NATIONAL FINANCIAL REGULATION</p> 
          </motion.div> 
        </div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;