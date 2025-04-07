import { z } from 'zod';

const skillLevelSchema = z.enum(['beginner', 'intermediate', 'expert']);
const proposalStyleSchema = z.enum(['professional', 'conversational', 'technical', 'persuasive']);
const proposalLengthSchema = z.enum(['short', 'medium', 'long']);

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  skillLevel: skillLevelSchema,
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  specialties: z.array(z.string().min(1, 'Specialty cannot be empty'))
});

export const jobPrefsSchema = z.object({
  minBudget: z.number().min(0),
  maxBudget: z.number().min(0),
  preferredKeywords: z.array(z.string()),
  excludedKeywords: z.array(z.string()),
  priorityScore: z.number().min(1).max(10)
});

export const aiSettingsSchema = z.object({
  proposalStyle: proposalStyleSchema,
  proposalLength: proposalLengthSchema,
  useHighEndModels: z.boolean(),
  modelName: z.string(),
  fallbackModel: z.string(),
  maxTokenBudget: z.number().min(1000)
});

export const platformSettingsSchema = z.object({
  activeFreelancePlatforms: z.array(z.string().min(1)),
  proposalsPerDay: z.number().min(0),
  maxConcurrentJobs: z.number().min(1)
});

export const systemSettingsSchema = z.object({
  runInterval: z.number().min(5),
  notificationEmail: z.string().email(),
  debugMode: z.boolean(),
  dailyBudget: z.number().min(0)
});

export const settingsSchema = z.object({
  profile: profileSchema,
  jobPreferences: jobPrefsSchema,
  aiSettings: aiSettingsSchema,
  platformSettings: platformSettingsSchema,
  systemSettings: systemSettingsSchema
});
