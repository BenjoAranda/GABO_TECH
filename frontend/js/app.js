// =============================================
//  CBBA TECH - app.js
// =============================================

// ── NAVEGACIÓN SPA ──────────────────────────
const enlaces = document.querySelectorAll(".nav-link");

enlaces.forEach(function (enlace) {
  enlace.addEventListener("click", function (evento) {
    evento.preventDefault();
    const vista = enlace.dataset.view;
    document.querySelectorAll(".view").forEach((s) => s.classList.remove("active"));
    enlaces.forEach((l) => l.classList.remove("active"));
    document.getElementById("view-" + vista).classList.add("active");
    enlace.classList.add("active");
  });
});

// ── PRODUCTOS ───────────────────────────────
const productos = [
  // ACCESORIOS
  { id: 1,  nombre: "Cargadores",            categoria: "accesorios", descripcion: "Cargadores prácticos y eficientes para su celular",                   precio: 80,  imagen: "img/cargadores.png"             },
  { id: 2,  nombre: "Audifonos",             categoria: "accesorios", descripcion: "Audifonos de buena calidad y comodidad",                              precio: 250, imagen: "img/audifonos.png"              },
  { id: 3,  nombre: "Protectores",           categoria: "accesorios", descripcion: "Protectores resistentes, comodos y personalizados a su gusto",         precio: 50,  imagen: "img/protectores.png"            },
  { id: 6,  nombre: "Soporte de celular",    categoria: "accesorios", descripcion: "Soportes prácticos y resistentes para su celular",                     precio: 100, imagen: "img/soporte.png"                },
  { id: 7,  nombre: "Protectores USB",       categoria: "accesorios", descripcion: "Protectores practicos y resistentes para su cargador",                 precio: 50,  imagen: "img/USB.png"                    },
  { id: 8,  nombre: "Fundas Transparentes",  categoria: "accesorios", descripcion: "Fundas ligeras, resistentes y comodidad para su uso diario",           precio: 20,  imagen: "img/fundas.png"                 },
  { id: 9,  nombre: "Mandos de mano",        categoria: "accesorios", descripcion: "Mandos para su comodidad y mayor presicion para sus juegos",           precio: 300, imagen: "img/mando.png"                  },
  { id: 10, nombre: "Audifonos Bluetooh",    categoria: "accesorios", descripcion: "Audifonos inalambricos con sonido claro y conexion estable",           precio: 200, imagen: "img/audifonos_inalambricos.png" },
  { id: 11, nombre: "Cargadores Portatiles", categoria: "accesorios", descripcion: "Cargadores practicos y compactos para tu celular en donde sea",        precio: 80,  imagen: "img/cargadores_portatiles.png"  },
  { id: 12, nombre: "Relojes Inteligentes",  categoria: "accesorios", descripcion: "Relojes para ver notificaciones y monitorear tus actividades diarias", precio: 260, imagen: "img/relojes_inteligentes.png"   },
  // REPUESTOS
  { id: 4,  nombre: "Baterias",                  categoria: "repuestos", descripcion: "Baterias Originales de los modelos Samsung y Apple", precio: 150, imagen: "img/baterias.png"         },
  { id: 5,  nombre: "Pantallas",                 categoria: "repuestos", descripcion: "Pantallas Originales de marca Samsung y Apple",      precio: 150, imagen: "img/pantallas.png"        },
  { id: 13, nombre: "Camaras",                   categoria: "repuestos", descripcion: "Camaras Originales todos los modelos",               precio: 50,  imagen: "img/camaras_repuestos.png"},
  { id: 14, nombre: "Cambio de puerto de carga", categoria: "repuestos", descripcion: "Limpieza o remplazo del puerto de carga",            precio: 30,  imagen: "img/puertos_carga.png"    },
];

// ── ESTADO DE SESIÓN ────────────────────────
let usuarioActual = null;

// ── ESTADO DEL CARRITO ──────────────────────
let carrito = [];

function guardarCarrito() {
  localStorage.setItem("tech_carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem("tech_carrito");
  if (guardado) carrito = JSON.parse(guardado);
}

// ── ACTUALIZAR CONTADOR ─────────────────────
function actualizarContador() {
  const contador = document.getElementById("cart-count");
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contador.textContent = total;
  contador.classList.remove("bump");
  void contador.offsetWidth;
  contador.classList.add("bump");
  setTimeout(() => contador.classList.remove("bump"), 300);
}

// ── RENDER CARD ─────────────────────────────
function crearCardHTML(producto) {
  const bloqueado = !usuarioActual;
  return `
    <div class="product-card ${bloqueado ? "product-locked" : ""}">
      <div class="product-img-wrap">
        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
          class="product-img"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="product-img-placeholder"><span>📦</span></div>
      </div>
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <span class="product-price">Bs. ${producto.precio}</span>
      <div class="product-qty-controls">
        <button class="product-qty-btn" data-id="${producto.id}" data-action="decrease" ${bloqueado ? "disabled" : ""}>−</button>
        <span class="product-qty-value" id="qty-${producto.id}">1</span>
        <button class="product-qty-btn" data-id="${producto.id}" data-action="increase" ${bloqueado ? "disabled" : ""}>+</button>
      </div>
      <button class="btn-add ${bloqueado ? "btn-locked" : ""}" data-id="${producto.id}">
        ${bloqueado ? "🔒 Inicia sesión" : "+ Agregar"}
      </button>
    </div>
  `;
}

// ── RENDER PRODUCTOS POR CATEGORÍA ──────────
function renderizarProductos() {
  const contAccesorios = document.getElementById("container-accesorios");
  const contRepuestos  = document.getElementById("container-repuestos");

  contAccesorios.innerHTML = "";
  contRepuestos.innerHTML  = "";

  productos.forEach(function (producto) {
    if (producto.categoria === "accesorios") {
      contAccesorios.innerHTML += crearCardHTML(producto);
    } else {
      contRepuestos.innerHTML += crearCardHTML(producto);
    }
  });

  // Eventos contador +/−
  document.querySelectorAll(".product-qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id      = parseInt(this.dataset.id);
      const accion  = this.dataset.action;
      const display = document.getElementById("qty-" + id);
      let cantidad  = parseInt(display.textContent);
      if (accion === "increase") {
        cantidad += 1;
      } else if (accion === "decrease" && cantidad > 1) {
        cantidad -= 1;
      }
      display.textContent = cantidad;
    });
  });

  // Eventos botón Agregar
  document.querySelectorAll(".btn-add").forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (!usuarioActual) {
        document.getElementById("btn-open-login").click();
        mostrarAlertaLogin();
        return;
      }
      const id        = parseInt(this.dataset.id);
      const producto  = productos.find((p) => p.id === id);
      const cantidad  = parseInt(document.getElementById("qty-" + id).textContent);
      const existente = carrito.find((p) => p.id === id);
      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ ...producto, cantidad });
      }
      document.getElementById("qty-" + id).textContent = 1;
      guardarCarrito();
      actualizarContador();
      renderizarCarrito();
      this.textContent = "✔ Agregado";
      const btn = this;
      setTimeout(() => { btn.textContent = "+ Agregar"; }, 1000);
    });
  });
}

// ── RENDER CARRITO ──────────────────────────
function renderizarCarrito() {
  const contenedor = document.getElementById("cart-container");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos desde el menú</p>
      </div>
    `;
    return;
  }

  carrito.forEach(function (producto) {
    contenedor.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${producto.nombre}</p>
          <p class="cart-item-price">Bs. ${producto.precio} c/u</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="decrease" data-id="${producto.id}">−</button>
          <span class="qty-value">${producto.cantidad}</span>
          <button class="qty-btn" data-action="increase" data-id="${producto.id}">+</button>
        </div>
        <div class="cart-item-total">
          Bs. ${(producto.precio * producto.cantidad).toFixed(2)}
        </div>
      </div>
    `;
  });

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  contenedor.innerHTML += `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>Bs. ${total.toFixed(2)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Envío</span>
        <span>Gratis 🎉</span>
      </div>
      <div class="cart-total-row">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-amount">Bs. ${total.toFixed(2)}</span>
      </div>
      <button class="btn-checkout" onclick="confirmarPedido()">
        🛍️ Confirmar Pedido
      </button>
    </div>
  `;

  contenedor.querySelectorAll(".qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id     = parseInt(this.dataset.id);
      const accion = this.dataset.action;
      const item   = carrito.find((p) => p.id === id);
      if (!item) return;
      if (accion === "increase") {
        item.cantidad += 1;
      } else if (accion === "decrease") {
        item.cantidad -= 1;
        if (item.cantidad <= 0) carrito = carrito.filter((p) => p.id !== id);
      }
      guardarCarrito();
      actualizarContador();
      renderizarCarrito();
    });
  });
}

// ── CONFIRMAR PEDIDO ─────────────────────────
async function confirmarPedido() {
  const { data: { user } } = await db.auth.getUser();

  if (!user) {
    alert("Debes iniciar sesión para confirmar tu pedido.");
    document.getElementById("btn-open-login").click();
    return;
  }
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const { data: pedido, error: e1 } = await db
    .from("orders")
    .insert({ user_id: user.id, total: parseFloat(total.toFixed(2)), estado: "pending" })
    .select()
    .single();

  if (e1) { alert("Error al crear el pedido: " + e1.message); return; }

  const items = carrito.map((item) => ({
    order_id:    pedido.id,
    product_id:  item.id,
    cantidad:    item.cantidad,
    precio_unit: item.precio,
  }));

  const { error: e2 } = await db.from("order_items").insert(items);
  if (e2) { alert("Error al guardar los items: " + e2.message); return; }

  // Armar mensaje de WhatsApp con el resumen del pedido
  const nombreUsuario = usuarioActual ? (usuarioActual.nombre || usuarioActual.email) : "Cliente";
  const lineasProductos = items.map((item) => {
    const producto = productos.find((p) => p.id === item.product_id);
    const nombre   = producto ? producto.nombre : "Producto";
    return `• ${nombre} x${item.cantidad} — Bs. ${(item.precio_unit * item.cantidad).toFixed(2)}`;
  }).join("\n");

  const mensajeWA =
    `🛍️ *NUEVO PEDIDO #${pedido.id}*\n\n` +
    `👤 *Cliente:* ${nombreUsuario}\n\n` +
    `📦 *Productos:*\n${lineasProductos}\n\n` +
    `💰 *Total: Bs. ${total.toFixed(2)}*\n\n` +
    `Por favor, confirmar disponibilidad. ¡Gracias!`;

  carrito = [];
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
  alert("¡Pedido #" + pedido.id + " confirmado! Gracias por tu compra 🎉\nSe abrirá WhatsApp para enviar el resumen.");

  const urlWA = `https://wa.me/59169525932?text=${encodeURIComponent(mensajeWA)}`;
  window.open(urlWA, "_blank");
}

// ── FORMULARIO DE CONTACTO ──────────────────
function inicializarFormularioContacto() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Bloquear si no hay sesión
    if (!usuarioActual) {
      document.getElementById("btn-open-login").click();
      mostrarAlertaContacto();
      return;
    }

    const nombre  = document.getElementById("contact-name");
    const email   = document.getElementById("contact-email");
    const mensaje = document.getElementById("contact-message");

    const errorNombre  = document.getElementById("error-name");
    const errorEmail   = document.getElementById("error-email");
    const errorMensaje = document.getElementById("error-message");
    const exito        = document.getElementById("form-success");

    [errorNombre, errorEmail, errorMensaje].forEach((el) => (el.textContent = ""));
    [nombre, email, mensaje].forEach((el) => el.classList.remove("input-error"));
    exito.textContent = "";

    let valido = true;

    if (!nombre.value.trim()) {
      errorNombre.textContent = "El nombre es obligatorio";
      nombre.classList.add("input-error");
      valido = false;
    }
    if (!email.value.trim()) {
      errorEmail.textContent = "El email es obligatorio";
      email.classList.add("input-error");
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errorEmail.textContent = "El email no es válido";
      email.classList.add("input-error");
      valido = false;
    }
    if (!mensaje.value.trim()) {
      errorMensaje.textContent = "El mensaje es obligatorio";
      mensaje.classList.add("input-error");
      valido = false;
    }

    if (!valido) return;

    // Armar mensaje y abrir WhatsApp
    const texto = `Hola! Te escribo desde la página web 👋\n\n` +
      `*Nombre:* ${nombre.value.trim()}\n` +
      `*Email:* ${email.value.trim()}\n\n` +
      `*Mensaje:*\n${mensaje.value.trim()}`;

    const url = `https://wa.me/59169525932?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");

    exito.textContent = "✔ Redirigiendo a WhatsApp...";
    form.reset();
  });
}

// ── AUTENTICACIÓN - MODALES ──────────────────
function inicializarAuth() {
  const modalLogin    = document.getElementById("modal-login");
  const modalRegister = document.getElementById("modal-register");

  document.getElementById("btn-open-login").addEventListener("click", () => modalLogin.classList.add("open"));
  document.getElementById("btn-open-register").addEventListener("click", () => modalRegister.classList.add("open"));
  document.getElementById("close-login").addEventListener("click", () => modalLogin.classList.remove("open"));
  document.getElementById("close-register").addEventListener("click", () => modalRegister.classList.remove("open"));

  [modalLogin, modalRegister].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  });

  document.getElementById("switch-to-register").addEventListener("click", (e) => {
    e.preventDefault();
    modalLogin.classList.remove("open");
    modalRegister.classList.add("open");
  });
  document.getElementById("switch-to-login").addEventListener("click", (e) => {
    e.preventDefault();
    modalRegister.classList.remove("open");
    modalLogin.classList.add("open");
  });

  // Login
  document.getElementById("form-login").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email    = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    const msgEmail = document.getElementById("error-login-email");
    const msgPass  = document.getElementById("error-login-password");
    const msgOk    = document.getElementById("login-success");

    msgEmail.textContent = msgPass.textContent = msgOk.textContent = "";

    let valido = true;
    if (!email.value.trim())    { msgEmail.textContent = "Email obligatorio";      valido = false; }
    if (!password.value.trim()) { msgPass.textContent  = "Contraseña obligatoria"; valido = false; }
    if (!valido) return;

    const res = await iniciarSesion(email.value.trim(), password.value.trim());
    if (!res.ok) { msgEmail.textContent = res.error; return; }

    msgOk.textContent = "✔ Bienvenido, " + (res.nombre || "usuario");
    actualizarNavbar(res);
    setTimeout(() => modalLogin.classList.remove("open"), 1200);
    this.reset();
  });

  // Registro
  document.getElementById("form-register").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nombre   = document.getElementById("register-name");
    const email    = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const msgNombre = document.getElementById("error-register-name");
    const msgEmail  = document.getElementById("error-register-email");
    const msgPass   = document.getElementById("error-register-password");
    const msgOk     = document.getElementById("register-success");

    [msgNombre, msgEmail, msgPass].forEach((el) => (el.textContent = ""));
    msgOk.textContent = "";

    let valido = true;
    if (!nombre.value.trim())   { msgNombre.textContent = "Nombre obligatorio";     valido = false; }
    if (!email.value.trim())    { msgEmail.textContent  = "Email obligatorio";      valido = false; }
    if (!password.value.trim()) { msgPass.textContent   = "Contraseña obligatoria"; valido = false; }
    if (!valido) return;

    const res = await registrarUsuario(nombre.value.trim(), email.value.trim(), password.value.trim());
    if (!res.ok) { msgEmail.textContent = res.error; return; }

    msgOk.textContent = "✔ Cuenta creada. Revisa tu email para confirmar.";
    this.reset();
  });

  // Logout
  document.getElementById("btn-logout").addEventListener("click", async () => {
    await cerrarSesion();
  });

  // Sesión activa al cargar
  obtenerUsuarioActual().then((usuario) => {
    if (usuario) actualizarNavbar(usuario);
  });
}

// ── NAVEGAR A CATEGORÍA ──────────────────────
function irACategoria(categoria) {
  document.querySelectorAll(".view").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
  document.getElementById("view-menu").classList.add("active");
  document.querySelector(".nav-link[data-view='menu']").classList.add("active");

  const destino = categoria === "repuestos"
    ? document.getElementById("container-repuestos")
    : document.getElementById("container-accesorios");

  if (destino) {
    setTimeout(() =>
      destino.closest(".categoria-section").scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }
}

// ── ALERTA INICIAR SESIÓN ────────────────────
function mostrarAlertaLogin() {
  const previa = document.getElementById("alerta-login");
  if (previa) previa.remove();

  const alerta = document.createElement("div");
  alerta.id = "alerta-login";
  alerta.className = "alerta-login";
  alerta.innerHTML = `
    <span>⚠️ Debes iniciar sesión para agregar productos al carrito.</span>
    <button onclick="document.getElementById('alerta-login').remove()">✕</button>
  `;
  document.querySelector("#view-menu").prepend(alerta);
  setTimeout(() => { if (alerta.parentNode) alerta.remove(); }, 3500);
}

// ── ACTUALIZAR NAVBAR ────────────────────────
function actualizarNavbar(usuario) {
  const navAuth     = document.getElementById("nav-auth");
  const navUser     = document.getElementById("nav-user");
  const navUsername = document.getElementById("nav-username");

  if (usuario) {
    usuarioActual = usuario;
    navAuth.style.display = "none";
    navUser.style.display = "flex";
    navUsername.textContent = "▶ " + (usuario.nombre || usuario.email);
    renderizarProductos();
    inicializarLinksContacto();
  } else {
    usuarioActual = null;
    navAuth.style.display = "flex";
    navUser.style.display = "none";
    renderizarProductos();
    inicializarLinksContacto();
  }
}

// ── BLOQUEO LINKS DE CONTACTO ───────────────
function inicializarLinksContacto() {
  const links = [
    document.getElementById("link-maps"),
    document.getElementById("link-whatsapp"),
  ];

  links.forEach(function (link) {
    if (!link) return;
    link.addEventListener("click", function (e) {
      if (!usuarioActual) {
        e.preventDefault();
        document.getElementById("btn-open-login").click();
        mostrarAlertaContacto();
      }
    });
  });
}

function mostrarAlertaContacto() {
  const previa = document.getElementById("alerta-contacto");
  if (previa) previa.remove();

  const alerta = document.createElement("div");
  alerta.id = "alerta-contacto";
  alerta.className = "alerta-login";
  alerta.innerHTML = `
    <span>⚠️ Debes iniciar sesión para acceder a esta información.</span>
    <button onclick="document.getElementById('alerta-contacto').remove()">✕</button>
  `;
  document.querySelector("#view-contact").prepend(alerta);
  setTimeout(() => { if (alerta.parentNode) alerta.remove(); }, 3500);
}

// ── INIT ────────────────────────────────────
cargarCarrito();
renderizarProductos();
renderizarCarrito();
actualizarContador();
inicializarFormularioContacto();
inicializarLinksContacto();
inicializarAuth();
