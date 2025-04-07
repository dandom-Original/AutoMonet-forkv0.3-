/*
# User Settings Table

Creates a table to store all user settings for the AutoMonet system.

1. Table Structure
  - `user_id`: UUID reference to auth.users
  - `profile`: JSONB column for profile settings
  - `job_preferences`: JSONB column for job preferences
  - `ai_settings`: JSONB column for AI configurations
  - `platform_settings`: JSONB column for platform configurations
  - `system_settings`: JSONB column for system settings
  - `created_at`: Timestamp of record creation
  - `updated_at`: Timestamp of last update

2. Security
  - Enable RLS with policies for owner access only
*/

CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  job_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  platform_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  system_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can manage own settings" 
  ON user_settings
  FOR ALL
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_user_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_update_timestamp
BEFORE UPDATE ON user_settings
FOR EACH ROW
EXECUTE FUNCTION update_user_settings_timestamp();
