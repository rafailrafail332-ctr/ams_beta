// AMS Database Connection - 100% Murni MySQL Database (Terpusat di Hostinger Server)
// Tanpa ketergantungan pada localStorage

const MYSQL_API_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/app_api.php`
  : '/app_api.php';

// Supabase client instance (kept as placeholder for authentication token compatibility if needed)
export const supabase = {
  from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) })
};

/**
 * 100% Pure MySQL Database Sync:
 * - Reads directly from MySQL Database on Hostinger (Single Source of Truth)
 * - Zero localStorage usage
 */
export const fetchCloudStore = async (key, defaultValue) => {
  try {
    const res = await fetch(`${MYSQL_API_URL}?action=get&key=${encodeURIComponent(key)}&_t=${Date.now()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.value !== undefined && json.value !== null) {
        return json.value;
      }
    }
  } catch (err) {
    console.warn(`[MySQL Fetch Error for ${key}]:`, err);
  }

  return defaultValue;
};

/**
 * 100% Pure MySQL Database Save:
 * - Saves directly to MySQL Database on Hostinger
 * - Zero localStorage usage
 */
export const saveCloudStore = async (key, value) => {
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
