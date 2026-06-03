// supabase-client.js
//Inicializar la conexion con el proyecto

const SUPABASE_URL = `https://grhifhdpefqzmtvtgvwt.supabase.co`;
const SUPABASE_ANON = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaGlmaGRwZWZxem10dnRndnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTU3MDMsImV4cCI6MjA5MjYzMTcwM30.Ze2mKZTwg3c9YRIx_ykazB34Y2UDcUkmPVOwZ6cysN4`;

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

//`db` es el objetivo que usaremospara todas las consultas
