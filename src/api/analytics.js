/* eslint-disable no-console */
import axios from 'axios';

/**
 * Fetches analytics data for the specified time range
 * @param {string} timeRange - Time range for analytics (7d, 30d, 90d, all)
 * @returns {Promise} Analytics data
 */
export const fetchAnalytics = async (timeRange = '30d') => {
  try {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful data fetching
    const mockData = {
      earnings: {
        total: 3250.75,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        trend: [320, 450, 380, 520, 490, 600, 750, 820, 900, 980, 1100, 1250],
        change: 5.2,
      },
      proposals: {
        total: 128,
        change: -2.1,
      },
      conversionRate: {
        value: 2.8,
        change: 1.5,
      },
      averageCost: {
        value: 15.70,
        change: 0.8,
      },
    };
    return mockData;

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return an error object instead of throwing, to be handled by the component
    return { error: 'Failed to fetch analytics data.' };
  }
};


/**
 * Fetches forecast data for earnings.
 * @param {string} period - Time period for the forecast (week, month, quarter, year)
 * @returns {Promise} Forecast data or error object.
 */
export const fetchForecast = async (period = 'month') => {
  try {
    // Simulate network request delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate forecast data
    const mockForecastData = {
      forecast: [
        { month: 'Jan', forecast: 2200, actual: 2180, confidence: [2000, 2400] },
        { month: 'Feb', forecast: 2400, actual: 2350, confidence: [2200, 2600] },
        { month: 'Mär', forecast: 2650, actual: 2700, confidence: [2400, 2900] },
        { month: 'Apr', forecast: 2850, actual: 2820, confidence: [2650, 3050] },
        { month: 'Mai', forecast: 3000, actual: null, confidence: [2750, 3250] },
        { month: 'Jun', forecast: 3300, actual: null, confidence: [2950, 3650] }
      ]
    };
    return { forecast: mockForecastData };

  } catch (error) {
    console.error('Error fetching forecast data:', error);
    // Return an error object to be handled by the component
    return { error: 'Failed to fetch forecast data.' };
  }
};


/**
 * Formats the raw forecast data into a structure suitable for the EarningsForecast component.
 * @param {Array<Object>} rawForecast - Raw forecast data array.
 * @returns {Object} Formatted forecast data for the component.
 */
export const formatForecastForComponent = (rawForecast) => {
  if (!rawForecast || !Array.isArray(rawForecast)) {
    console.warn('Invalid or empty raw forecast data received.');
    return {
      currentPeriod: 0,
      previousPeriod: 0,
      forecastNextPeriod: 0,
      percentChange: 0,
      periodTrend: []
    };
  }

  // Example logic - adapt based on actual data and requirements
  const currentPeriodValue = rawForecast.slice(3, 4).reduce((sum, item) => sum + item.forecast, 0); // 'Apr' value
  const previousPeriodValue = rawForecast.slice(2, 3).reduce((sum, item) => sum + item.forecast, 0); // 'Mär' value
  const forecastNextPeriodValue = rawForecast.slice(5, 6).reduce((sum, item) => sum + item.forecast, 0); // 'Jun' value
  const percentChangeValue = previousPeriodValue === 0 ? 0 : ((currentPeriodValue - previousPeriodValue) / previousPeriodValue) * 100;


  return {
    currentPeriod: currentPeriodValue,
    previousPeriod: previousPeriodValue,
    forecastNextPeriod: forecastNextPeriodValue,
    percentChange: percentChangeValue,
    periodTrend: rawForecast.map(item => ({
      month: item.month,
      forecast: item.forecast,
      actual: item.actual,
      confidence: item.confidence
    }))
  };
};
