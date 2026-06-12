// Selecciona todos los botones de los productos
const botones = document.querySelectorAll(".producto button");
const carrito = document.getElementById("carrito");

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    const producto = boton.parentElement.querySelector("h2").textContent;
    const precio = boton.parentElement.querySelector(".precio").textContent;

    const item = document.createElement("li");
    item.textContent = `${producto} - ${precio}`;
    carrito.appendChild(item);
  });
});
