import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiActivity, FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';

const ModelMonitor = () => {
  // Sample data - in a real application, this would come from your API
  const models = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      status: 'active',
      responseTime: 540, // ms
      costPer1k: 0.06,
      usageToday: 23,
      health: 98
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      status: 'active',
      responseTime: 380, // ms
      costPer1k: 0.0035,
      usageToday: 56,
      health: 99
    },
    {
      id: 'claude-3',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      status: 'degraded',
      responseTime: 600, // ms
      costPer1k: 0.025,
      usageToday: 12,
      health: 85
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 95) return 'text-green-500';
    if (health >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <div className="dashboard-card">
      <h2 className="dashboard-title">
        <div className="flex items-center">
          <FiCpu className="mr-2" />
          <span>KI-Modell Monitor</span>
        </div>
      </h2>

      <motion.div 
        className="mt-4 space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {models.map((model) => (
          <motion.div 
            key={model.id}
            className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50"
            variants={item}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium text-white">{model.name}</h3>
                  <span className="text-xs text-gray-400 ml-2">({model.provider})</span>
                  <span className={`ml-2 w-2 h-2 rounded-full ${getStatusColor(model.status)}`} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center text-gray-400">
                    <FiActivity className="mr-1 w-3 h-3" />
                    <span>{model.responseTime}ms</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiDollarSign className="mr-1 w-3 h-3" />
                    <span>${model.costPer1k}/1k tokens</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FiClock className="mr-1 w-3 h-3" />
                    <span>{model.usageToday} Anfragen heute</span>
                  </div>
                  <div className={`flex items-center ${getHealthColor(model.health)}`}>
                    <FiAlertCircle className="mr-1 w-3 h-3" />
                    <span>{model.health}% Zuverlässigkeit</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="ml-4 w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
                  <span className="text-lg font-bold text-center leading-none">
                    {model.health}%
                  </span>
                </div>
              </div>
            </div>
            
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-sm">
        <span className="text-gray-400">Autoscaler Status: <span className="text-green-400">Aktiv</span></span>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          Zur Verwaltungskonsole
        </button>
      </div>
    </div>
  );
};

export default ModelMonitor;
