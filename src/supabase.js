import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hifgomkrcwldlolrowql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZmdvbWtyY3dsZGxvbHJvd3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMzc3MTksImV4cCI6MjEwMzcxMzcxOX0.zDAate-ddmcVE_FVetFGlbupicLzNFL2CEZOOIfBArY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Universal sync helper:
 * Loads JSON key from Supabase (fallback to localStorage or defaultValue),
 * Saves JSON key to Supabase and localStorage simultaneously.
 */
export const fetchCloudStore = async (key, defaultValue) => {
  try {
    const { data, error } = await supabase
      .from('ams_app_data')
      .select('value')
      .eq('key', key)
      .single();

    if (data && data.value !== undefined && data.value !== null) {
      localStorage.setItem(key, JSON.stringify(data.value));
      return data.value;
    }
  } catch (err) {
    console.warn(`[Supabase fetch error for ${key}]:`, err);
  }

  try {
    const local = localStorage.getItem(key);
    if (local) return JSON.parse(local);
  } catch (e) {}

  return defaultValue;
};

export const saveCloudStore = async (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}

  try {
    const { error } = await supabase
      .from('ams_app_data')
      .upsert({
        key: key,
        value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn(`[Supabase save warning for ${key}]:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase save exception for ${key}]:`, err);
  }
};
