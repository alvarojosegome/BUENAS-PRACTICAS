"use client";

import { useState } from "react";

interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEditado, setTextoEditado] = useState("");

  const crearTarea = (evento: React.KeyboardEvent<HTMLInputElement>) => {
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

  const comenzarEdicion = (tarea: Tarea) => {
    setEditandoId(tarea.id);
    setTextoEditado(tarea.texto);
  };

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

  const cambiarCompletada = (id: number) => {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id
          ? { ...tarea, completada: !tarea.completada }
          : tarea
      )
    );
  };

  const eliminarTarea = (id: number) => {
    setTareas((actuales) =>
      actuales.filter((tarea) => tarea.id !== id)
    );
  };

  return (
    <main className="contenedor">
      <section className="lista-tareas">
        <h1>Mi Lista de Tareas</h1>

        <p className="descripcion">
          Organiza tus actividades de forma sencilla
        </p>

        <div className="entrada-tarea">
          <input
            type="text"
            placeholder="Escribe una tarea y presiona Enter..."
            autoComplete="off"
            value={nuevaTarea}
            onChange={(evento) => setNuevaTarea(evento.target.value)}
            onKeyDown={crearTarea}
          />
        </div>

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
                onClick={() => cambiarCompletada(tarea.id)}
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
                  onClick={() => comenzarEdicion(tarea)}
                >
                  {tarea.texto}
                </span>
              )}

              <button
                type="button"
                className="boton-eliminar"
                onClick={() => eliminarTarea(tarea.id)}
                title="Eliminar tarea"
                aria-label="Eliminar tarea"
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
    </main>
  );
}
