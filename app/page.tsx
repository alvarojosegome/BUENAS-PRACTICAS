"use client";

import { useState } from "react";

interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [papelera, setPapelera] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState("");

  // Contadores
  const tareasRealizadas = tareas.filter(
    (tarea) => tarea.completada
  ).length;

  const tareasPorRealizar = tareas.filter(
    (tarea) => !tarea.completada
  ).length;

  // Crear tarea
  const crearTarea = (
    evento: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (evento.key === "Enter") {
      const texto = nuevaTarea.trim();

      if (texto === "") return;

      const nueva: Tarea = {
        id: Date.now(),
        texto,
        completada: false,
      };

      setTareas((actuales) => [...actuales, nueva]);
      setNuevaTarea("");
    }
  };

  // Comenzar edición
  const comenzarEdicion = (tarea: Tarea) => {
    setEditandoId(tarea.id);
    setTextoEditado(tarea.texto);
  };

  // Guardar edición
  const guardarEdicion = () => {
    if (editandoId === null) return;

    const nuevoTexto = textoEditado.trim();

    if (nuevoTexto !== "") {
      setTareas((actuales) =>
        actuales.map((tarea) =>
          tarea.id === editandoId
            ? { ...tarea, texto: nuevoTexto }
            : tarea
        )
      );
    }

    setEditandoId(null);
    setTextoEditado("");
  };

  // Cambiar estado de completada
  const cambiarCompletada = (id: number) => {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      )
    );
  };

  // Mover tarea a la papelera
  const eliminarTarea = (id: number) => {
    const tareaAEliminar = tareas.find(
      (tarea) => tarea.id === id
    );

    if (!tareaAEliminar) return;

    setPapelera((actuales) => [
      ...actuales,
      tareaAEliminar,
    ]);

    setTareas((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    );
  };

  // Restaurar tarea desde la papelera
  const restaurarTarea = (id: number) => {
    const tareaARestaurar = papelera.find(
      (tarea) => tarea.id === id
    );

    if (!tareaARestaurar) return;

    setTareas((actuales) => [
      ...actuales,
      tareaARestaurar,
    ]);

    setPapelera((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    );
  };

  // Eliminar definitivamente
  const eliminarDefinitivamente = (id: number) => {
    setPapelera((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    );
  };

  // Vaciar papelera
  const vaciarPapelera = () => {
    setPapelera([]);
  };

  return (
    <main className="contenedor">
      <section className="lista-tareas">
        <h1>Mi Lista de Tareas</h1>

        <p className="descripcion">
          Organiza tus actividades de forma sencilla
        </p>

        {/* Contadores */}
        <div className="contadores">
          <div className="contador pendientes">
            <span className="numero">
              {tareasPorRealizar}
            </span>
            <span className="texto">
              Por realizar
            </span>
          </div>

          <div className="contador realizadas">
            <span className="numero">
              {tareasRealizadas}
            </span>
            <span className="texto">
              Realizadas
            </span>
          </div>
        </div>

        {/* Entrada de nueva tarea */}
        <div className="entrada-tarea">
          <input
            type="text"
            placeholder="Escribe una tarea y presiona Enter..."
            autoComplete="off"
            value={nuevaTarea}
            onChange={(evento) =>
              setNuevaTarea(evento.target.value)
            }
            onKeyDown={crearTarea}
          />
        </div>

        {/* Lista de tareas */}
        <div className="tareas">
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className={`tarea ${
                tarea.completada ? "completada" : ""
              }`}
            >
              <button
                type="button"
                className="boton-completar"
                onClick={() =>
                  cambiarCompletada(tarea.id)
                }
                aria-label="Completar tarea"
              >
                {tarea.completada ? "✓" : ""}
              </button>

              {editandoId === tarea.id ? (
                <input
                  className="editar-tarea"
                  type="text"
                  value={textoEditado}
                  autoFocus
                  onChange={(evento) =>
                    setTextoEditado(evento.target.value)
                  }
                  onBlur={guardarEdicion}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter") {
                      evento.currentTarget.blur();
                    }
                  }}
                />
              ) : (
                <span
                  className="texto-tarea"
                  onClick={() =>
                    comenzarEdicion(tarea)
                  }
                >
                  {tarea.texto}
                </span>
              )}

              <button
                type="button"
                className="boton-eliminar"
                onClick={() =>
                  eliminarTarea(tarea.id)
                }
                title="Mover a la papelera"
                aria-label="Mover a la papelera"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {tareas.length === 0 && (
          <p className="mensaje-vacio">
            No tienes tareas pendientes.
          </p>
        )}
      </section>

      {/* PAPELERA */}
      <section className="papelera">
        <div className="encabezado-papelera">
          <div>
            <h2>🗑️ Papelera</h2>
            <p>
              {papelera.length}{" "}
              {papelera.length === 1
                ? "tarea eliminada"
                : "tareas eliminadas"}
            </p>
          </div>

          {papelera.length > 0 && (
            <button
              type="button"
              className="boton-vaciar"
              onClick={vaciarPapelera}
            >
              Vaciar papelera
            </button>
          )}
        </div>

        {papelera.length === 0 ? (
          <p className="papelera-vacia">
            La papelera está vacía.
          </p>
        ) : (
          <div className="tareas-papelera">
            {papelera.map((tarea) => (
              <div
                className="tarea-papelera"
                key={tarea.id}
              >
                <span>{tarea.texto}</span>

                <div className="acciones-papelera">
                  <button
                    type="button"
                    onClick={() =>
                      restaurarTarea(tarea.id)
                    }
                    title="Restaurar tarea"
                  >
                    ↩️
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      eliminarDefinitivamente(tarea.id)
                    }
                    title="Eliminar definitivamente"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

