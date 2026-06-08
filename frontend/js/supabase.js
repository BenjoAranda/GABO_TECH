// =============================================
//  CBBA TECH - Conexión Supabase
//  Cargar este script ANTES que app.js y auth.js
// =============================================

const SUPABASE_URL = "https://grhifhdpefqzmtvtgvwt.supabase.co";
const SUPABASE_KEY = "sb_publishable_WuA7h56vkTZLtt3g_60GOQ_083MOmxu";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
