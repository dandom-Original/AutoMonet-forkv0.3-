import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiArrowRight, FiAlertTriangle } from 'react-icons/fi';
import { fetchDashboardData } from '../api/dashboard.js';
import StatsGrid from '../components/dashboard/StatsGrid.jsx';
import EarningsForecast from '../components/analytics/EarningsForecast.jsx';
import AIRecommendations from '../components/ai/AIRecommendations.jsx';
import ModelMonitor from '../components/ops/ModelMonitor.jsx';

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  const getSafe = (key, fallback) => (isLoading || error || !data ? fallback : data[key] ?? fallback);

  const stats = getSafe('stats', {});
  const recentJobs = getSafe('recentJobs', []);
  const aiRecommendations = getSafe('aiRecommendations', []);

  return (
    <div className="container-desktop space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={() => refetch()}
          className="btn-glass flex items-center gap-2"
          disabled={isLoading}
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Aktualisieren
        </button>
      </div>

      {isLoading ? (
        <div className="glass-card flex justify-center py-20">
          <FiRefreshCw className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : error ? (
        <div className="glass-card text-center py-10 border border-red-700 bg-red-900/30">
          <FiAlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" />
          <p className="text-red-400 mb-2 font-semibold">Fehler beim Laden der Dashboard-Daten</p>
          <p className="text-sm text-red-300 mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="btn-glass">Erneut versuchen</button>
        </div>
      ) : (
        <>
          <StatsGrid stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Neueste Jobs</h2>
                <Link to="/jobs" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                  Alle ansehen <FiArrowRight className="ml-1" />
                </Link>
              </div>
              {recentJobs.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                  {recentJobs.map(job => (
                    <div key={job.id} className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-100">{job.title}</h3>
                        <span className="text-blue-400 font-semibold">{job.budget || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-gray-400">{job.source}</span>
                        <div className="flex items-center" title={`Match Score: ${job.matchScore}%`}>
                          <div className="w-16 bg-slate-600 rounded-full h-1.5 mr-2 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-colors duration-300 ${
                                job.matchScore > 85 ? 'bg-green-500' :
                                job.matchScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${job.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-300">{job.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Keine aktuellen Jobs gefunden.</p>
              )}
            </div>

            <EarningsForecast />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIRecommendations recommendations={aiRecommendations} />
            <ModelMonitor />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
