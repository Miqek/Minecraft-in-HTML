# Minecraft in HTML

**Minecraft in HTML** es un proyecto open-source con finalidad académica que recrea una versión jugable de Minecraft utilizando tecnologías web: HTML, CSS y JavaScript.

A diferencia de otros proyectos que concentran todo el juego en un único archivo, este repositorio organiza el código en módulos separados. El archivo **`Launcher.html`** actúa como punto de entrada: al abrirlo en Google Chrome, carga e integra los distintos módulos del proyecto para ejecutar el juego en una pestaña del navegador.

El proyecto está inspirado en [Minecraft-In-HTML](https://github.com/11lightning11/Minecraft-In-Html), pero ha sido reorganizado y mejorado para tener una estructura más clara, modular y fácil de estudiar.

> Este proyecto se ha creado con fines educativos y de aprendizaje. No pretende sustituir a Minecraft ni distribuir sus recursos originales. Su objetivo es aprender programación web, organización de código, arquitectura de software y desarrollo en Visual Studio Code a partir de un proyecto motivador.

---

## Objetivo del proyecto

El propósito principal es aprender a programar mediante un proyecto real y divertido: recrear la lógica básica de Minecraft en el navegador.

Durante el desarrollo se practican conceptos como:

- Programación en JavaScript modular.
- Estructura de un proyecto web con HTML, CSS y JS.
- Renderizado y representación de un mundo 3D.
- Física, colisiones y movimiento del jugador.
- Generación y gestión de bloques.
- Controles de teclado y ratón.
- Interfaz de usuario, inventario y modos de juego.
- Organización de un repositorio open-source.
- Uso de Visual Studio Code como entorno de desarrollo.

El proyecto no busca ser una copia exacta de Minecraft, sino una recreación académica que permita entender cómo funciona un juego de este tipo por dentro.

---

## Cómo jugar

No es necesario instalar nada.

1. Descarga el archivo **`Launcher.html`** desde este repositorio.
2. Guárdalo en una carpeta de tu ordenador.
3. Haz doble clic sobre él o ábrelo con **Google Chrome**.
4. El launcher cargará los módulos necesarios del proyecto y abrirá el juego en una pestaña de Chrome.

No hace falta instalar Node.js, Python, servidores locales ni dependencias adicionales para jugar.

> Recomendación: utiliza Google Chrome o un navegador basado en Chromium actualizado para obtener la mejor compatibilidad.

---

## Instalación para desarrolladores

Si quieres explorar, modificar o estudiar el código:

1. Clona el repositorio:

```bash
git clone [https://github.com/Miqek/Minecraft-in-HTML.git](https://github.com/Miqek/Minecraft-in-HTML.git)
```

2. Abre la carpeta del proyecto en **Visual Studio Code**.

3. Abre `Launcher.html` en el navegador para ejecutar el juego.

4. Edita los módulos JavaScript dentro de la carpeta `js/` para modificar el comportamiento del juego.

El proyecto está diseñado para poder leerse por módulos: cada carpeta agrupa una parte concreta del juego, en lugar de tener todo el código mezclado en un único archivo.

---

Cada subcarpeta de `/js` incluye su propio README con la explicación de sus archivos, sus dependencias y su relación con el resto del proyecto: [audio](../js/audio/README_audio.md), [blocks](../js/blocks/README_blocks.md), [bootstrap](../js/bootstrap/README_bootstrap.md), [controls](../js/controls/README_controls.md), [core](../js/core/README_core.md), [entities](../js/entities/README_entities.md), [gamemodes](../js/gamemodes/README_gamemodes.md), [interaction](../js/interaction/README_interaction.md), [inventory](../js/inventory/README_inventory.md), [physics](../js/physics/README_physics.md), [player](../js/player/README_player.md), [render](../js/render/README_render.md), [ui](../js/ui/README_ui.md), [utils](../js/utils/README_utils.md) y [world](../js/world/README_world.md). Conviene consultar primero el README del módulo antes de modificar o analizar cualquiera de sus archivos.

---

## Estructura del proyecto

```text
Minecraft-in-HTML/
│
├── Launcher.html
├── dev/
├── docs/
└── js/
    ├── audio/
    ├── blocks/
    ├── bootstrap/
    ├── controls/
    ├── core/
    ├── entities/
    ├── gamemodes/
    ├── interaction/
    ├── inventory/
    ├── physics/
    ├── player/
    ├── render/
    ├── ui/
    ├── utils/
    └── world/
```

### Archivo principal

| Ruta | Descripción |
|---|---|
| `Launcher.html` | Punto de entrada del proyecto. Es el archivo que el usuario descarga y abre en Chrome. Se encarga de cargar e integrar los módulos JavaScript del juego. |

### Carpetas de soporte

| Carpeta | Descripción |
|---|---|
| `dev/` | Contiene herramientas y documentación orientadas al desarrollo y la comprobación del proyecto. |
| `dev/check-modules.js` | Script de desarrollo utilizado para comprobar la estructura o integridad de los módulos. |
| `dev/smoke-test.md` | Documentación de pruebas básicas para verificar que el proyecto funciona correctamente. |
| `docs/` | Documentación adicional del proyecto. |
| `docs/README.md` | Documentación técnica complementaria al README principal. |

### Módulos del juego

El código del juego se encuentra dentro de `js/`. Cada carpeta agrupa una responsabilidad concreta.

| Carpeta | Función |
|---|---|
| `js/audio/` | Gestión del sonido y efectos de audio del juego. |
| `js/blocks/` | Definición y comportamiento de los bloques: tipos, propiedades e interacciones. |
| `js/bootstrap/` | Inicialización del juego y carga de los sistemas necesarios antes de empezar a jugar. |
| `js/controls/` | Captura y gestión de los controles del jugador, como teclado, ratón y acciones del juego. |
| `js/core/` | Lógica central y sistemas base que dan soporte al funcionamiento general del juego. |
| `js/entities/` | Gestión de entidades presentes en el mundo, como objetos o elementos dinámicos. |
| `js/gamemodes/` | Implementación de los distintos modos de juego disponibles. |
| `js/interaction/` | Interacciones del jugador con el mundo, como colocar o romper bloques. |
| `js/inventory/` | Sistema de inventario: objetos, selección y gestión de los elementos del jugador. |
| `js/physics/` | Física del juego: gravedad, movimiento, colisiones y comportamiento de los cuerpos en el mundo. |
| `js/player/` | Estado y comportamiento del jugador: posición, cámara, acciones y características principales. |
| `js/render/` | Renderizado del mundo, bloques, entidades y elementos visuales en el navegador. |
| `js/ui/` | Interfaz de usuario: menús, HUD, textos, botones y elementos visuales de interacción. |
| `js/utils/` | Funciones auxiliares y herramientas reutilizables por otros módulos. |
| `js/world/` | Generación, almacenamiento y gestión del mundo: terreno, chunks y distribución de bloques. |

---

## Arquitectura general

El proyecto sigue una arquitectura modular:

```text
Launcher.html
      │
      ▼
Bootstrap e inicialización
      │
      ▼
Mundo generado
      │
      ▼
Renderizado + física + controles
      │
      ▼
Interacción del jugador
      │
      ▼
Inventario, bloques y interfaz
```

En lugar de escribir todo el juego en un solo archivo, cada sistema tiene su propio módulo. Esto hace que el código sea más fácil de entender, mantener, depurar y ampliar.

Por ejemplo:

- `world/` se encarga del mundo.
- `player/` se encarga del jugador.
- `physics/` se encarga del movimiento y las colisiones.
- `render/` se encarga de mostrar todo en pantalla.
- `ui/` se encarga de lo que ve el usuario fuera del mundo 3D.

---

## Tecnologías utilizadas

- **HTML5**: estructura y punto de entrada del juego.
- **CSS**: estilos e interfaz visual.
- **JavaScript**: lógica principal del juego.
- **Visual Studio Code**: entorno de desarrollo recomendado.
- **Git y GitHub**: control de versiones y publicación del proyecto.

---

## Licencia y uso académico

Este proyecto es open-source y tiene una finalidad claramente educativa.

Se ha desarrollado para aprender programación, estructura de software y desarrollo de videojuegos en el navegador. No está asociado oficialmente a Mojang, Microsoft ni Minecraft.

Los nombres, marcas y conceptos relacionados con Minecraft pertenecen a sus respectivos propietarios. Este repositorio no distribuye recursos originales del juego ni pretende competir con él.

---

## Autor

Proyecto creado y mantenido por [Miqek](https://github.com/Miqek).

Repositorio:  
https://github.com/Miqek/Minecraft-in-HTML