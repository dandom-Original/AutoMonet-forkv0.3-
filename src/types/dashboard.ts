/**
 * Dashboard related type definitions
 */

// Stats card items
export interface StatItem {
  value: string;
  change: string;
  status: 'increase' | 'decrease' | 'neutral';
}

export interface DashboardStats {
  earnings: StatItem;
  proposals: StatItem;
  conversion: StatItem;
  costs: StatItem;
}

// Job opportunities
export interface JobOpportunity {
  id: string;
  title: string;
  description?: string;
  budget?: string;
  source: string;
  postedAt: string;
  matchScore: number;
  skills?: string[];
  clientInfo?: {
    name?: string;
    rating?: number;
    location?: string;
    hireRate?: number;
  };
  status?: 'new' | 'viewed' | 'applied' | 'interviewing' | 'rejected' | 'accepted';
}

// Cost and earnings analysis
export interface CostAnalysisData {
  monthly: number[];
  costs: number[];
  months: string[];
  forecast?: number[];
  confidence?: number[];
}

// AI recommendations
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  action: string;
  category?: 'pricing' | 'skills' | 'proposals' | 'marketing' | 'other';
  implementationDifficulty?: 'easy' | 'medium' | 'hard';
  estimatedTimeInvestment?: string;
  potentialReturn?: string;
  relatedMetrics?: string[];
}

// Complete dashboard data structure
export interface DashboardData {
  stats: DashboardStats;
  recentJobs: JobOpportunity[];
  costAnalysis: CostAnalysisData;
  aiRecommendations: AIRecommendation[];
  lastUpdated?: string;
}

// Response statuses
export type QueryStatus = 'idle' | 'loading' | 'error' | 'success';
