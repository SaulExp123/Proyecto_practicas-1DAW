window.addEventListener("DOMContentLoaded", () => {
  const trabajadores = {
    "Saúl Expósito": {
      lunes: { entrada: "09:00", salida: "17:00" },
      martes: { entrada: "09:00", salida: "17:00" },
      miercoles: { entrada: "09:00", salida: "17:00" },
      jueves: { entrada: "09:00", salida: "17:00" },
      viernes: { entrada: "09:00", salida: "17:00" },
    },
    "Francisco Franco": {
      lunes: { entrada: "08:30", salida: "16:30" },
      martes: { entrada: "08:30", salida: "16:30" },
      miercoles: { entrada: "08:30", salida: "16:30" },
      jueves: { entrada: "08:30", salida: "16:30" },
      viernes: { entrada: "08:30", salida: "16:30" },
    },
    "Primo de Rivera": {
      lunes: { entrada: "10:00", salida: "18:00" },
      martes: { entrada: "10:00", salida: "18:00" },
      miercoles: { entrada: "10:00", salida: "18:00" },
      jueves: { entrada: "10:00", salida: "18:00" },
      viernes: { entrada: "10:00", salida: "18:00" },
    },
  };

  const dias = ["lunes", "martes", "miercoles", "jueves", "viernes"];

  const selectTrabajadores = document.getElementById("seleccionarTrabajador");

  const inputsEntrada = {};
  const inputsSalida = {};
  const spansHoras = {};

  dias.forEach((dia) => {
    inputsEntrada[dia] = document.getElementById(`entrada${capitalize(dia)}`);
    inputsSalida[dia] = document.getElementById(`salida${capitalize(dia)}`);
    spansHoras[dia] = document.getElementById(`horas${capitalize(dia)}`);
  });

  const tdTotal = document.getElementById("horaTotal");

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function cargarTrabajadores() {
    for (const trabajador in trabajadores) {
      const option = document.createElement("option");
      option.value = trabajador;
      option.textContent = trabajador;
      selectTrabajadores.appendChild(option);
    }
  }

  function cargarHorarioEnInputs(nombre) {
    const horarios = trabajadores[nombre];
    if (!horarios) return;

    dias.forEach((dia) => {
      inputsEntrada[dia].value = horarios[dia].entrada || "";
      inputsSalida[dia].value = horarios[dia].salida || "";
    });

    calcularTotal();
  }
  function calcularHoras(entrada, salida) {
    if (!entrada || !salida) return 0;

    const [hE, mE] = entrada.split(":").map(Number);
    const [hS, mS] = salida.split(":").map(Number);

    const entradaMin = hE * 60 + mE;
    const salidaMin = hS * 60 + mS;

    let diff = salidaMin - entradaMin;
    if (diff < 0) {
      diff += 24 * 60;
    }

    return diff / 60;
  }

  function calcularTotal() {
    let totalHoras = 0;

    dias.forEach((dia) => {
      const entrada = inputsEntrada[dia].value;
      const salida = inputsSalida[dia].value;

      const horas = calcularHoras(entrada, salida);
      totalHoras += horas;

      spansHoras[dia].textContent = horas.toFixed(2);

      const esValido =
        entrada.match(/^([01]\d|2[0-3]):([0-5]\d)$/) &&
        salida.match(/^([01]\d|2[0-3]):([0-5]\d)$/) &&
        horas >= 0 &&
        horas <= 24;

      if (!esValido) {
        inputsEntrada[dia].style.borderColor = "red";
        inputsSalida[dia].style.borderColor = "red";
      } else {
        inputsEntrada[dia].style.borderColor = "#2bb19f";
        inputsSalida[dia].style.borderColor = "#2bb19f";
      }
    });

    tdTotal.textContent = totalHoras.toFixed(2);
  }

  selectTrabajadores.addEventListener("change", () => {
    cargarHorarioEnInputs(selectTrabajadores.value);
  });

  dias.forEach((dia) => {
    inputsEntrada[dia].addEventListener("input", () => {
      const nombre = selectTrabajadores.value;
      if (!trabajadores[nombre]) return;

      const val = inputsEntrada[dia].value;
      if (val.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
        trabajadores[nombre][dia].entrada = val;
      }
      calcularTotal();
    });

    inputsSalida[dia].addEventListener("input", () => {
      const nombre = selectTrabajadores.value;
      if (!trabajadores[nombre]) return;

      const val = inputsSalida[dia].value;
      if (val.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
        trabajadores[nombre][dia].salida = val;
      }
      calcularTotal();
    });
  });

  cargarTrabajadores();
  selectTrabajadores.selectedIndex = 0;
  cargarHorarioEnInputs(selectTrabajadores.value);
});

