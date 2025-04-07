import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiExternalLink, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const RecommendationCard = ({ recommendation, isExpanded, onToggle }) => {
  // Determine badge color based on confidence
  const getBadgeColor = (confidence) => {
    if (confidence >= 90) return 'bg-green-500/20 text-green-400';
    if (confidence >= 75) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const badgeColor = getBadgeColor(recommendation.confidence);

  // Animation variants
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  const contentVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { 
        height: {
          duration: 0.3
        },
        opacity: {
          duration: 0.2,
          delay: 0.1
        }
      }
    }
  };

  return (
    <motion.div 
      className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/50 hover:bg-slate-800/80 transition-colors"
      variants={item}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{recommendation.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{recommendation.description}</p>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor} ml-2`}>
              {recommendation.confidence}% Konfidenz
            </span>
            <button className="ml-2 text-gray-400 hover:text-white transition-colors">
              {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            className="px-4 pb-4 text-sm"
          >
            <div className="border-t border-slate-700/50 pt-4 mt-2">
              <div className="mb-3">
                <span className="text-gray-400">Auswirkung:</span>
                <span className="ml-2 text-white font-medium capitalize">{recommendation.impact}</span>
              </div>
              
              <div className="mb-3">
                <span className="text-gray-400">Quelle:</span>
                <span className="ml-2 text-white">{recommendation.source}</span>
              </div>
              
              {recommendation.steps && (
                <div>
                  <span className="text-gray-400 block mb-2">Empfohlene Schritte:</span>
                  <ul className="space-y-2">
                    {recommendation.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-2 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-2 mt-4 pt-3 border-t border-slate-700/50">
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded flex items-center justify-center text-white font-medium">
                  <FiCheck className="mr-1" /> Implementieren
                </button>
                <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 transition-colors rounded flex items-center justify-center text-white font-medium">
                  <FiX className="mr-1" /> Ablehnen
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecommendationCard;
