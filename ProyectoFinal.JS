// Productos guardados en Arrays y Json
const carritoClave = "Carrito"

let listaDePrecios = [];

const lista = document.querySelector(`#listado`);

fetch(`./listaDePrecios.json`)
  .then(res => res.json())
  .then(data => {
    listaDePrecios = data
    console.log(data)
    dibujarCarritoSacar();
    dibujarProductos();
    dibujarCarrito();
  }
  )

const carrito = JSON.parse(localStorage.getItem(carritoClave)) || [];

//Las funciones modifican el DOM dibujando los productos

function dibujarProductos() {
  listaDePrecios.forEach(producto => {

    let listaDeProductos = document.createElement("div");
    listaDeProductos.className = "listaDeProducto"
    listaDeProductos.innerHTML = producto.producto + " a $" + producto.precio;

    let botonAgregar = document.createElement("button");
    botonAgregar.className = "botonAgregar"
    botonAgregar.innerHTML = " + "
    botonAgregar.addEventListener("click", function () {
      agregarCarrito(producto)
      dibujarCarrito()
    }
    )
    listaDeProductos.append(botonAgregar);

    let botonQuitar = document.createElement("button");
    botonQuitar.className = "botonQuitar"
    botonQuitar.innerHTML = " - "
    botonQuitar.addEventListener("click", function () {
      quitarCarrito(producto);
      dibujarCarritoSacar();
    }
    )
    listaDeProductos.append(botonQuitar);
    document.body.append(listaDeProductos);
  }
  )
}

// Las funciones buscan los productos y modifican el carrito y el precio

function calcularPrecioCarrito() {
  let precioTotal = 0
  for (idProducto of carrito) {

    let producto = listaDePrecios.find(producto => producto.id === idProducto);
    if (producto) {
      precioTotal += producto.precio
    }
  }
  return precioTotal
}

function precioCarrito() {

  let precioTotal = calcularPrecioCarrito()

  let mostrarCarrito = document.getElementById("precioCarrito");
  mostrarCarrito.className = "precioFinal"
  mostrarCarrito.innerText = "PRECIO A PAGAR : $" + precioTotal
  document.body.append(mostrarCarrito);

}

function quitarCarrito(producto) {

  let indiceProducto = carrito.indexOf(producto.id);
  carrito.splice(indiceProducto, 1);
  localStorage.setItem(carritoClave, JSON.stringify(carrito));

}

function agregarCarrito(producto) {
  carrito.push(producto.id);
  localStorage.setItem(carritoClave, JSON.stringify(carrito));
}

function dibujarCarrito() {

  precioCarrito();

  let contenidoCarrito = document.getElementById("contenidoCarrito");

  contenidoCarrito.innerHTML = "";

  for (idProducto of carrito) {

    let producto = listaDePrecios.find(producto => producto.id === idProducto);

    if (producto) {
      let productito = document.createElement("h5");
      productito.innerHTML = producto.producto + " a $" + producto.precio
      contenidoCarrito.append(productito);
    }
  }
};

function dibujarCarritoSacar() {

  precioCarrito();

  let contenidoCarrito = document.getElementById("contenidoCarrito");

  contenidoCarrito.innerHTML = "";

  for (idProducto of carrito) {

    let producto = listaDePrecios.find(producto => producto.id === idProducto);
    if (producto) {
      let productito = document.createElement("h5");
      productito.innerHTML = producto.producto + " a " + producto.precio
      contenidoCarrito.append(productito);
    }
  }
};

//Funciones que ejecutan botones

let pagarCarrito = document.getElementById("pagarCarrito")
pagarCarrito.addEventListener("click", function () {

  let cuotasDiv = document.getElementById("cuotas")
  cuotasDiv.style.display = "block"

}
);

let botonCuotas = document.getElementById("calcularCuotas")
botonCuotas.addEventListener("click", function () {

  let cantidadDeCuotas = document.getElementById("cantidadDeCuotas").value;
  let precioPagar = calcularPrecioCarrito()
  let precioPorCuota = (precioPagar / cantidadDeCuotas);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  }
  )

  swalWithBootstrapButtons.fire({
    title: "Compra tus productos",
    text: "El precio total a pagar es: $ " + precioPagar + " en: " + cantidadDeCuotas + " cuotas.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar compra',
    cancelButtonText: 'Cancelar compra',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire(
        'Comprado',
        "Deberas pagar " + cantidadDeCuotas + " cuotas de: $ " + precioPorCuota,
        'success'
      )
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        "La compra a sido cancelada con exito",
        "Saludos",
        'error'
      )
    }
  }
  )
}
)


