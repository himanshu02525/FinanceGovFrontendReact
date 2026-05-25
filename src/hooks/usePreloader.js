import { useContext } from 'react';
import { PreloaderContext } from '../context/PreloaderContext';

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within PreloaderProvider');
  }
  return context;
};
