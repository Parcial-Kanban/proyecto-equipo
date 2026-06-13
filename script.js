const botones = document.querySelectorAll(".producto button");
const carrito = document.getElementById("carrito");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const authMessage = document.getElementById("authMessage");
const btnRegistro = document.getElementById("btnRegistro");
const btnLogin = document.getElementById("btnLogin");

const STORAGE_KEY = "usuarios-app";

function showMessage(text, type = "info") {
  authMessage.textContent = text;
  authMessage.className = `auth-message ${type}`;
}

function getUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("No se pudieron leer los usuarios guardados", error);
    return [];
  }
}

function guardarUsuario(usuario) {
  const usuarios = getUsuarios();
  usuarios.push(usuario);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

function validarEmail(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarCampos(form, campos) {
  const faltantes = campos.filter((campo) => !form[campo].value.trim());

  if (faltantes.length > 0) {
    showMessage("Completa todos los campos obligatorios.", "error");
    return false;
  }

  if (form.correo && !validarEmail(form.correo.value.trim())) {
    showMessage("Ingresa un correo electrónico válido.", "error");
    return false;
  }

  if (form.password && form.password.value.trim().length < 6) {
    showMessage("La contraseña debe tener al menos 6 caracteres.", "error");
    return false;
  }

  return true;
}

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validarCampos(registerForm, ["nombre", "correo", "password"])) return;

  const usuarios = getUsuarios();
  const correo = registerForm.correo.value.trim().toLowerCase();

  if (usuarios.some((usuario) => usuario.correo === correo)) {
    showMessage("Este correo ya está registrado.", "error");
    return;
  }

  guardarUsuario({
    nombre: registerForm.nombre.value.trim(),
    correo,
    password: registerForm.password.value.trim()
  });

  registerForm.reset();
  showMessage("Registro completado con éxito. Ahora puedes iniciar sesión.", "success");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validarCampos(loginForm, ["correo", "password"])) return;

  const usuarios = getUsuarios();
  const correo = loginForm.correo.value.trim().toLowerCase();
  const password = loginForm.password.value.trim();

  const usuario = usuarios.find((item) => item.correo === correo && item.password === password);

  if (!usuario) {
    showMessage("Correo o contraseña incorrectos.", "error");
    return;
  }

  showMessage(`Bienvenido, ${usuario.nombre}. Has iniciado sesión correctamente.`, "success");
  loginForm.reset();
});

function cambiarFormulario(activo) {
  btnRegistro.classList.toggle("active", activo === "registro");
  btnLogin.classList.toggle("active", activo === "login");
  registerForm.classList.toggle("active-form", activo === "registro");
  loginForm.classList.toggle("active-form", activo === "login");
  showMessage("", "info");
}

btnRegistro.addEventListener("click", () => cambiarFormulario("registro"));
btnLogin.addEventListener("click", () => cambiarFormulario("login"));

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const producto = boton.parentElement.querySelector("h2").textContent;
    const precio = boton.parentElement.querySelector(".precio").textContent;
const productos = [
  {
    id: 1,
    nombre: "Producto 1",
    descripcion: "Camiseta ligera con diseño moderno, perfecta para el día a día y para combinar con cualquier estilo.",
    precio: 20000,
    tallas: ["S", "M", "L", "XL"],
    imagen: "img/producto1.svg"
  },
  {
    id: 2,
    nombre: "Producto 2",
    descripcion: "Prenda urbana con corte cómodo y detalles versátiles, ideal para looks casuales y creativos.",
    precio: 35000,
    tallas: ["M", "L", "XL"],
    imagen: "img/producto2.svg"
  }
];

const catalogo = document.getElementById("catalogo");
const carrito = document.getElementById("carrito");
const detalleImagen = document.getElementById("detalleImagen");
const detalleTitulo = document.getElementById("detalleTitulo");
const detalleDescripcion = document.getElementById("detalleDescripcion");
const detallePrecio = document.getElementById("detallePrecio");
const detalleTalla = document.getElementById("detalleTalla");
const btnAgregarDetalle = document.getElementById("btnAgregarDetalle");

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function renderCatalogo() {
  catalogo.innerHTML = productos
    .map((producto) => `
      <article class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p>${producto.descripcion}</p>
        <span class="precio">${formatoMoneda.format(producto.precio)}</span>
        <div class="producto-actions">
          <button class="btn btn-primary btn-detalle" data-id="${producto.id}" type="button">Ver detalle</button>
          <button class="btn btn-secondary btn-agregar" data-id="${producto.id}" type="button">Añadir al carrito</button>
        </div>
      </article>
    `)
    .join("");
}

function mostrarDetalle(id) {
  const producto = productos.find((item) => item.id === Number(id));

  if (!producto) return;

  detalleImagen.src = producto.imagen;
  detalleImagen.alt = producto.nombre;
  detalleTitulo.textContent = producto.nombre;
  detalleDescripcion.textContent = producto.descripcion;
  detallePrecio.textContent = formatoMoneda.format(producto.precio);

  detalleTalla.innerHTML = producto.tallas
    .map((talla) => `<option value="${talla}">${talla}</option>`)
    .join("");

  btnAgregarDetalle.dataset.id = producto.id;
}

function agregarAlCarrito(id, talla = "S") {
  const producto = productos.find((item) => item.id === Number(id));

  if (!producto) return;

  const item = document.createElement("li");
  item.textContent = `${producto.nombre} - Talla ${talla} - ${formatoMoneda.format(producto.precio)}`;
  carrito.appendChild(item);
}

renderCatalogo();
mostrarDetalle(productos[0].id);

catalogo.addEventListener("click", (event) => {
  const botonDetalle = event.target.closest(".btn-detalle");
  const botonAgregar = event.target.closest(".btn-agregar");

  if (botonDetalle) {
    mostrarDetalle(botonDetalle.dataset.id);
    document.querySelector(".detalle-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (botonAgregar) {
    agregarAlCarrito(botonAgregar.dataset.id, "M");
  }
});

btnAgregarDetalle.addEventListener("click", () => {
  agregarAlCarrito(btnAgregarDetalle.dataset.id, detalleTalla.value);
});

cambiarFormulario("registro");
