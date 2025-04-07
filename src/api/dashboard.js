import axios from 'axios';

// Mock data for development
const mockDashboardData = {
  stats: {
    earnings: {
      value: "€4,256.78",
      change: "+12.3%",
      status: "increase"
    },
    proposals: {
      value: "24",
      change: "+8.5%",
      status: "increase"
    },
    conversion: {
      value: "28.4%",
      change: "-2.1%",
      status: "decrease"
    },
    costs: {
      value: "€156.32",
      change: "+5.7%",
      status: "increase"
    }
  },
  recentJobs: [
    {
      id: "job-1",
      title: "Full-Stack React Developer für Fintech Startup",
      budget: "€4,000-6,000",
      source: "Upwork",
      matchScore: 92
    },
    {
      id: "job-2",
      title: "Frontend Developer mit React/TypeScript Erfahrung",
      budget: "€80/Stunde",
      source: "Freelancer",
      matchScore: 88
    },
    {
      id: "job-3",
      title: "React Native App für E-Commerce Plattform",
      budget: "€8,500",
      source: "Fiverr",
      matchScore: 76
    },
    {
      id: "job-4",
      title: "API Integration Spezialist für SaaS Produkt",
      budget: "€3,200",
      source: "Upwork",
      matchScore: 65
    }
  ],
  costAnalysis: {
    monthly: [1250, 1420, 1650, 1890, 2240, 2480, 2750, 3100, 3480, 3950, 4200, 4250],
    costs: [120, 140, 135, 180, 210, 190, 240, 220, 250, 275, 280, 290],
    months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
  },
  aiRecommendations: [
    {
      id: "rec-1",
      title: "Erhöhe deine Antwortrate",
      description: "Personalisiere deine Proposals stärker, um 30% höhere Antwortrate zu erzielen.",
      impact: "high",
      action: "Optimize Proposals"
    },
    {
      id: "rec-2",
      title: "Neue Skills im Trend",
      description: "React Native und Flutter Projekte nehmen um 24% zu.",
      impact: "medium",
      action: "Explore Skills"
    },
    {
      id: "rec-3",
      title: "Preiserhöhung möglich",
      description: "Für Enterprise-Kunden kann dein Stundensatz um €15 erhöht werden.",
      impact: "high",
      action: "Adjust Rates"
    }
  ]
};

export const fetchDashboardData = async () => {
  // In production, this would be:
  // const { data } = await axios.get('/api/v1/dashboard')
  
  // For development, return mock data
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  return mockDashboardData;
};

export const fetchJobs = async (status) => {
  const params = status ? { status } : {};
  
  // In production, this would be:
  // const { data } = await axios.get('/api/v1/jobs', { params })
  
  // For development, filter mock data based on status if needed
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockDashboardData.recentJobs;
};
