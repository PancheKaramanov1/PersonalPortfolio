import dotenv from 'dotenv';

dotenv.config();

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

export function loadConfig() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn(
      `[config] Missing env: ${missing.join(', ')} — API will return errors until set.`
    );
  }
  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  };
}
