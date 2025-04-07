import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiRefreshCw,
  FiDownload,
  FiMaximize2,
  FiMinimize2,
  FiCalendar,
  FiBarChart2,
  FiTarget,
  FiZap
} from 'react-icons/fi';
import { fetchForecast, formatForecastForComponent } from '../../api/analytics';
import FallbackLoader from '../ui/FallbackLoader.jsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const formatCurrency = (value) => `€${Number(value).toLocaleString('de-DE')}`;

const PeriodSelector = ({ activePeriod, onChange }) => {
  const periods = [
    { id: 'week', label: 'Woche' },
    { id: 'month', label: 'Monat' },
    { id: 'quarter', label: 'Quartal' },
    { id: 'year', label: 'Jahr' }
  ];
  return (
    <div className="flex bg-gray-800/40 rounded-lg p-1">
      {periods.map(p => (
        <button key={p.id}
          className={`px-3 py-1.5 text-sm rounded-md transition-all ${
            activePeriod === p.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
          onClick={() => onChange(p.id)}>
          {p.label}
        </button>
      ))}
    </div>
  );
};

PeriodSelector.propTypes = {
  activePeriod: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const MetricCard = ({ title, value, icon, trend, trendValue, accentColor='blue' }) => {
  const TrendIcon = trend > 0 ? FiTrendingUp : FiTrendingDown;
  const trendColor = trend > 0 ? 'text-glow-green' : 'text-glow-red';
  const accentClass = `text-${accentColor}-400`;
  const accentBg = `bg-${accentColor}-500/10`;
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`${accentBg} ${accentClass} p-2 rounded-lg mr-3`}>
            {icon}
          </div>
          <div>
            <div className="text-sm text-gray-400">{title}</div>
            <div className="metric-value mt-1">{formatCurrency(value)}</div>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="mr-1" />
            <span>{Math.abs(trendValue).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EarningsForecast = () => {
  const [period, setPeriod] = useState('month');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [showConfidence, setShowConfidence] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchForecast(period);
        setForecastData(formatForecastForComponent(res.forecast));
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [period]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetchForecast(period);
      setForecastData(formatForecastForComponent(res.forecast));
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!forecastData?.periodTrend) return;
    const headers = 'Date,Forecast,Actual\n';
    const rows = forecastData.periodTrend.map(i => `${i.ds},${i.forecast},${i.actual||''}`).join('\n');
    const csv = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `forecast_${period}_${Date.now()}.csv`;
    link.click();
  };

  const display = forecastData || {
    currentPeriod: 2850,
    previousPeriod: 2200,
    forecastNextPeriod: 3300,
    percentChange: 18.75,
    periodTrend: []
  };

  const chartData = useMemo(() => {
    const t = display.periodTrend;
    return {
      labels: t.map(i => i.month),
      datasets: [
        ...(showConfidence ? [{
          label: 'Konfidenzintervall',
          data: t.map(() => null),
          fill: true,
          backgroundColor: 'rgba(56,189,248,0.1)',
          pointRadius: 0,
          borderWidth: 0,
          tension: 0.4,
          fill: {
            target: 'origin',
            above: 'rgba(56,189,248,0.1)',
            below: 'rgba(0,0,0,0)'
          }
        }] : []),
        {
          label: 'Tatsächlich',
          data: t.map(i => i.actual),
          borderColor: 'rgba(156,163,175,0.8)',
          backgroundColor: 'rgba(156,163,175,1)',
          pointRadius: 4,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: 'rgba(156,163,175,1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5
        },
        {
          label: 'Prognose',
          data: t.map(i => i.forecast),
          borderColor: 'rgba(56,189,248,0.8)',
          backgroundColor: 'rgba(56,189,248,1)',
          tension: 0.4,
          pointRadius: 4,
          borderWidth: 2.5,
          pointBackgroundColor: 'rgba(56,189,248,1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5
        }
      ]
    };
  }, [display, showConfidence]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', align: 'end' },
      tooltip: {
        backgroundColor: 'rgba(17,24,39,0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(107,114,128,0.2)',
        borderWidth: 1,
        displayColors: true,
        boxPadding: 5,
        callbacks: {
          label: ctx => {
            if(ctx.dataset.label==='Konfidenzintervall') return null;
            let label = ctx.dataset.label || '';
            if(label) label += ': ';
            if(ctx.parsed.y!==null) label += formatCurrency(ctx.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(107,114,128,0.1)', borderDash: [5,5] },
        ticks: { callback: v => formatCurrency(v), color: 'rgba(156,163,175,0.8)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(156,163,175,0.8)' }
      }
    }
  }), [display, showConfidence]);

  return (
    <motion.div className="glass-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <FiDollarSign size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Einkommensprognose
              {isLoading && <span className="animate-spin text-blue-400"><FiRefreshCw size={16} /></span>}
            </h2>
            <p className="text-sm text-gray-400">Intelligente Vorhersagen für deine finanzielle Planung</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PeriodSelector activePeriod={period} onChange={setPeriod} />
          <div className="flex space-x-1 bg-gray-800/40 rounded-lg p-1">
            <button onClick={handleRefresh} className="btn-glass" title="Aktualisieren"><FiRefreshCw size={16} /></button>
            <button onClick={handleExport} className="btn-glass" title="Exportieren"><FiDownload size={16} /></button>
            <button onClick={() => setIsExpanded(!isExpanded)} className="btn-glass" title={isExpanded ? 'Minimieren' : 'Erweitern'}>
              {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard title="Aktueller Zeitraum" value={display.currentPeriod} icon={<FiCalendar size={18} />} />
        <MetricCard title="Vorheriger Zeitraum" value={display.previousPeriod} icon={<FiCalendar size={18} />} />
        <MetricCard title="Prognose" value={display.forecastNextPeriod} icon={<FiTrendingUp size={18} />} trend={display.percentChange} trendValue={display.percentChange} accentColor="green" />
        <MetricCard title="Durchschnitt" value={display.averageIncome || 3231} icon={<FiBarChart2 size={18} />} accentColor="purple" />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }} className="metrics-grid mb-4 overflow-hidden">
            <MetricCard title="Höchster Wert" value={display.highestMonth?.value || 4300} icon={<FiTarget size={18} />} accentColor="blue" />
            <MetricCard title="Jahresprognose" value={display.projectedAnnual || 41875} icon={<FiZap size={18} />} accentColor="green" />
            <MetricCard title="Zielfortschritt" value={display.goalProgress || 68} icon={<FiTarget size={18} />} accentColor="purple" formatter={v => `${v}%`} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <label className="flex items-center space-x-2 text-sm text-gray-400">
          <input type="checkbox" checked={showConfidence} onChange={() => setShowConfidence(!showConfidence)} className="form-checkbox h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500" />
          <span>Konfidenzintervall anzeigen</span>
        </label>
      </div>

      <div className="chart-container h-80 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg z-10">
            <div className="text-red-400 text-center p-4 max-w-md">
              <p className="text-lg font-semibold">Daten konnten nicht geladen werden</p>
              <p className="mt-1 text-sm text-gray-300">{error}</p>
              <button onClick={handleRefresh} className="mt-4 btn-glass flex items-center justify-center gap-2 mx-auto"><FiRefreshCw size={14} /><span>Erneut versuchen</span></button>
            </div>
          </div>
        )}

        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg z-10">
            <FallbackLoader text="Prognosedaten werden geladen..." />
          </div>
        )}

        <div className="absolute inset-0">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="mt-6 flex justify-between text-xs text-gray-500">
        <div>Letzte Aktualisierung: {new Date().toLocaleString('de-DE')}</div>
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <span className="text-blue-400 font-semibold">AutoMonet AI</span>
        </div>
      </div>
    </motion.div>
  );
};

export default EarningsForecast;
