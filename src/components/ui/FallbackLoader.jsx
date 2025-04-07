import React from 'react';

const FallbackLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background-light dark:bg-background-dark">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
    </div>
  );
};

export default FallbackLoader;
