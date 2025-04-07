import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, handleSupabaseError } from '../integrations/supabase';
import type { DashboardData, JobOpportunity } from '../types/dashboard';

// Keys for React Query cache
const KEYS = {
  dashboard: 'dashboard',
  jobs: 'jobs',
  recommendations: 'recommendations',
  analytics: 'analytics'
};

/**
 * Fetches dashboard data from Supabase
 */
const fetchDashboardData = async (): Promise<DashboardData> => {
  // Get real-time stats data
  const { data: stats, error: statsError } = await supabase
    .from('dashboard_stats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (statsError) {
    throw handleSupabaseError(statsError);
  }

  // Get recent jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('job_opportunities')
    .select('*')
    .order('posted_at', { ascending: false })
    .limit(5);

  if (jobsError) {
    throw handleSupabaseError(jobsError);
  }

  // Get cost analysis data
  const { data: costs, error: costsError } = await supabase
    .from('analytics_data')
    .select('*')
    .eq('type', 'cost_analysis')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (costsError) {
    throw handleSupabaseError(costsError);
  }

  // Get AI recommendations
  const { data: recommendations, error: recommendationsError } = await supabase
    .from('ai_recommendations')
    .select('*')
    .eq('status', 'active')
    .order('impact_score', { ascending: false })
    .limit(3);

  if (recommendationsError) {
    throw handleSupabaseError(recommendationsError);
  }

  // Transform data from database format to application format
  return {
    stats: {
      earnings: {
        value: `€${stats.earnings_value}`,
        change: stats.earnings_change > 0 ? `+${stats.earnings_change}%` : `${stats.earnings_change}%`,
        status: stats.earnings_change > 0 ? 'increase' : stats.earnings_change < 0 ? 'decrease' : 'neutral'
      },
      proposals: {
        value: stats.proposals_value.toString(),
        change: stats.proposals_change > 0 ? `+${stats.proposals_change}%` : `${stats.proposals_change}%`,
        status: stats.proposals_change > 0 ? 'increase' : stats.proposals_change < 0 ? 'decrease' : 'neutral'
      },
      conversion: {
        value: `${stats.conversion_value}%`,
        change: stats.conversion_change > 0 ? `+${stats.conversion_change}%` : `${stats.conversion_change}%`,
        status: stats.conversion_change > 0 ? 'increase' : stats.conversion_change < 0 ? 'decrease' : 'neutral'
      },
      costs: {
        value: `€${stats.costs_value}`,
        change: stats.costs_change > 0 ? `+${stats.costs_change}%` : `${stats.costs_change}%`,
        status: stats.costs_change > 0 ? 'increase' : stats.costs_change < 0 ? 'decrease' : 'neutral'
      }
    },
    recentJobs: jobs.map(job => ({
      id: job.id,
      title: job.title,
      budget: job.budget_range,
      source: job.platform,
      matchScore: job.match_score,
      postedAt: job.posted_at,
      description: job.description,
      skills: job.skills,
      clientInfo: job.client_info,
      status: job.status
    })),
    costAnalysis: {
      monthly: costs.data.monthly_earnings,
      costs: costs.data.monthly_costs,
      months: costs.data.months,
      forecast: costs.data.forecast,
      confidence: costs.data.confidence_intervals
    },
    aiRecommendations: recommendations.map(rec => ({
      id: rec.id,
      title: rec.title,
      description: rec.description,
      impact: rec.impact_level,
      action: rec.action_type,
      category: rec.category,
      implementationDifficulty: rec.implementation_difficulty,
      estimatedTimeInvestment: rec.estimated_time,
      potentialReturn: rec.potential_return,
      relatedMetrics: rec.related_metrics
    })),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Custom hook to fetch dashboard data with React Query
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: [KEYS.dashboard],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    // Fallback behavior if Supabase connection fails
    onError: (error) => {
      console.error('Error fetching dashboard data:', error);
    }
  });
};

/**
 * Updates a job status (e.g. marking as viewed or applied)
 */
export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ jobId, status }: { jobId: string, status: JobOpportunity['status'] }) => {
      const { data, error } = await supabase
        .from('job_opportunities')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', jobId)
        .select()
        .single();
        
      if (error) throw handleSupabaseError(error);
      return data;
    },
    // Optimistic updates to update UI immediately
    onMutate: async ({ jobId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [KEYS.dashboard] });
      await queryClient.cancelQueries({ queryKey: [KEYS.jobs] });
      
      // Snapshot the previous value
      const previousDashboard = queryClient.getQueryData([KEYS.dashboard]);
      
      // Optimistically update dashboard data
      queryClient.setQueryData<DashboardData>([KEYS.dashboard], (old) => {
        if (!old) return old;
        
        return {
          ...old,
          recentJobs: old.recentJobs.map(job => 
            job.id === jobId ? { ...job, status } : job
          )
        };
      });
      
      // Return context object with snapshot
      return { previousDashboard };
    },
    // If mutation fails, use context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData([KEYS.dashboard], context.previousDashboard);
      }
    },
    // After success or error, invalidate related queries
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.dashboard] });
      queryClient.invalidateQueries({ queryKey: [KEYS.jobs] });
    }
  });
};

// Export more hooks for other dashboard-related operations as needed
