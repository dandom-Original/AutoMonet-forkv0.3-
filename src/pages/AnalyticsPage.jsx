import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics, fetchForecast } from '../api/analytics.js'; // Added .js
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiDollarSign, FiTarget, FiPieChart, FiTrendingUp, FiBarChart } from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: analyticsData, isLoading: isLoadingAnalytics, error: errorAnalytics } = useQuery(
    ['analytics', timeRange],
    () => fetchAnalytics(timeRange),
    { keepPreviousData: true }
  );

  const { data: forecastData, isLoading: isLoadingForecast, error: errorForecast } = useQuery(
    ['forecast'],
    fetchForecast
  );

  const renderLoading = () => <div className="flex justify-center items-center h-32"><FiTrendingUp className="animate-spin h-8 w-8 text-blue-500" /></div>;
  const renderError = (error) => <div className="text-red-500 text-center p-4">Error loading data: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card">
          <div className="flex items-center text-gray-400 mb-2">
            <FiDollarSign className="mr-2" />
            <span>Total Earnings</span>
          </div>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) :
            <p className="text-3xl font-bold">${analyticsData?.earnings?.total?.toLocaleString()}</p>
          }
        </div>
        <div className="dashboard-card">
          <div className="flex items-center text-gray-400 mb-2">
            <FiTarget className="mr-2" />
            <span>Jobs Applied</span>
          </div>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) :
            <p className="text-3xl font-bold">{analyticsData?.jobs?.applied}</p>
          }
        </div>
        <div className="dashboard-card">
          <div className="flex items-center text-gray-400 mb-2">
            <FiTrendingUp className="mr-2" />
            <span>Conversion Rate</span>
          </div>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) :
            <p className="text-3xl font-bold">{analyticsData?.conversionRates?.overall}%</p>
          }
        </div>
        <div className="dashboard-card">
          <div className="flex items-center text-gray-400 mb-2">
            <FiDollarSign className="mr-2" />
            <span>AI Costs</span>
          </div>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) :
            <p className="text-3xl font-bold">${analyticsData?.aiCosts?.total?.toFixed(2)}</p>
          }
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Earnings Trend</h2>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData?.earnings?.trend.map((value, index) => ({ name: analyticsData?.earnings?.labels[index], earnings: value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Area type="monotone" dataKey="earnings" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Job Funnel */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Job Funnel</h2>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Found', count: analyticsData?.jobs?.found },
                { name: 'Applied', count: analyticsData?.jobs?.applied },
                { name: 'Awarded', count: analyticsData?.jobs?.awarded },
                { name: 'Rejected', count: analyticsData?.jobs?.rejected },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Job Sources */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Job Sources</h2>
          {isLoadingAnalytics ? renderLoading() : errorAnalytics ? renderError(errorAnalytics) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData?.sources?.labels.map((label, index) => ({ name: label, value: analyticsData?.sources?.data[index] }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData?.sources?.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Earnings Forecast */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Earnings Forecast (Next 30 Days)</h2>
          {isLoadingForecast ? renderLoading() : errorForecast ? renderError(errorForecast) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecastData?.forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ds" stroke="#9ca3af" tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}/>
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelFormatter={(label) => new Date(label).toLocaleDateString()}/>
                <Area type="monotone" dataKey="yhat" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Forecast" />
                <Area type="monotone" dataKey="yhat_lower" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Lower Bound" strokeDasharray="5 5"/>
                <Area type="monotone" dataKey="yhat_upper" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Upper Bound" strokeDasharray="5 5"/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
