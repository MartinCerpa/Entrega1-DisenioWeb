// ======================================================
// DATOS SIMULADOS
// La aplicación no utiliza backend ni base de datos.
// La información existe solamente mientras la página está abierta.
// ======================================================


// Array de objetos que representa los servicios disponibles.
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


// Array de objetos con los barberos disponibles.
const barberos = [
  { id: 1, nombre: "Matías" },
  { id: 2, nombre: "Sebastián" }
];


// ======================================================
// FUNCIONES AUXILIARES DE FECHA
// ======================================================


// Obtiene la fecha actual o una fecha futura en formato YYYY-MM-DD.
// El parámetro diasDesdeHoy permite sumar días.
function obtenerFechaISO(diasDesdeHoy = 0) {

  const fecha = new Date();

  // Reinicia horas, minutos y segundos para trabajar solamente con la fecha.
  fecha.setHours(0, 0, 0, 0);

  // Suma los días indicados.
  fecha.setDate(fecha.getDate() + diasDesdeHoy);

  // Convierte la fecha a formato compatible con input type="date".
  return fecha.toISOString().split("T")[0];
}


// ======================================================
// RESERVAS SIMULADAS INICIALES
// ======================================================


// let se utiliza porque este array puede cambiar durante la ejecución.
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


// ======================================================
// REFERENCIAS AL DOM
// querySelector permite obtener elementos del HTML para
// poder leerlos o modificarlos desde JavaScript.
// ======================================================

const listaServicios = document.querySelector("#listaServicios");

const listaReservas = document.querySelector("#listaReservas");

const formularioReserva = document.querySelector("#formularioReserva");

const filtroEstado = document.querySelector("#filtroEstado");

const mensajeFormulario = document.querySelector("#mensajeFormulario");

const campoFecha = document.querySelector("#fecha");


// ======================================================
// FUNCIONES DE FORMATO
// ======================================================


// Convierte un número a formato de moneda chilena.
function formatearPrecio(precio) {

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(precio);
}


// Convierte una fecha YYYY-MM-DD a una fecha legible.
function formatearFecha(fecha) {

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${fecha}T00:00:00`));
}


// Evita que un texto ingresado por el usuario
// sea interpretado como código HTML.
function escaparHTML(texto) {

  const contenedor = document.createElement("div");

  contenedor.textContent = texto;

  return contenedor.innerHTML;
}


// ======================================================
// FUNCIONES DE BÚSQUEDA
// find() devuelve el primer elemento del array
// que cumple la condición.
// ======================================================


// Busca un servicio utilizando su ID.
function buscarServicio(id) {

  return servicios.find(
    (servicio) => servicio.id === Number(id)
  );
}


// Busca un barbero utilizando su ID.
function buscarBarbero(id) {

  return barberos.find(
    (barbero) => barbero.id === Number(id)
  );
}


// ======================================================
// RENDERIZADO DE SERVICIOS
// Esta función modifica dinámicamente el DOM.
// ======================================================

function renderServicios() {

  // Limpia primero el contenido existente.
  listaServicios.innerHTML = "";

  // Recorre cada servicio del array.
  servicios.forEach((servicio) => {

    // Crea un nuevo elemento div.
    const columna = document.createElement("div");

    // Agrega clases Bootstrap para el diseño responsive.
    columna.className = "col-md-6 col-lg-4";

    // Crea el contenido HTML de la tarjeta.
    columna.innerHTML = `
      <article class="card service-card">

        <div class="card-body d-flex flex-column">

          <h3 class="h4 card-title">
            ${servicio.nombre}
          </h3>

          <p class="card-text text-secondary flex-grow-1">
            ${servicio.descripcion}
          </p>

          <div class="d-flex justify-content-between align-items-end border-top pt-3 mt-2">

            <span class="service-price">
              ${formatearPrecio(servicio.precio)}
            </span>

            <span class="service-duration">
              ${servicio.duracion}
            </span>

          </div>

        </div>

      </article>
    `;

    // Inserta el nuevo elemento en el DOM.
    listaServicios.appendChild(columna);

  });
}


// ======================================================
// CARGA DE OPCIONES DEL FORMULARIO
// Los select de servicios y barberos se crean desde
// los arrays de JavaScript.
// ======================================================

function cargarOpcionesFormulario() {

  const campoServicio = document.querySelector("#servicio");

  const campoBarbero = document.querySelector("#barbero");


  // Crea una opción por cada servicio.
  servicios.forEach((servicio) => {

    const opcion = document.createElement("option");

    opcion.value = servicio.id;

    opcion.textContent =
      `${servicio.nombre} · ${formatearPrecio(servicio.precio)}`;

    campoServicio.appendChild(opcion);

  });


  // Crea una opción por cada barbero.
  barberos.forEach((barbero) => {

    const opcion = document.createElement("option");

    opcion.value = barbero.id;

    opcion.textContent = barbero.nombre;

    campoBarbero.appendChild(opcion);

  });
}


// ======================================================
// RENDERIZADO DE RESERVAS
// Lee el array reservas y construye las tarjetas visibles.
// ======================================================

function renderReservas() {

  // Obtiene el filtro seleccionado por el usuario.
  const estadoSeleccionado = filtroEstado.value;


  // filter() crea un nuevo array solo con las reservas
  // que cumplen la condición.
  const reservasFiltradas = reservas.filter((reserva) => {

    return estadoSeleccionado === "Todas"
      || reserva.estado === estadoSeleccionado;

  });


  // Limpia la lista antes de volver a renderizar.
  listaReservas.innerHTML = "";


  // Si no hay resultados se muestra un mensaje.
  if (reservasFiltradas.length === 0) {

    listaReservas.innerHTML = `
      <div class="col-12">

        <p class="empty-state mb-0">
          No hay reservas para el filtro seleccionado.
        </p>

      </div>
    `;

    actualizarContadores();

    return;
  }


  // Recorre todas las reservas filtradas.
  reservasFiltradas.forEach((reserva) => {

    // Busca la información relacionada.
    const servicio = buscarServicio(reserva.servicioId);

    const barbero = buscarBarbero(reserva.barberoId);


    // Selecciona una clase CSS dependiendo del estado.
    const claseEstado =
      reserva.estado === "Confirmada"
        ? "status-confirmed"
        : "status-pending";


    // El botón confirmar solo aparece si la reserva está pendiente.
    const botonConfirmar =
      reserva.estado === "Pendiente"
        ? `
          <button
            class="btn btn-sm btn-outline-success"
            type="button"
            data-action="confirmar"
            data-id="${reserva.id}"
          >
            Confirmar reserva
          </button>
        `
        : "";


    // Crea la columna Bootstrap.
    const columna = document.createElement("div");

    columna.className = "col-md-6 col-lg-4";


    // Genera dinámicamente la tarjeta de reserva.
    columna.innerHTML = `
      <article class="card reservation-card">

        <div class="card-body d-flex flex-column">

          <div class="d-flex justify-content-between align-items-start gap-2">

            <h3 class="h5 mb-0">
              ${escaparHTML(reserva.cliente)}
            </h3>

            <span class="badge rounded-pill status-badge ${claseEstado}">
              ${reserva.estado}
            </span>

          </div>

          <ul class="reservation-meta flex-grow-1">

            <li>
              <strong>Servicio:</strong>
              ${servicio.nombre}
            </li>

            <li>
              <strong>Barbero:</strong>
              ${barbero.nombre}
            </li>

            <li>
              <strong>Fecha:</strong>
              ${formatearFecha(reserva.fecha)}
            </li>

            <li>
              <strong>Hora:</strong>
              ${reserva.hora}
            </li>

          </ul>

          <div class="d-flex flex-wrap gap-2 border-top pt-3">

            ${botonConfirmar}

            <button
              class="btn btn-sm btn-outline-danger"
              type="button"
              data-action="eliminar"
              data-id="${reserva.id}"
            >
              Eliminar reserva
            </button>

          </div>

        </div>

      </article>
    `;


    // Inserta la reserva en el DOM.
    listaReservas.appendChild(columna);

  });


  // Actualiza los números después de dibujar las reservas.
  actualizarContadores();
}


// ======================================================
// CONTADORES
// Calcula total, pendientes y confirmadas.
// ======================================================

function actualizarContadores() {

  const pendientes = reservas.filter(
    (reserva) => reserva.estado === "Pendiente"
  ).length;


  const confirmadas = reservas.filter(
    (reserva) => reserva.estado === "Confirmada"
  ).length;


  // textContent modifica el texto visible de cada contador.
  document.querySelector("#contadorReservas").textContent =
    reservas.length;


  document.querySelector("#contadorPendientes").textContent =
    pendientes;


  document.querySelector("#contadorConfirmadas").textContent =
    confirmadas;
}


// ======================================================
// MENSAJES DEL FORMULARIO
// ======================================================


// Muestra mensaje general de éxito o error.
function mostrarMensaje(texto, tipo) {

  mensajeFormulario.textContent = texto;

  // tipo puede ser "success" o "danger".
  mensajeFormulario.className =
    `alert alert-${tipo}`;
}


// Oculta el mensaje general.
function limpiarMensaje() {

  mensajeFormulario.textContent = "";

  mensajeFormulario.className =
    "alert d-none";
}


// ======================================================
// ERRORES DE VALIDACIÓN
// ======================================================


// Marca visualmente un campo como inválido.
function mostrarError(campo, mensaje) {

  campo.classList.add("is-invalid");

  document.querySelector(
    `#error-${campo.id}`
  ).textContent = mensaje;
}


// Elimina todos los errores anteriores.
function limpiarErrores() {

  formularioReserva
    .querySelectorAll(".is-invalid")
    .forEach((campo) => {

      campo.classList.remove("is-invalid");

    });


  formularioReserva
    .querySelectorAll(".invalid-feedback")
    .forEach((mensaje) => {

      mensaje.textContent = "";

    });
}


// ======================================================
// VALIDACIÓN DEL FORMULARIO
// ======================================================

function validarFormulario() {

  limpiarErrores();


  // FormData obtiene todos los valores ingresados.
  // Object.fromEntries los convierte en un objeto JavaScript.
  const datos = Object.fromEntries(
    new FormData(formularioReserva).entries()
  );


  let esValido = true;


  // Referencias de los campos que se van a validar.
  const campos = {

    nombreCliente:
      document.querySelector("#nombreCliente"),

    telefono:
      document.querySelector("#telefono"),

    servicio:
      document.querySelector("#servicio"),

    barbero:
      document.querySelector("#barbero"),

    fecha:
      document.querySelector("#fecha"),

    hora:
      document.querySelector("#hora")
  };


  // Valida que el nombre tenga mínimo 3 caracteres.
  if (datos.nombreCliente.trim().length < 3) {

    mostrarError(
      campos.nombreCliente,
      "Ingresa un nombre de al menos 3 caracteres."
    );

    esValido = false;
  }


  // Utiliza las restricciones HTML del teléfono.
  if (!campos.telefono.checkValidity()) {

    mostrarError(
      campos.telefono,
      "Ingresa un teléfono válido de 8 a 15 caracteres."
    );

    esValido = false;
  }


  // Verifica selección de servicio.
  if (!datos.servicio) {

    mostrarError(
      campos.servicio,
      "Selecciona un servicio."
    );

    esValido = false;
  }


  // Verifica selección de barbero.
  if (!datos.barbero) {

    mostrarError(
      campos.barbero,
      "Selecciona un barbero."
    );

    esValido = false;
  }


  // Verifica la fecha.
  if (!datos.fecha) {

    mostrarError(
      campos.fecha,
      "Selecciona una fecha."
    );

    esValido = false;

  } else if (datos.fecha < obtenerFechaISO()) {

    // Impide seleccionar fechas anteriores al día actual.
    mostrarError(
      campos.fecha,
      "La fecha no puede ser anterior a hoy."
    );

    esValido = false;
  }


  // Verifica selección de horario.
  if (!datos.hora) {

    mostrarError(
      campos.hora,
      "Selecciona un horario."
    );

    esValido = false;
  }


  // some() comprueba si existe al menos una reserva
  // con el mismo barbero, fecha y hora.
  const existeReserva = reservas.some((reserva) => {

    return (
      reserva.barberoId === Number(datos.barbero)
      && reserva.fecha === datos.fecha
      && reserva.hora === datos.hora
    );

  });


  // Si los demás datos son válidos y existe conflicto,
  // se bloquea la nueva reserva.
  if (esValido && existeReserva) {

    mostrarError(
      campos.hora,
      "Ese barbero ya tiene una reserva en esta fecha y hora."
    );

    esValido = false;
  }


  // Devuelve tanto el resultado como los datos.
  return {
    esValido,
    datos
  };
}


// ======================================================
// CREAR UNA NUEVA RESERVA
// ======================================================

function agregarReserva(datos) {

  // Construye un nuevo objeto reserva.
  const nuevaReserva = {

    // Date.now() entrega un número único basado en la hora actual.
    id: Date.now(),

    cliente: datos.nombreCliente.trim(),

    telefono: datos.telefono.trim(),

    servicioId: Number(datos.servicio),

    barberoId: Number(datos.barbero),

    fecha: datos.fecha,

    hora: datos.hora,

    estado: "Pendiente"
  };


  // push() agrega el objeto al final del array.
  reservas.push(nuevaReserva);


  // Vuelve a dibujar las reservas.
  renderReservas();
}


// ======================================================
// CAMBIAR ESTADO DE UNA RESERVA
// ======================================================

function cambiarEstado(id) {

  // Busca la reserva correspondiente.
  const reserva = reservas.find(
    (item) => item.id === Number(id)
  );


  // Si no existe, termina la función.
  if (!reserva) return;


  // Modifica el estado del objeto.
  reserva.estado = "Confirmada";


  // Actualiza la interfaz.
  renderReservas();
}


// ======================================================
// ELIMINAR UNA RESERVA
// ======================================================

function eliminarReserva(id) {

  // Crea un nuevo array excluyendo la reserva indicada.
  reservas = reservas.filter(
    (reserva) => reserva.id !== Number(id)
  );


  // Actualiza la interfaz.
  renderReservas();
}


// ======================================================
// EVENTO SUBMIT DEL FORMULARIO
// Se ejecuta cuando el usuario presiona Guardar reserva.
// ======================================================

formularioReserva.addEventListener(
  "submit",
  (evento) => {

    // Evita que el formulario recargue toda la página.
    evento.preventDefault();


    limpiarMensaje();


    // Ejecuta las validaciones.
    const resultado = validarFormulario();


    // Si hay errores, se informa al usuario.
    if (!resultado.esValido) {

      mostrarMensaje(
        "Revisa los campos marcados antes de guardar la reserva.",
        "danger"
      );

      return;
    }


    // Agrega la reserva al array.
    agregarReserva(resultado.datos);


    // Limpia todos los campos del formulario.
    formularioReserva.reset();


    // Mantiene la fecha mínima permitida.
    campoFecha.min = obtenerFechaISO();


    // Muestra confirmación.
    mostrarMensaje(
      "Reserva guardada correctamente. Puedes verla en la sección de gestión.",
      "success"
    );
  }
);


// ======================================================
// EVENTO CHANGE DEL FORMULARIO
// Se ejecuta cuando el usuario modifica un campo.
// ======================================================

formularioReserva.addEventListener(
  "change",
  (evento) => {

    // Obtiene el campo que cambió.
    const campo = evento.target;


    // Elimina su estado visual de error.
    campo.classList.remove("is-invalid");


    const mensajeError =
      document.querySelector(`#error-${campo.id}`);


    if (mensajeError) {

      mensajeError.textContent = "";

    }


    limpiarMensaje();
  }
);


// ======================================================
// EVENTO CLICK EN LA LISTA DE RESERVAS
//
// Se utiliza delegación de eventos:
// existe un solo listener para todos los botones de las tarjetas.
// ======================================================

listaReservas.addEventListener(
  "click",
  (evento) => {

    // Busca el botón más cercano que tenga data-action.
    const boton =
      evento.target.closest("button[data-action]");


    // Si el click no fue sobre uno de esos botones, termina.
    if (!boton) return;


    // Obtiene los atributos data-action y data-id.
    const { action, id } = boton.dataset;


    // Ejecuta la acción correspondiente.
    if (action === "confirmar") {

      cambiarEstado(id);

    }


    if (action === "eliminar") {

      eliminarReserva(id);

    }
  }
);


// ======================================================
// EVENTO DEL FILTRO
// Cada vez que cambia el select se vuelven a mostrar
// únicamente las reservas correspondientes.
// ======================================================

filtroEstado.addEventListener(
  "change",
  renderReservas
);


// ======================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// Estas instrucciones se ejecutan cuando app.js carga.
// ======================================================


// Evita seleccionar una fecha anterior a hoy desde el calendario.
campoFecha.min = obtenerFechaISO();


// Agrega los servicios y barberos a los select.
cargarOpcionesFormulario();


// Dibuja las tarjetas de servicios.
renderServicios();


// Dibuja las reservas iniciales y los contadores.
renderReservas();
