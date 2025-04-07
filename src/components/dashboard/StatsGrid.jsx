import React from 'react';
import { FiDollarSign, FiBriefcase, FiSend, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats }) => {
  // Default stats if none are provided
  const defaultStats = {
    earnings: { total: 0 },
    jobs: { active: 0 },
    proposals: { submitted: 0, accepted: 0, total: 1 }  // Total minimum 1 to avoid division by zero
  };
  
  // Use provided stats or fallback to defaults
  const safeStats = stats || defaultStats;
  
  const statItems = [
    { 
      title: 'Total Earnings', 
      value: `$${safeStats.earnings?.total?.toLocaleString() || 0}`,
      change: '+12%',
      icon: <FiDollarSign className="h-6 w-6" />,
      color: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Active Jobs',
      value: safeStats.jobs?.active || 0,
      change: '+5',
      icon: <FiBriefcase className="h-6 w-6" />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Proposals Sent',
      value: safeStats.proposals?.submitted || 0,
      change: '+3',
      icon: <FiSend className="h-6 w-6" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Acceptance Rate',
      value: `${Math.round((safeStats.proposals?.accepted / safeStats.proposals?.total) * 100) || 0}%`,
      change: '+2%',
      icon: <FiCheckCircle className="h-6 w-6" />,
      color: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  // Animation variants for the grid items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {statItems.map((stat, i) => (
        <motion.div 
          key={i} 
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-slate-700/10 overflow-hidden"
          variants={item}
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <span className={stat.textColor}>
                  {stat.icon}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                {stat.change}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-400 text-sm ml-2">seit letzter Woche</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
