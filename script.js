// Reemplaza esta URL con la que te dará Google Apps Script al publicar
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZnAw1YXqFEt9gzjOjrA3d7m39KtRc6vx6_iwhecACq8Od6yBw40O4au4CbNz1MRdfow/exec"

// 1. Cargar las opciones cuando la página abra y preparar los formularios
document.addEventListener("DOMContentLoaded", function() {
  cargarOpcionesDesplegables();
  configurarEnvioFormularios();
});

// 2. Traer las opciones desde Google Sheets para los 3 desplegables
function cargarOpcionesDesplegables() {
  fetch(SCRIPT_URL + "?action=getOptions")
    .then(response => response.json())
    .then(data => {
      const idsDesplegables = [
        "desplegable-caso",
        "desplegable-pregunta",
        "desplegable-sentencia"
      ];

      idsDesplegables.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
          select.innerHTML = '<option value="" disabled selected>-- Selecciona una opción --</option>';
          
          data.options.forEach(opcion => {
            const optionElement = document.createElement("option");
            optionElement.value = opcion;
            optionElement.textContent = opcion;
            select.appendChild(optionElement);
          });
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar las opciones:", error);
    });
}

// 3. Controlar la visibilidad de las 3 secciones (Caso, Pregunta, Sentencia)
function mostrarFormulario(tipo) {
  document.getElementById('form-caso').style.display = 'none';
  document.getElementById('form-pregunta').style.display = 'none';
  document.getElementById('form-sentencia').style.display = 'none';

  if (tipo === 'caso') {
    document.getElementById('form-caso').style.display = 'block';
  } else if (tipo === 'pregunta') {
    document.getElementById('form-pregunta').style.display = 'block';
  } else if (tipo === 'sentencia') {
    document.getElementById('form-sentencia').style.display = 'block';
  }
}

// 4. Función para el botón "Borrar todo"
function limpiarFormulario(formId) {
  document.getElementById(formId).reset();
}

// 5. Función para interceptar el clic en "Guardar en Sheets" y enviar la información
function configurarEnvioFormularios() {
  const listaFormularios = [
    { id: 'form-caso', tipo: 'caso' },
    { id: 'form-pregunta', tipo: 'pregunta' },
    { id: 'form-sentencia', tipo: 'sentencia' }
  ];

  listaFormularios.forEach(item => {
    const formulario = document.getElementById(item.id);
    if (formulario) {
      formulario.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue

        const formData = new FormData(formulario);
        const datos = {
          tipoFormulario: item.tipo // Le dice a Apps Script a qué pestaña ir
        };

        // Recoge todos los campos cargados en el formulario activo
        formData.forEach((value, key) => {
          datos[key] = value;
        });

        // Enviar datos a Google Sheets mediante POST
        fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        .then(() => {
          alert('¡Guardado exitosamente en Google Sheets!');
          formulario.reset();
        })
        .catch(error => {
          console.error('Error al guardar:', error);
          alert('Ocurrió un error al intentar guardar los datos.');
        });
      });
    }
  });
}
