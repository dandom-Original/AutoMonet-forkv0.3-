import React from 'react';

const LoadingSkeleton = ({ type = 'rectangle', width, height, className = '', count = 1 }) => {
  // Function to generate skeleton based on type
  const generateSkeleton = (index) => {
    const baseClasses = `animate-pulse bg-gray-700/50 rounded ${className}`;

    switch (type) {
      case 'circle':
        return (
          <div 
            key={index}
            className={`${baseClasses} rounded-full`}
            style={{ 
              width: width || '3rem', 
              height: height || width || '3rem' 
            }}
          />
        );

      case 'text':
        return (
          <div key={index} className="space-y-2">
            <div 
              className={`${baseClasses}`}
              style={{ 
                width: width || '100%', 
                height: height || '0.8rem'
              }}
            />
            <div 
              className={`${baseClasses}`}
              style={{ 
                width: '80%', 
                height: height || '0.8rem'
              }}
            />
          </div>
        );

      case 'card':
        return (
          <div 
            key={index}
            className={`${baseClasses} p-4 border border-gray-700/30`}
            style={{ 
              width: width || '100%', 
              height: height || '8rem'
            }}
          >
            <div className="flex justify-between">
              <div className="w-1/3 h-6 bg-gray-600/50 rounded" />
              <div className="w-12 h-6 bg-gray-600/50 rounded" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full h-4 bg-gray-600/50 rounded" />
              <div className="w-full h-4 bg-gray-600/50 rounded" />
              <div className="w-2/3 h-4 bg-gray-600/50 rounded" />
            </div>
          </div>
        );

      case 'stats':
        return (
          <div 
            key={index}
            className={`${baseClasses} p-4`}
            style={{ 
              width: width || '100%', 
              height: height || '7rem'
            }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-600/50 rounded" />
                <div className="w-16 h-6 bg-gray-600/50 rounded" />
              </div>
              <div className="w-10 h-10 bg-gray-600/50 rounded-full" />
            </div>
            <div className="mt-4 w-24 h-3 bg-gray-600/50 rounded" />
          </div>
        );

      case 'table-row':
        return (
          <div 
            key={index}
            className={`${baseClasses} flex space-x-4 p-3`}
            style={{ 
              width: width || '100%', 
              height: height || '3rem'
            }}
          >
            <div className="w-1/4 h-6 bg-gray-600/50 rounded" />
            <div className="w-1/5 h-6 bg-gray-600/50 rounded" />
            <div className="w-1/5 h-6 bg-gray-600/50 rounded" />
            <div className="w-1/6 h-6 bg-gray-600/50 rounded" />
          </div>
        );

      // Default rectangle
      default:
        return (
          <div 
            key={index}
            className={baseClasses}
            style={{ 
              width: width || '100%', 
              height: height || '1.5rem'
            }}
          />
        );
    }
  };

  // Generate multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, index) => generateSkeleton(index))}
      </div>
    );
  }

  // Single skeleton
  return generateSkeleton(0);
};

export default LoadingSkeleton;
