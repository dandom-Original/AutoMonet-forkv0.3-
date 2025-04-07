import { supabase } from '../integrations/supabase';
import type { Settings } from '../types/settings';

export const fetchSettings = async (userId: string): Promise<Settings> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw new Error(error.message);
  
  return {
    profile: data.profile || {
      name: '',
      email: '',
      skillLevel: 'intermediate',
      hourlyRate: 50,
      specialties: []
    },
    jobPreferences: data.jobPreferences || {
      minBudget: 500,
      maxBudget: 5000,
      preferredKeywords: [],
      excludedKeywords: [],
      priorityScore: 5
    },
    aiSettings: data.aiSettings || {
      proposalStyle: 'professional',
      proposalLength: 'medium',
      useHighEndModels: false,
      modelName: 'gpt-3.5-turbo',
      fallbackModel: 'gpt-3.5-turbo',
      maxTokenBudget: 50000
    },
    platformSettings: data.platformSettings || {
      activeFreelancePlatforms: [],
      proposalsPerDay: 5,
      maxConcurrentJobs: 3
    },
    systemSettings: data.systemSettings || {
      runInterval: 30,
      notificationEmail: '',
      debugMode: false,
      dailyBudget: 2.50
    }
  };
};

export const updateSettings = async (userId: string, settings: Settings) => {
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...settings
    }, { onConflict: 'user_id' });
  
  if (error) throw new Error(error.message);
};
