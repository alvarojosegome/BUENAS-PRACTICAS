// =========================================
// LISTA DE TAREAS
// =========================================

// Arreglo donde guardamos las tareas
let tareas = [];


// =========================================
// ELEMENTOS DEL HTML
// =========================================

const nuevaTarea = document.getElementById("nuevaTarea");
const listaTareas = document.getElementById("listaTareas");
const mensajeVacio = document.getElementById("mensajeVacio");


// =========================================
// CREATE - CREAR TAREA
// =========================================

// Detectamos cuando el usuario presiona una tecla
nuevaTarea.addEventListener("keydown", function (evento) {

    // Solo creamos la tarea cuando se presiona Enter
    if (evento.key === "Enter") {

        const texto = nuevaTarea.value.trim();

        // Evitamos crear tareas vacías
        if (texto === "") {
            return;
        }

        // Creamos una nueva tarea
        const tarea = {
            id: Date.now(),
            texto: texto,
            completada: false
        };

        // Agregamos la tarea al arreglo
        tareas.push(tarea);

        // Limpiamos el campo
        nuevaTarea.value = "";

        // Actualizamos la pantalla
        mostrarTareas();
    }
});


// =========================================
// READ - MOSTRAR TAREAS
// =========================================

function mostrarTareas() {

    // Limpiamos la lista antes de volver a mostrarla
    listaTareas.innerHTML = "";

    // Si no existen tareas mostramos el mensaje
    if (tareas.length === 0) {
        mensajeVacio.style.display = "block";
        return;
    }

    // Ocultamos el mensaje
    mensajeVacio.style.display = "none";


    // Recorremos todas las tareas
    tareas.forEach(function (tarea) {

        // Creamos el contenedor de la tarea
        const elementoTarea = document.createElement("div");

        elementoTarea.classList.add("tarea");


        // Si está completada agregamos la clase
        if (tarea.completada) {
            elementoTarea.classList.add("completada");
        }


        // =========================================
        // BOTÓN COMPLETAR
        // =========================================

        const botonCompletar = document.createElement("button");

        botonCompletar.classList.add("boton-completar");

        botonCompletar.innerHTML = tarea.completada ? "✓" : "";


        botonCompletar.addEventListener("click", function () {

            // Cambiamos el estado de completada
            tarea.completada = !tarea.completada;

            // Volvemos a mostrar las tareas
            mostrarTareas();
        });


        // =========================================
        // TEXTO DE LA TAREA
        // =========================================

        const textoTarea = document.createElement("span");

        textoTarea.classList.add("texto-tarea");

        textoTarea.textContent = tarea.texto;


        // =========================================
        // UPDATE - EDITAR TAREA
        // =========================================

        textoTarea.addEventListener("click", function () {

            // Creamos un campo para editar
            const campoEditar = document.createElement("input");

            campoEditar.type = "text";
            campoEditar.value = tarea.texto;

            campoEditar.classList.add("editar-tarea");

            // Reemplazamos el texto por el campo de edición
            elementoTarea.replaceChild(campoEditar, textoTarea);

            // Seleccionamos automáticamente el texto
            campoEditar.focus();
            campoEditar.select();


            // =========================================
            // AUTOGUARDADO
            // =========================================

            campoEditar.addEventListener("blur", function () {

                const nuevoTexto = campoEditar.value.trim();

                // Si escribió algo, actualizamos la tarea
                if (nuevoTexto !== "") {
                    tarea.texto = nuevoTexto;
                }

                // Volvemos a mostrar la lista
                mostrarTareas();
            });


            // También permitimos guardar con Enter
            campoEditar.addEventListener("keydown", function (evento) {

                if (evento.key === "Enter") {
                    campoEditar.blur();
                }
            });
        });


        // =========================================
        // DELETE - ELIMINAR TAREA
        // =========================================

        const botonEliminar = document.createElement("button");

        botonEliminar.classList.add("boton-eliminar");

        botonEliminar.innerHTML = "🗑️";

        botonEliminar.title = "Eliminar tarea";


        botonEliminar.addEventListener("click", function () {

            // Eliminamos la tarea del arreglo
            tareas = tareas.filter(function (elemento) {
                return elemento.id !== tarea.id;
            });

            // Actualizamos la pantalla
            mostrarTareas();
        });


        // =========================================
        // AGREGAR ELEMENTOS A LA TAREA
        // =========================================

        elementoTarea.appendChild(botonCompletar);
        elementoTarea.appendChild(textoTarea);
        elementoTarea.appendChild(botonEliminar);

        listaTareas.appendChild(elementoTarea);
    });
}


// =========================================
// MOSTRAR LA LISTA AL INICIAR
// =========================================

mostrarTareas();

