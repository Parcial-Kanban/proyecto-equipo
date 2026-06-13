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
