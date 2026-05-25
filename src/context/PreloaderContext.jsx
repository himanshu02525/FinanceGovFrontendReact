import React, { createContext, useState, useCallback } from 'react';

export const PreloaderContext = createContext();

export const PreloaderProvider = ({ children }) => {
  const [showPreloader, setShowPreloader] = useState(false);

  const showPreloaderScreen = useCallback(() => {
    setShowPreloader(true);
  }, []);

  const hidePreloaderScreen = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <PreloaderContext.Provider value={{ showPreloader, showPreloaderScreen, hidePreloaderScreen }}>
      {children}
    </PreloaderContext.Provider>
  );
};
