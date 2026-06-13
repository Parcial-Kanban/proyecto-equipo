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

    const item = document.createElement("li");
    item.textContent = `${producto} - ${precio}`;
    carrito.appendChild(item);
  });
});

cambiarFormulario("registro");
