// ── REGISTRO ────────────────────────────────
async function registrarUsuario(nombre, email, password) {
  // 1. Crear el usuario en Supabase Auth
  const { data, error } = await db.auth.signUp({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }

  //2. Crear el perfil en la tabla profiles
  const { error: perfilError } = await db.from("profiles").insert({
    id: data.user.id, //mismo id que auth.users
    nombre: nombre,
    email: email,
    rol: "cliente", //rol por defecto
  });

  if (perfilError) {
    return { ok: false, error: perfilError.message };
  }
  return { ok: true, usuario: data.user };
}

// ── LOGIN ───────────────────────────────────
async function iniciarSesion(email, password) {
  const { data, error } = await db.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  // Obtener el perfil para saber el rol
  const { data: perfil } = await db
    .from("profiles")
    .select("nombre, rol")
    .eq("id", data.user.id)
    .single();
  return {
    ok: true,
    usuario: data.user,
    nombre: perfil?.nombre,
    rol: perfil?.rol,
  };
}
// ── LOGOUT ──────────────────────────────────
async function cerrarSesion() {
  await db.auth.signOut();
  actualizarNavbar(null);
}
// ── OBTENER USUARIO ACTUAL ───────────────────
async function obtenerUsuarioActual() {
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await db
    .from("profiles")
    .select("nombre, rol")
    .eq("id", user.id)
    .single();
  return { ...user, nombre: perfil?.nombre, rol: perfil?.rol };
}
