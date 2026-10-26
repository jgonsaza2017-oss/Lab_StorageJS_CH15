// ============================================================
// Lab de almacenamiento · ¿Cuánto me costó vivir este mes?
// ============================================================
// Una app de gastos personales que NO olvida: lo que anotes hoy
// sigue ahí mañana, aunque cierres el navegador.
// El enunciado completo de cada ejercicio está en el README.md.
//
// La idea de todo el taller:
//   al abrir la página  → cargar (localStorage → gastos) → pintar
//   en cada cambio      → cambiar gastos → guardar → pintar
// ============================================================

// ===== Datos (ya vienen listos, no los borres) =====
const CLAVE_GASTOS = "registro-gastos";
const CLAVE_FILTRO = "registro-gastos-filtro";
const CATEGORIAS = ["Comida", "Transporte", "Entretenimiento", "Servicios", "Otros"];

let gastos = [];
let filtroActual = "Todas";

// ===== Elementos de la página (ya vienen listos) =====
const inputDescripcion = document.querySelector("#inputDescripcion");
const inputMonto = document.querySelector("#inputMonto");
const selectCategoria = document.querySelector("#selectCategoria");
const btnAgregar = document.querySelector("#btnAgregar");
const totalHoy = document.querySelector("#totalHoy");
const totalMes = document.querySelector("#totalMes");
const listaCategorias = document.querySelector("#listaCategorias");
const listaGastos = document.querySelector("#listaGastos");
const filtroLista = document.querySelector("#filtroLista");

// ===== Ayuda (ya viene lista): 7950 → "$7.950" =====
function formatearPesos(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

// ============================================================
// Ejercicio 01 · guardarGastos(): del arreglo al almacenamiento
// ============================================================
// Guarda TODO el arreglo gastos en localStorage, con la clave
// CLAVE_GASTOS. Recuerda: localStorage solo guarda texto
// → empaca el arreglo con JSON.stringify.
// ============================================================
function guardarGastos() {
const datosEnTexto = JSON.stringify(gastos);
localStorage.setItem(CLAVE_GASTOS, datosEnTexto);
}

// ============================================================
// Ejercicio 02 · cargarGastos(): leer sin que un dato roto tumbe la app
// ============================================================
// Lee el texto guardado con la clave CLAVE_GASTOS y ponlo en gastos:
//   - si no hay nada guardado (getItem da null) → gastos = []
//   - si hay texto → gastos = JSON.parse(texto)
//   - si el texto está dañado (JSON.parse falla) → gastos = []
//     (usa try/catch: la app debe seguir funcionando)
// ============================================================
function cargarGastos() {
  // leemos el texto guardado en localStorage
  const textoGuardado = localStorage.getItem(CLAVE_GASTOS);

  // Si está vacío (es null), arrancamos la lista en blanco
  if (textoGuardado === null) {
  gastos = [];
  return;
}

//Intentar armar la lista; si el texto venía dañado, el catch nos salva para no dañar la app
try {
  gastos = JSON.parse(textoGuardado);
}catch (error) {
  console.warn("Este dato venia danado, toca empesar en limpio: , error");
  gastos = [];
}
}




// ============================================================
// Ejercicio 03 · crearGasto(descripcion, monto, categoria)
// ============================================================
// Retorna un objeto con esta forma:
//   { descripcion: "Café", monto: 5000, categoria: "Comida", fecha: "2026-10-22T13:05:00.000Z" }
// - descripcion va sin espacios al inicio ni al final (trim)
// - fecha la genera tu código: new Date().toISOString()
// Retorna null si la descripción queda vacía, o si el monto no es
// un número mayor que 0 (ojo: Number("abc") da NaN).
// ============================================================
function crearGasto(descripcion, monto, categoria) {
  // Limpiamos los espacios sobrantes en la descripcion
  const textoLimpio = descripcion.trim();

  // se valida que haya descripcion y que el monto sea un numero valido mayor a 0
  if (textoLimpio === "" || Number.isNaN(monto) || monto <= 0) {
    return null;
  }

  // Devolvemos el objeto armado con su fecha actual
  return {
    descripcion: textoLimpio,
    monto: monto,
    categoria: categoria,
    fecha: new Date().toISOString()
  };
}

// ============================================================
// Ejercicio 04 · agregarGasto(): cambiar, guardar, pintar
// ============================================================
// Se ejecuta al hacer clic en "Agregar gasto" (la conexión ya está
// escrita abajo). En orden:
//   1. crea el gasto con crearGasto(...) usando lo escrito en el
//      formulario (el monto llega como texto: conviértelo con Number)
//   2. si es null, no hagas nada más (return)
//   3. agrégalo a gastos y limpia la descripción y el monto
//   4. guárdalo (Ejercicio 01) y vuelve a pintar todo: actualizarTodo()
// ============================================================
function agregarGasto() {
  // Armamos el gasto con los valores del formulario
  const nuevoGasto = crearGasto(
  inputDescripcion.value,
  Number(inputMonto.value),
  selectCategoria.value
);

// Si no es un gasto valido, no hacemos nada y salimos
if  (nuevoGasto === null) {
  return;
  }

  // Lo metemos a la lista y limpiamos las cajas de texto
  gastos.push(nuevoGasto);
  inputDescripcion.value = "";
  inputMonto.value = "";

// Guardamos en localStorage y actualizamos la pantalla
guardarGastos();
actualizarTodo();

}

// ============================================================
// Ejercicio 05 · esDeHoy(gasto) y esDeEsteMes(gasto)
// ============================================================
// gasto.fecha es TEXTO: reconstruye la fecha con new Date(gasto.fecha).
// - esDeHoy → true si coinciden día, mes y año con hoy
// - esDeEsteMes → true si coinciden mes y año con hoy
// No compares el texto completo: la hora casi nunca es la misma.
// ============================================================
function esDeHoy(gasto) {
  // Reconstruimos la fecha del gasto y sacamos la fecha de hoy
const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();

// Verificamos que coincidan dia, mes y año
  return (
    fechaGasto.getDate() === hoy.getDate() &&
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );

}

function esDeEsteMes(gasto) {
 // Reconstruimos la fecha del gasto y sacamos la fecha de hoy
  const fechaGasto = new Date(gasto.fecha);
  const hoy = new Date();


// Verificamos que coincidan mes y año
  return (
    fechaGasto.getMonth() === hoy.getMonth() &&
    fechaGasto.getFullYear() === hoy.getFullYear()
  );
}



// ============================================================
// Ejercicio 06 · sumarMontos(lista) y mostrarTotales()
// ============================================================
// - sumarMontos: suma los montos de la lista con .reduce() (empieza en 0)
// - mostrarTotales: escribe en totalHoy y totalMes el total de los
//   gastos de hoy y del mes, con formatearPesos. Reutiliza esDeHoy,
//   esDeEsteMes (con .filter) y sumarMontos.
// ============================================================
function sumarMontos(lista) {
  // Sumamos los montos de la lista arrancando desde 0 con .reduce()
  return lista.reduce(function (total, gasto) {
    return total + gasto.monto;
  }, 0);
}

function mostrarTotales() {
 // Filtramos reutilizando las funciones de fecha del ejercicio anterior
  const gastosDeHoy = gastos.filter(esDeHoy);
  const gastosDelMes = gastos.filter(esDeEsteMes);

  // Sumamos y mostramos en pantalla con formato de pesos
  totalHoy.textContent = formatearPesos(sumarMontos(gastosDeHoy));
  totalMes.textContent = formatearPesos(sumarMontos(gastosDelMes));
}

// ============================================================
// Ejercicio 07 · mostrarCategorias()
// ============================================================
// Vacía listaCategorias y, recorriendo CATEGORIAS, crea un <li> por
// categoría con este texto exacto:   Comida: $23.000
// Las 5 categorías siempre aparecen, aunque su total sea $0.
// ============================================================
function mostrarCategorias() {
  // 1. Limpiamos la lista para no acumular elementos viejos
  listaCategorias.innerHTML = "";

// 2. Recorremos las 5 categorias fijas
  CATEGORIAS.forEach(function (categoria) {
    // Filtramos los gastos que pertenecen a esta categoria
    const gastosDeCategoria = gastos.filter(function (gasto) {
      return gasto.categoria === categoria;
    });

// Sumamos los montos de esa categoria
    const total = sumarMontos(gastosDeCategoria);

// Creamos el elemento li y lo mostramos en la lista
    const li = document.createElement("li");
    li.textContent = categoria + ": " + formatearPesos(total);
    listaCategorias.appendChild(li);
  });
}


// ============================================================
// Ejercicio 08 · mostrarLista()
// ============================================================
// Vacía listaGastos y crea un <li> por cada gasto del arreglo:
//   <li>Café - $5.000 (Comida)<button class="eliminar" data-index="0">Eliminar</button></li>
// data-index es la posición del gasto en el arreglo gastos.
// (En el Ejercicio 10 vuelves aquí para agregar el filtro.)
// ============================================================
function mostrarLista() {
  // 1. Limpiamos la lista en pantalla
  listaGastos.innerHTML = "";

  // 2. Recorremos los gastos usando su indice
  gastos.forEach(function (gasto, indice) {
    // Si el filtro no es "Todas" y no coincide con la categoria, nos lo saltamos
    if (filtroActual !== "Todas" && gasto.categoria !== filtroActual) {
      return;
    }

    const li = document.createElement("li");

    // 3. Armamos el texto y el boton de eliminar con su data-index
    li.innerHTML =
      gasto.descripcion +
      " - " +
      formatearPesos(gasto.monto) +
      " (" +
      gasto.categoria +
      ')<button class="eliminar" data-index="' +
      indice +
      '">Eliminar</button>';

    // 4. Lo mostramos en la lista
    listaGastos.appendChild(li);
  });
}

// ============================================================
// Ejercicio 09 · eliminarGasto(evento): UN escuchador en la lista
// ============================================================
// La conexión ya está escrita abajo (en la lista, no en cada botón).
// - si el clic NO fue en un botón con la clase "eliminar" → return
// - lee la posición con evento.target.dataset.index (llega como texto)
// - sácalo del arreglo con splice, guarda y vuelve a pintar TODO
// ============================================================
function eliminarGasto(evento) {
 // 1. Verificamos si el clic fue en un boton de eliminar
  if (!evento.target.classList.contains("eliminar")) {
    return;
}

// 2. Leemos la posicion guardada en data-index y la pasamos a numero
  const posicion = Number(evento.target.dataset.index);

// 3. Eliminamos ese gasto del arreglo
  gastos.splice(posicion, 1);

  // 4. Guardamos en localStorage y refrescamos la pantalla
  guardarGastos();
  actualizarTodo();
}


// ============================================================
// Ejercicio 10 · El filtro se recuerda solo en esta pestaña
// ============================================================
// - cambiarFiltro: guarda filtroLista.value en filtroActual y en
//   sessionStorage (clave CLAVE_FILTRO) y vuelve a pintar la lista
// - cargarFiltro: lee el filtro de sessionStorage (si no hay → "Todas"),
//   lo pone en filtroActual y en filtroLista.value
// - en mostrarLista: si filtroActual no es "Todas", sáltate los gastos
//   de otras categorías (data-index sigue siendo la posición en gastos)
// ============================================================
function cambiarFiltro() {
  // 1. Guardamos el valor seleccionado en la variable global y en sessionStorage
  filtroActual = filtroLista.value;
  sessionStorage.setItem(CLAVE_FILTRO, filtroActual);

  // 2. Volvemos a pintar la lista con el filtro aplicado
  mostrarLista();
}

function cargarFiltro() {
  // 1. Leemos el filtro guardado en la sesion actual
  const filtroGuardado = sessionStorage.getItem(CLAVE_FILTRO);

  // 2. Si existia lo usamos, si no arrancamos con "Todas"
  if (filtroGuardado !== null) {
    filtroActual = filtroGuardado;
  } else {
    filtroActual = "Todas";
  }

  // 3. Sincronizamos el select del formulario con ese valor
  filtroLista.value = filtroActual;
}

// ===== Pintar todo (ya viene lista) =====
function actualizarTodo() {
  mostrarTotales();
  mostrarCategorias();
  mostrarLista();
}

// ===== Conexiones con la página (ya vienen listas) =====
btnAgregar.addEventListener("click", agregarGasto);
listaGastos.addEventListener("click", eliminarGasto);
filtroLista.addEventListener("change", cambiarFiltro);

// ===== Arranque (ya viene listo) =====
cargarGastos();
cargarFiltro();
actualizarTodo();
