//CUOTAS
const selectCuotas = document.getElementById("cuotas");
//CONTENEDOR PRESTAMOS
const contenedorPrestamos = document.getElementById("contenedor-prestamos");
//
const simularPrestmo = document.getElementById("simular");
//
const simulacionfinal = document.getElementById("simulacionfinal");

const prestamoSolicitado = document.getElementById("prestamo-solicitado");
const ptmonto = document.getElementById("ptmonto");
const ptcuotas = document.getElementById("ptcuotas");

const contenedorParent = document.getElementById("contenedor-parent");
const formulario = document.getElementById("formulario");
const btsolicitar = document.getElementById("btsolicitar");

//
const DatosSolicitud = [];
let bandera = true;
let banderaValidacion = true;
//MONTO
let banderaMonto = 0;
//CUOTAS
let banderaCuota = 0;
//EDAD
let banderaEdad = 0;
//CALCULO PRESTAMO
const Prestamo = {
  cuotaInicial: 0,
  cuotaPromedio: 0,
  cuotaFinal: 0,
  gastosAdministrativos: 0,
  ingresoRequerido: 0,
};
const Intereses = [];
const Seguro = [];
const ValorCuota = [];
let alicuotaSeguro;
let capital;
let interesTotal = 0;
let interesParcial = 0;
let totalCuotas = 0;
let cuotaInicial = 0;
let cuotaPromedio = 0;
let cuotaFinal = 0;
let ingresoMensualRequeirdo;
let gastosAdministrativos;
let tasaInteres;

const formatterARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
});

const Prestamotomado =
  JSON.parse(localStorage.getItem("prestamo_tomado")) || [];

if (Prestamotomado.length > 0) {
  prestamoSolicitado.classList.remove("non-visible");

  ptmonto.innerHTML = `Monto: ${formatterARS.format(Prestamotomado[0])}`;
  ptcuotas.innerHTML = `A devolver en: ${Prestamotomado[1]} cuotas.`;
}

const tipoPrestamo = [
  {
    id: "1",
    title: "Préstamo Personal",
    description:
      "Préstamo personal libre destino, diseñado para volver realidad tus proyectos más deseados.",
    interest: 55,
    image: "img/prestamo-personal.jpg",
    alt: "Préstamo Personal",
  },
  {
    id: "2",
    title: "Préstamo compra equipamiento",
    description: "Correa resistente y cómoda, ajustable hasta 2 metros.",
    interest: 50,
    image: "img/prestamo-equipamiento.jpg",
    alt: "Préstamo compra equipamiento",
  },
  {
    id: "3",
    title: "Préstamo compra 0 kilómetro",
    description: "Cama ergonómica con espuma de memoria para mayor confort.",
    interest: 70,
    image: "img/prestamos-auto.jpg",
    alt: "Préstamo compra 0 kilómetro",
  },
];

function creadoraDeCuotas() {
  let contenidoSelect = `<option value="0" selected>Selecionar la cantidad de cuotas</option>`;
  for (let index = 1; index <= 36; index++) {
    contenidoSelect += `<option value="${index}">${index}</option>`;
  }
  selectCuotas.innerHTML = contenidoSelect;
}

function creadoraDePrestamos() {
  tipoPrestamo.forEach((ele) => {
    contenedorPrestamos.innerHTML += `
        <div class="col" id=${ele.id + "P"}>
            <div class="card">
                <img
                        src=${ele.image}
                        alt=${ele.alt}
                />
                <div class="card-body">
                    <h5 class="card-title">${ele.title}</h5>
                    <p class="card-text">${ele.description}</p>
                    <div class="alert alert-primary" role="alert">Tasa de interés anual <span class="tasa">${
                      ele.interest
                    }%</span></div>
                    <button class="btn btn-primary sim-prestamo">Simular</button>
		        </div>
            </div>
        </div>
`;
  });
}

function validarCampos(monto, cuotas, edad) {
  let errorMonto = document.getElementById("error-monto");
  let errorCuotas = document.getElementById("error-cuotas");
  let errorEdad = document.getElementById("error-edad");

  // VALIDACION DE MONTO
  if (monto != "") {
    if (monto.includes(".") || monto.includes(",")) {
      errorMonto.classList.toggle("non-visible");
      errorMonto.innerHTML = "Solo se aceptan números sin punto ni coma";
      banderaValidacion = false;
    } else {
      const numero = Number(monto);
      if (!Number.isInteger(numero)) {
        errorMonto.classList.toggle("non-visible");
        errorMonto.innerHTML = "Solo se aceptan números";
        banderaValidacion = false;
      } else {
        if (monto > 5000000) {
          errorMonto.classList.toggle("non-visible");
          errorMonto.innerHTML = "El monto no puede ser mayor a $5.000.000";
          banderaValidacion = false;
        }
      }
    }
  } else {
    errorMonto.classList.toggle("non-visible");
    errorMonto.innerHTML = "Campo Obligatorio";
    banderaValidacion = false;
  }

  // VALIDACION CUOTAS
  if (cuotas == 0) {
    errorCuotas.classList.toggle("non-visible");
    errorCuotas.innerHTML = "Campo Obligatorio";
    banderaValidacion = false;
  }
  // VALIDACION DE EDAD
  if (edad != "") {
    if (edad.includes(".") || edad.includes(",")) {
      errorEdad.classList.toggle("non-visible");
      errorEdad.innerHTML = "Solo se aceptan números sin punto ni coma";
      banderaValidacion = false;
    } else {
      const numeroEdad = Number(edad);
      if (!Number.isInteger(numeroEdad)) {
        errorEdad.classList.toggle("non-visible");
        errorEdad.innerHTML = "Solo se aceptan números";
        banderaValidacion = false;
      }
    }
  } else {
    errorEdad.classList.toggle("non-visible");
    errorEdad.innerHTML = "Campo Obligatorio";
    banderaValidacion = false;
  }

  return banderaValidacion;
}

function calculaPrestamo(monto, cuotas, edad) {
  if (edad <= 65) {
    alicuotaSeguro = 1 / 1000;
  }
  if (edad > 65 && edad <= 77) {
    alicuotaSeguro = 2 / 1000;
  }
  if (edad > 77) {
    alicuotaSeguro = 0;
  }
  //CAPITAL
  capital = monto / cuotas;

  //CALCULO DE INTERESES
  for (i = 0; i < cuotas; i++) {
    Intereses[i] = (monto - capital * i) * (tasaInteres / 1200);
  }
  for (i = 0; i < cuotas; i++) {
    interesTotal = interesTotal + Intereses[i];
  }
  //CALCULO DE SEGURO
  for (i = 0; i < cuotas; i++) {
    Seguro[i] =
      (parseInt(monto) +
        parseInt(interesTotal) -
        (capital * i + parseInt(interesParcial))) *
      alicuotaSeguro;
    interesParcial = interesParcial + Intereses[i];
  }
  // CALCULO VALOR CUOTAS
  for (i = 0; i < cuotas; i++) {
    ValorCuota[i] = capital + Intereses[i] + Seguro[i];
  }
  for (i = 0; i < cuotas; i++) {
    totalCuotas = totalCuotas + ValorCuota[i];
  }
  // VALOR PRIMERA CUOTA
  cuotaInicial = ValorCuota[0];
  Prestamo.cuotaInicial = formatterARS.format(cuotaInicial);
  // VALOR  CUOTA PROMEDIO
  cuotaPromedio = totalCuotas / cuotas;
  Prestamo.cuotaPromedio = formatterARS.format(cuotaPromedio);
  // VALOR ÚLTIMA CUOTA
  cuotaFinal = ValorCuota[cuotas - 1];
  Prestamo.cuotaFinal = formatterARS.format(cuotaFinal);
  // GASTOS ADMINISTRATIVOS
  gastosAdministrativos = (monto / 100) * 2;
  Prestamo.gastosAdministrativos = formatterARS.format(gastosAdministrativos);
  // INGRESO MENSUAL REQUERIDO Mensual Rwuqrido
  ingresoMensualRequeirdo = ValorCuota[0] / 0.2;
  Prestamo.ingresoRequerido = formatterARS.format(ingresoMensualRequeirdo);

  simulacionfinal.classList.remove("non-visible");

  simulacionfinal.innerHTML = `
   <div class="card-header">
                                    Simulación
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Los valores calculados para el prestamo simulado son:</h5>
                                    <p class="card-text"><strong>Cuota inicial</strong>: ${Prestamo.cuotaInicial}</p>
                                    <p class="card-text"><strong>Cuota promedio</strong>: ${Prestamo.cuotaPromedio}</p>
                                    <p class="card-text"><strong>Cuota final</strong>: ${Prestamo.cuotaFinal}</p>
                                    <p class="card-text"><strong>Gastos administrativos</strong>: ${Prestamo.gastosAdministrativos}</p>
                                    <p class="card-text"><strong>Ingreso mensual requerido</strong>: ${Prestamo.ingresoRequerido}</p>

                                </div>
                                <div class="card-footer text-body-secondary text-center">
                                    <a href="#" class="btn btn-primary miBoton" id="btsolicitar">Solicitar</a>
                                </div>`;

  Prestamotomado.push(monto);
  Prestamotomado.push(cuotas);
  
}

/* ------------------------------- */

function buscadoraDePrestamoEnLista(id) {
  return tipoPrestamo.find((el) => el.id + "P" == id);
}

function dadoraDeEventosABoton() {
  const HTMLElementsBotones = document.getElementsByClassName("sim-prestamo");
  const ArrayBotones = Array.from(HTMLElementsBotones);

  ArrayBotones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      let prestamos = buscadoraDePrestamoEnLista(
        e.target.parentElement.parentElement.parentElement.id
      );
      document.getElementById("titulo-prestamo").innerHTML = prestamos.title;
      tasaInteres = prestamos.interest;
      formulario.classList.remove("non-visible");
      document.getElementById("bttipoprestamo").classList.remove("active");

      contenedorParent.classList.add("non-visible");
      document.getElementById("btsimulador").classList.add("active");
    });
  });
}

simularPrestmo.addEventListener("click", (e) => {
  let montoSolicitar = document.getElementById("monto").value;
  let cantidadCuota = document.getElementById("cuotas").value;
  let edad = document.getElementById("edad").value;
  let validacion = validarCampos(montoSolicitar, cantidadCuota, edad);
  if (validacion) {
    //DatosSolicitud.push(montoSolicitar, cantidadCuota, edad);
    calculaPrestamo(montoSolicitar, cantidadCuota, edad);
  }
});

simulacionfinal.addEventListener('click', function(event) {
  // Verifica si el evento proviene del elemento dinámico
  if (event.target && event.target.matches('.miBoton')) {
    localStorage.setItem("prestamo_tomado", JSON.stringify(Prestamotomado));
  }
});

function main() {
  creadoraDeCuotas();
  creadoraDePrestamos();
  dadoraDeEventosABoton();
}

main();
