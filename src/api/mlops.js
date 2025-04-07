// Mock function to fetch model metrics
export const fetchModelMetrics = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));

  // Generate mock metrics data
  const versions = ['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.4'];
  const accuracy = versions.map((v, i) => ({
    version: v,
    training: parseFloat((0.85 + i * 0.02 + Math.random() * 0.01).toFixed(3)),
    validation: parseFloat((0.83 + i * 0.018 + Math.random() * 0.015).toFixed(3)),
  }));

  const latency = versions.map((v, i) => ({
    version: v,
    p50: Math.floor(300 - i * 20 + Math.random() * 30), // Milliseconds
    p95: Math.floor(600 - i * 30 + Math.random() * 50), // Milliseconds
  }));

  return {
    accuracy: accuracy,
    latency: latency,
  };
};
