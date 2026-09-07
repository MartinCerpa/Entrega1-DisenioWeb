// Datos simulados: la aplicación no usa backend ni base de datos.
const servicios = [
  {
    id: 1,
    nombre: "Corte clásico",
    descripcion: "Corte tradicional adaptado a tu estilo.",
    precio: 12000,
    duracion: "45 min"
  },
  {
    id: 2,
    nombre: "Corte + barba",
    descripcion: "Corte de cabello y perfilado de barba en una sola atención.",
    precio: 18000,
    duracion: "70 min"
  },
  {
    id: 3,
    nombre: "Perfilado de barba",
    descripcion: "Definición y cuidado para una barba prolija.",
    precio: 9000,
    duracion: "30 min"
  }
];

const barberos = [
  { id: 1, nombre: "Matías" },
  { id: 2, nombre: "Sebastián" }
];

function obtenerFechaISO(diasDesdeHoy = 0) {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + diasDesdeHoy);
  return fecha.toISOString().split("T")[0];
}

let reservas = [
  {
    id: 1,
    cliente: "Camilo Rojas",
    telefono: "+56 9 8765 4321",
    servicioId: 1,
    barberoId: 1,
    fecha: obtenerFechaISO(1),
    hora: "10:00",
    estado: "Pendiente"
  },
  {
    id: 2,
    cliente: "Diego Soto",
    telefono: "+56 9 7654 3210",
    servicioId: 2,
    barberoId: 2,
    fecha: obtenerFechaISO(1),
    hora: "15:00",
    estado: "Confirmada"
  },
  {
    id: 3,
    cliente: "Valentin Pérez",
    telefono: "+56 9 6543 2109",
    servicioId: 3,
    barberoId: 1,
    fecha: obtenerFechaISO(2),
    hora: "12:00",
    estado: "Pendiente"
  }
];

const listaServicios = document.querySelector("#listaServicios");
const listaReservas = document.querySelector("#listaReservas");
const formularioReserva = document.querySelector("#formularioReserva");
const filtroEstado = document.querySelector("#filtroEstado");
const mensajeFormulario = document.querySelector("#mensajeFormulario");
const campoFecha = document.querySelector("#fecha");

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(precio);
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${fecha}T00:00:00`));
}

function escaparHTML(texto) {
  const contenedor = document.createElement("div");
  contenedor.textContent = texto;
  return contenedor.innerHTML;
}

function buscarServicio(id) {
  return servicios.find((servicio) => servicio.id === Number(id));
}

function buscarBarbero(id) {
  return barberos.find((barbero) => barbero.id === Number(id));
}

function renderServicios() {
  listaServicios.innerHTML = "";

  servicios.forEach((servicio) => {
    const columna = document.createElement("div");
    columna.className = "col-md-6 col-lg-4";
    columna.innerHTML = `
      <article class="card service-card">
        <div class="card-body d-flex flex-column">
          <h3 class="h4 card-title">${servicio.nombre}</h3>
          <p class="card-text text-secondary flex-grow-1">${servicio.descripcion}</p>
          <div class="d-flex justify-content-between align-items-end border-top pt-3 mt-2">
            <span class="service-price">${formatearPrecio(servicio.precio)}</span>
            <span class="service-duration">${servicio.duracion}</span>
          </div>
        </div>
      </article>
    `;
    listaServicios.appendChild(columna);
  });
}

function cargarOpcionesFormulario() {
  const campoServicio = document.querySelector("#servicio");
  const campoBarbero = document.querySelector("#barbero");

  servicios.forEach((servicio) => {
    const opcion = document.createElement("option");
    opcion.value = servicio.id;
    opcion.textContent = `${servicio.nombre} · ${formatearPrecio(servicio.precio)}`;
    campoServicio.appendChild(opcion);
  });

  barberos.forEach((barbero) => {
    const opcion = document.createElement("option");
    opcion.value = barbero.id;
    opcion.textContent = barbero.nombre;
    campoBarbero.appendChild(opcion);
  });
}

function renderReservas() {
  const estadoSeleccionado = filtroEstado.value;
  const reservasFiltradas = reservas.filter((reserva) => {
    return estadoSeleccionado === "Todas" || reserva.estado === estadoSeleccionado;
  });

  listaReservas.innerHTML = "";

  if (reservasFiltradas.length === 0) {
    listaReservas.innerHTML = `
      <div class="col-12">
        <p class="empty-state mb-0">No hay reservas para el filtro seleccionado.</p>
      </div>
    `;
    actualizarContadores();
    return;
  }

  reservasFiltradas.forEach((reserva) => {
    const servicio = buscarServicio(reserva.servicioId);
    const barbero = buscarBarbero(reserva.barberoId);
    const claseEstado = reserva.estado === "Confirmada" ? "status-confirmed" : "status-pending";
    const botonConfirmar = reserva.estado === "Pendiente"
      ? `<button class="btn btn-sm btn-outline-success" type="button" data-action="confirmar" data-id="${reserva.id}">Confirmar reserva</button>`
      : "";

    const columna = document.createElement("div");
    columna.className = "col-md-6 col-lg-4";
    columna.innerHTML = `
      <article class="card reservation-card">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h3 class="h5 mb-0">${escaparHTML(reserva.cliente)}</h3>
            <span class="badge rounded-pill status-badge ${claseEstado}">${reserva.estado}</span>
          </div>
          <ul class="reservation-meta flex-grow-1">
            <li><strong>Servicio:</strong> ${servicio.nombre}</li>
            <li><strong>Barbero:</strong> ${barbero.nombre}</li>
            <li><strong>Fecha:</strong> ${formatearFecha(reserva.fecha)}</li>
            <li><strong>Hora:</strong> ${reserva.hora}</li>
          </ul>
          <div class="d-flex flex-wrap gap-2 border-top pt-3">
            ${botonConfirmar}
            <button class="btn btn-sm btn-outline-danger" type="button" data-action="eliminar" data-id="${reserva.id}">Eliminar reserva</button>
          </div>
        </div>
      </article>
    `;
    listaReservas.appendChild(columna);
  });

  actualizarContadores();
}

function actualizarContadores() {
  const pendientes = reservas.filter((reserva) => reserva.estado === "Pendiente").length;
  const confirmadas = reservas.filter((reserva) => reserva.estado === "Confirmada").length;

  document.querySelector("#contadorReservas").textContent = reservas.length;
  document.querySelector("#contadorPendientes").textContent = pendientes;
  document.querySelector("#contadorConfirmadas").textContent = confirmadas;
}

function mostrarMensaje(texto, tipo) {
  mensajeFormulario.textContent = texto;
  mensajeFormulario.className = `alert alert-${tipo}`;
}

function limpiarMensaje() {
  mensajeFormulario.textContent = "";
  mensajeFormulario.className = "alert d-none";
}

function mostrarError(campo, mensaje) {
  campo.classList.add("is-invalid");
  document.querySelector(`#error-${campo.id}`).textContent = mensaje;
}

function limpiarErrores() {
  formularioReserva.querySelectorAll(".is-invalid").forEach((campo) => {
    campo.classList.remove("is-invalid");
  });
  formularioReserva.querySelectorAll(".invalid-feedback").forEach((mensaje) => {
    mensaje.textContent = "";
  });
}

function validarFormulario() {
  limpiarErrores();
  const datos = Object.fromEntries(new FormData(formularioReserva).entries());
  let esValido = true;
  const campos = {
    nombreCliente: document.querySelector("#nombreCliente"),
    telefono: document.querySelector("#telefono"),
    servicio: document.querySelector("#servicio"),
    barbero: document.querySelector("#barbero"),
    fecha: document.querySelector("#fecha"),
    hora: document.querySelector("#hora")
  };

  if (datos.nombreCliente.trim().length < 3) {
    mostrarError(campos.nombreCliente, "Ingresa un nombre de al menos 3 caracteres.");
    esValido = false;
  }

  if (!campos.telefono.checkValidity()) {
    mostrarError(campos.telefono, "Ingresa un teléfono válido de 8 a 15 caracteres.");
    esValido = false;
  }

  if (!datos.servicio) {
    mostrarError(campos.servicio, "Selecciona un servicio.");
    esValido = false;
  }

  if (!datos.barbero) {
    mostrarError(campos.barbero, "Selecciona un barbero.");
    esValido = false;
  }

  if (!datos.fecha) {
    mostrarError(campos.fecha, "Selecciona una fecha.");
    esValido = false;
  } else if (datos.fecha < obtenerFechaISO()) {
    mostrarError(campos.fecha, "La fecha no puede ser anterior a hoy.");
    esValido = false;
  }

  if (!datos.hora) {
    mostrarError(campos.hora, "Selecciona un horario.");
    esValido = false;
  }

  const existeReserva = reservas.some((reserva) => {
    return reserva.barberoId === Number(datos.barbero)
      && reserva.fecha === datos.fecha
      && reserva.hora === datos.hora;
  });

  if (esValido && existeReserva) {
    mostrarError(campos.hora, "Ese barbero ya tiene una reserva en esta fecha y hora.");
    esValido = false;
  }

  return { esValido, datos };
}

function agregarReserva(datos) {
  const nuevaReserva = {
    id: Date.now(),
    cliente: datos.nombreCliente.trim(),
    telefono: datos.telefono.trim(),
    servicioId: Number(datos.servicio),
    barberoId: Number(datos.barbero),
    fecha: datos.fecha,
    hora: datos.hora,
    estado: "Pendiente"
  };

  reservas.push(nuevaReserva);
  renderReservas();
}

function cambiarEstado(id) {
  const reserva = reservas.find((item) => item.id === Number(id));
  if (!reserva) return;

  reserva.estado = "Confirmada";
  renderReservas();
}

function eliminarReserva(id) {
  reservas = reservas.filter((reserva) => reserva.id !== Number(id));
  renderReservas();
}

formularioReserva.addEventListener("submit", (evento) => {
  evento.preventDefault();
  limpiarMensaje();

  const resultado = validarFormulario();
  if (!resultado.esValido) {
    mostrarMensaje("Revisa los campos marcados antes de guardar la reserva.", "danger");
    return;
  }

  agregarReserva(resultado.datos);
  formularioReserva.reset();
  campoFecha.min = obtenerFechaISO();
  mostrarMensaje("Reserva guardada correctamente. Puedes verla en la sección de gestión.", "success");
});

formularioReserva.addEventListener("change", (evento) => {
  const campo = evento.target;
  campo.classList.remove("is-invalid");
  const mensajeError = document.querySelector(`#error-${campo.id}`);
  if (mensajeError) mensajeError.textContent = "";
  limpiarMensaje();
});

listaReservas.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-action]");
  if (!boton) return;

  const { action, id } = boton.dataset;
  if (action === "confirmar") cambiarEstado(id);
  if (action === "eliminar") eliminarReserva(id);
});

filtroEstado.addEventListener("change", renderReservas);

campoFecha.min = obtenerFechaISO();
cargarOpcionesFormulario();
renderServicios();
renderReservas();
