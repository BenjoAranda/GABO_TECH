// =============================================
//  CBBA TECH - app.js
// =============================================

// ── NAVEGACIÓN SPA ──────────────────────────
const enlaces = document.querySelectorAll(".nav-link");

enlaces.forEach(function (enlace) {
  enlace.addEventListener("click", function (evento) {
    evento.preventDefault();

    const vista = enlace.dataset.view;

    document.querySelectorAll(".view").forEach(function (seccion) {
      seccion.classList.remove("active");
    });

    enlaces.forEach(function (link) {
      link.classList.remove("active");
    });

    document.getElementById("view-" + vista).classList.add("active");
    enlace.classList.add("active");
  });
});

// ── PRODUCTOS ───────────────────────────────
const productos = [
  {
    id: 1,
    nombre: "Cargadores",
    descripcion: "Cargadores de tipo B y C",
    precio: 80,
    imagen: "img/cargadores.png",
  },
  {
    id: 2,
    nombre: "Audifonos",
    descripcion: "Audifonos de cable como de bluetooth",
    precio: 250,
    imagen: "img/audifonos.png",
  },
  {
    id: 3,
    nombre: "Protectores",
    descripcion: "Protectores definidos y a su personalizacion",
    precio: 50,
    imagen: "img/protectores.png",
  },
  {
    id: 4,
    nombre: "Baterias",
    descripcion: "Baterias Originales de los modelos Samsung y Apple",
    precio: 150,
    imagen: "img/baterias.png",
  },
  {
    id: 5,
    nombre: "Pantallas",
    descripcion: "Pantallas Originales de marca Samsung y Apple",
    precio: 150,
    imagen: "img/pantallas.png",
  },
  {
    id: 6,
    nombre: "Soporte de celular",
    descripcion: "Soportes de cualquier tamaño para su celular",
    precio: 100,
    imagen: "img/soporte.png",
  },
  {
    id: 7,
    nombre: "Protectores USB",
    descripcion: "Protectores personalizados a su gusto",
    precio: 50,
    imagen: "img/USB.png",
  },
  {
    id: 8,
    nombre: "Fundas Transparentes",
    descripcion: "Fundas para celulares Samsung y Apple",
    precio: 70,
    imagen: "img/fundas.png",
  },
  {
    id: 9,
    nombre: "Mandos de mano",
    descripcion: "Mandos adaptables a celulares Samsung y Apple",
    precio: 300,
    imagen: "img/mando.png",
  },
];

// ── ESTADO DEL CARRITO ──────────────────────
let carrito = [];

function guardarCarrito() {
  localStorage.setItem("tech_carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("tech_carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
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

// ── RENDER PRODUCTOS ────────────────────────
function renderizarProductos() {
  const contenedor = document.getElementById("products-container");
  contenedor.innerHTML = "";

  productos.forEach(function (producto) {
    contenedor.innerHTML += `
      <div class="product-card">
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
          <button class="product-qty-btn" data-id="${producto.id}" data-action="decrease">−</button>
          <span class="product-qty-value" id="qty-${producto.id}">1</span>
          <button class="product-qty-btn" data-id="${producto.id}" data-action="increase">+</button>
        </div>

        <button class="btn-add" data-id="${producto.id}">+ Agregar</button>
      </div>
    `;
  });

  // Eventos contador +/−
  document.querySelectorAll(".product-qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      const accion = this.dataset.action;
      const display = document.getElementById("qty-" + id);
      let cantidad = parseInt(display.textContent);

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
      const id = parseInt(this.dataset.id);
      const producto = productos.find((p) => p.id === id);
      const cantidad = parseInt(
        document.getElementById("qty-" + id).textContent,
      );
      const existente = carrito.find((p) => p.id === id);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({ ...producto, cantidad });
      }

      // Resetear contador a 1
      document.getElementById("qty-" + id).textContent = 1;

      guardarCarrito();
      actualizarContador();
      renderizarCarrito();

      this.textContent = "✔ Agregado";
      const btn = this;
      setTimeout(() => {
        btn.textContent = "+ Agregar";
      }, 1000);
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
      <button class="btn-checkout" onclick="alert('¡Pedido confirmado! Gracias por tu compra 🎉')">
        🛍️ Confirmar Pedido
      </button>
    </div>
  `;

  contenedor.querySelectorAll(".qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      const accion = this.dataset.action;
      const item = carrito.find((p) => p.id === id);

      if (!item) return;

      if (accion === "increase") {
        item.cantidad += 1;
      } else if (accion === "decrease") {
        item.cantidad -= 1;
        if (item.cantidad <= 0) {
          carrito = carrito.filter((p) => p.id !== id);
        }
      }

      guardarCarrito();
      actualizarContador();
      renderizarCarrito();
    });
  });
}

// ── FORMULARIO DE CONTACTO ──────────────────
function inicializarFormularioContacto() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const mensaje = document.getElementById("contact-message");

    const errorNombre = document.getElementById("error-name");
    const errorEmail = document.getElementById("error-email");
    const errorMensaje = document.getElementById("error-message");
    const exito = document.getElementById("form-success");

    [errorNombre, errorEmail, errorMensaje].forEach(
      (el) => (el.textContent = ""),
    );
    [nombre, email, mensaje].forEach((el) =>
      el.classList.remove("input-error"),
    );
    exito.textContent = "";

    let valido = true;

    if (nombre.value.trim() === "") {
      errorNombre.textContent = "El nombre es obligatorio";
      nombre.classList.add("input-error");
      valido = false;
    }

    if (email.value.trim() === "") {
      errorEmail.textContent = "El email es obligatorio";
      email.classList.add("input-error");
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      errorEmail.textContent = "El email no es válido";
      email.classList.add("input-error");
      valido = false;
    }

    if (mensaje.value.trim() === "") {
      errorMensaje.textContent = "El mensaje es obligatorio";
      mensaje.classList.add("input-error");
      valido = false;
    }

    if (!valido) return;

    exito.textContent = "✔ Mensaje enviado correctamente";
    form.reset();
  });
}
//js.app.js
async function confirmarPedido() {
  //1. Verificar sesion activa
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) {
    mostrarMensaje("Debes iniciar sesion primero", "error");
    navegarA("login");
    return;
  }
  if (carrito.length === 0) {
    mostrarMensaje("El carrito esta vacio", "error");
    return;
  }

  //2. Calcular total
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  //3. Insertar en orders
  const { data: pedido, error: el } = await db
    .from("orders")
    .insert({
      user_id: user.id,
      total: parseFloat(total.toFixed(2)),
      estado: "pending",
    })
    .select()
    .single();
  if (el) {
    mostrarMensaje(el.message, "error");
  }
  //4. Insertar Items
  const items = carrito.map((item) => ({
    order_id: pedido.id,
    product_id: item.id,
    cantidad: item.cantidad,
    precio_unit: item.precio,
  }));
  const { error: e2 } = await db.from("order_items").insert(items);
  if (e2) {
    mostrarMensaje(e2.message, "error");
    return;
  }
  //5.Limpiar carrito y confirmar
  carrito = [];
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
  mostrarMensaje("Pedido #" + pedido.id + " confirmado!", "exito");
}

// ── AUTENTICACIÓN - MODALES ──────────────────
function inicializarAuth() {
  const modalLogin    = document.getElementById("modal-login");
  const modalRegister = document.getElementById("modal-register");

  // Abrir modales
  document.getElementById("btn-open-login").addEventListener("click", () => {
    modalLogin.classList.add("open");
  });
  document.getElementById("btn-open-register").addEventListener("click", () => {
    modalRegister.classList.add("open");
  });

  // Cerrar modales
  document.getElementById("close-login").addEventListener("click", () => {
    modalLogin.classList.remove("open");
  });
  document.getElementById("close-register").addEventListener("click", () => {
    modalRegister.classList.remove("open");
  });

  // Cerrar al hacer clic fuera
  [modalLogin, modalRegister].forEach(modal => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.classList.remove("open");
    });
  });

  // Cambiar entre modales
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

  // ── SUBMIT LOGIN ──
  document.getElementById("form-login").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email    = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    const msgEmail = document.getElementById("error-login-email");
    const msgPass  = document.getElementById("error-login-password");
    const msgOk    = document.getElementById("login-success");

    msgEmail.textContent = "";
    msgPass.textContent  = "";
    msgOk.textContent    = "";

    let valido = true;
    if (!email.value.trim()) {
      msgEmail.textContent = "Email obligatorio";
      valido = false;
    }
    if (!password.value.trim()) {
      msgPass.textContent = "Contraseña obligatoria";
      valido = false;
    }
    if (!valido) return;

    const resultado = await iniciarSesion(email.value.trim(), password.value.trim());

    if (!resultado.ok) {
      msgEmail.textContent = resultado.error;
      return;
    }

    msgOk.textContent = "✔ Bienvenido, " + (resultado.nombre || "usuario");
    actualizarNavbar(resultado);
    setTimeout(() => modalLogin.classList.remove("open"), 1200);
    this.reset();
  });

  // ── SUBMIT REGISTRO ──
  document.getElementById("form-register").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre   = document.getElementById("register-name");
    const email    = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const msgNombre = document.getElementById("error-register-name");
    const msgEmail  = document.getElementById("error-register-email");
    const msgPass   = document.getElementById("error-register-password");
    const msgOk     = document.getElementById("register-success");

    [msgNombre, msgEmail, msgPass].forEach(el => el.textContent = "");
    msgOk.textContent = "";

    let valido = true;
    if (!nombre.value.trim())   { msgNombre.textContent = "Nombre obligatorio";     valido = false; }
    if (!email.value.trim())    { msgEmail.textContent  = "Email obligatorio";      valido = false; }
    if (!password.value.trim()) { msgPass.textContent   = "Contraseña obligatoria"; valido = false; }
    if (!valido) return;

    const resultado = await registrarUsuario(
      nombre.value.trim(),
      email.value.trim(),
      password.value.trim()
    );

    if (!resultado.ok) {
      msgEmail.textContent = resultado.error;
      return;
    }

    msgOk.textContent = "✔ Cuenta creada. Revisa tu email para confirmar.";
    this.reset();
  });

  // ── LOGOUT ──
  document.getElementById("btn-logout").addEventListener("click", async () => {
    await cerrarSesion();
  });

  // Verificar si ya hay sesión activa al cargar
  obtenerUsuarioActual().then(usuario => {
    if (usuario) actualizarNavbar(usuario);
  });
}

// ── ACTUALIZAR NAVBAR SEGÚN SESIÓN ──────────
function actualizarNavbar(usuario) {
  const navAuth = document.getElementById("nav-auth");
  const navUser = document.getElementById("nav-user");
  const navUsername = document.getElementById("nav-username");

  if (usuario) {
    navAuth.style.display = "none";
    navUser.style.display = "flex";
    navUsername.textContent = "▶ " + (usuario.nombre || usuario.email);
  } else {
    navAuth.style.display = "flex";
    navUser.style.display = "none";
  }
}

// ── INIT ────────────────────────────────────
cargarCarrito();
renderizarProductos();
renderizarCarrito();
actualizarContador();
inicializarFormularioContacto();
inicializarAuth();
