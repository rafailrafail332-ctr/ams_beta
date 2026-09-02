import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hifgomkrcwldlolrowql.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZmdvbWtyY3dsZGxvbHJvd3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMzc3MTksImV4cCI6MjEwMzcxMzcxOX0.zDAate-ddmcVE_FVetFGlbupicLzNFL2CEZOOIfBArY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MYSQL_API_URL = typeof window !== 'undefined' && window.location.origin.includes('amsproperti.online')
  ? `${window.location.origin}/app_api.php`
  : 'http://amsproperti.online/app_api.php';

/**
 * Universal sync helper (Supports cPanel MySQL Database + Supabase Cloud Backup):
 * Loads JSON key from MySQL or Supabase (fallback to localStorage or defaultValue),
 * Saves JSON key to MySQL Database, Supabase, and localStorage simultaneously.
 */
export const fetchCloudStore = async (key, defaultValue) => {
  // 1. Try MySQL Database on Hosting first
  try {
    const res = await fetch(`${MYSQL_API_URL}?action=get&key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.value !== undefined && json.value !== null) {
        localStorage.setItem(key, JSON.stringify(json.value));
        return json.value;
      }
    }
  } catch (err) {
    // Fallback to Supabase
  }

  // 2. Fallback to Supabase Cloud
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
    console.warn(`[Fetch error for ${key}]:`, err);
  }

  // 3. Fallback to LocalStorage
  try {
    const local = localStorage.getItem(key);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed !== undefined && parsed !== null) {
        // Auto-seed to MySQL backend if missing on server
        saveCloudStore(key, parsed);
        return parsed;
      }
    }
  } catch (e) {}

  return defaultValue;
};

export const saveCloudStore = async (key, value) => {
  // 1. Save to LocalStorage immediately
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}

  // 2. Save directly to cPanel MySQL Database
  try {
    fetch(MYSQL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }).catch(() => {});
  } catch (err) {}

  // 3. Sync simultaneously to Supabase Cloud Backup
  try {
    supabase
      .from('ams_app_data')
      .upsert({
        key: key,
        value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })
      .then(() => {})
      .catch(() => {});
  } catch (err) {}
};
