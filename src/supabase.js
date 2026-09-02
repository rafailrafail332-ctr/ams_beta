// AMS Database Connection - 100% MySQL Database (Hosting cPanel amsprope_amsdb)

const MYSQL_API_URL = typeof window !== 'undefined' && window.location.origin.includes('amsproperti.online')
  ? `${window.location.origin}/app_api.php`
  : 'http://amsproperti.online/app_api.php';

// Supabase client instance (kept as placeholder for authentication token compatibility if needed)
export const supabase = {
  from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) })
};

/**
 * 100% MySQL Database Sync:
 * - Reads directly from MySQL Database on Hosting
 * - Saves directly to MySQL Database on Hosting
 */
export const fetchCloudStore = async (key, defaultValue) => {
  // Read local first
  let localValue = null;
  try {
    const local = localStorage.getItem(key);
    if (local) localValue = JSON.parse(local);
  } catch (e) {}

  // 1. Fetch from MySQL Database on Sengked Hosting
  try {
    const res = await fetch(`${MYSQL_API_URL}?action=get&key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.value !== undefined && json.value !== null) {
        if (!Array.isArray(json.value) || json.value.length > 0 || !localValue || (Array.isArray(localValue) && localValue.length === 0)) {
          localStorage.setItem(key, JSON.stringify(json.value));
          return json.value;
        }
      }
    }
  } catch (err) {
    console.warn(`[MySQL Fetch Error for ${key}]:`, err);
  }

  // 2. Fallback to LocalStorage
  if (localValue !== null && localValue !== undefined) {
    saveCloudStore(key, localValue);
    return localValue;
  }

  return defaultValue;
};

export const saveCloudStore = async (key, value) => {
  // 1. Fast local cache
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}

  // 2. Save directly to MySQL Database on Hosting
  try {
    return await fetch(MYSQL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
  } catch (err) {
    console.error(`[MySQL Save Error for ${key}]:`, err);
  }
};

