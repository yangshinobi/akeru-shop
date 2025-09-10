import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-400 border-solid"></div>
    </div>
  );
};

export default Loader;

