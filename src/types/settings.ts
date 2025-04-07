export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type ProposalStyle = 'professional' | 'conversational' | 'technical' | 'persuasive';
export type ProposalLength = 'short' | 'medium' | 'long';

export interface ProfileSettings {
  name: string;
  email: string;
  skillLevel: SkillLevel;
  hourlyRate: number;
  specialties: string[];
}

export interface JobPreferences {
  minBudget: number;
  maxBudget: number;
  preferredKeywords: string[];
  excludedKeywords: string[];
  priorityScore: number;
}

export interface AISettings {
  proposalStyle: ProposalStyle;
  proposalLength: ProposalLength;
  useHighEndModels: boolean;
  modelName: string;
  fallbackModel: string;
  maxTokenBudget: number;
}

export interface PlatformSettings {
  activeFreelancePlatforms: string[];
  proposalsPerDay: number;
  maxConcurrentJobs: number;
}

export interface SystemSettings {
  runInterval: number;
  notificationEmail: string;
  debugMode: boolean;
  dailyBudget: number;
}

export interface Settings {
  profile: ProfileSettings;
  jobPreferences: JobPreferences;
  aiSettings: AISettings;
  platformSettings: PlatformSettings;
  systemSettings: SystemSettings;
}
