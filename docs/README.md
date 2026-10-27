# Minecraft in HTML

Proyecto de un juego de bloques 3D inspirado en Minecraft, ejecutado en el navegador con HTML, CSS, JavaScript y WebGL. El repositorio conserva una versión original y una versión modular en desarrollo. No necesita Node.js ni un proceso de compilación para jugar.

## Empezar

- **Versión modular actual (V2.0):** abre `V2.0/js/bootstrap/index.html`.
- **Versión original:** abre `V2.0/Original/index.html`.
- **Versión modular anterior:** abre `index.html` en la raíz del repositorio.

También se puede servir el repositorio desde su raíz con `python -m http.server 8000` y visitar:

- `http://localhost:8000/V2.0/js/bootstrap/index.html`
- `http://localhost:8000/V2.0/Original/index.html`
- `http://localhost:8000/`

La versión modular actual carga los scripts desde `V2.0/js/bootstrap/loader.js` y utiliza la hoja compartida `styles/main.css`. Las fuentes, el favicon y algunos servicios externos pueden requerir conexión a Internet. Los mundos guardados se almacenan en IndexedDB, que depende del origen desde el que se abra la página; para guardar partidas, es preferible usar un servidor local.

## Mapa del repositorio

```text
Minecraft-in-HTML/
├── index.html                 Versión modular anterior; entrada en la raíz
├── Launcher.html              Generador de una página HTML autocontenida
├── manifest.json              Configuración del Launcher
├── styles/
│   └── main.css               Estilos compartidos
├── V2.0/
│   ├── Original/              Copia de referencia de la versión original
│   ├── docs/                  Arquitectura y guía de desarrollo
│   ├── dev/                   Verificaciones y protocolo de pruebas
│   └── js/                    Código modular de V2.0
└── README.md                  Guía general del repositorio
```

### Versiones

| Ruta | Qué contiene | Cuándo consultarla |
|---|---|---|
| `V2.0/js/` | Implementación modular actual del juego | Para jugar o modificar la versión actual. |
| `V2.0/Original/` | Implementación original, organizada en pocos archivos grandes | Para comparar el comportamiento y localizar la lógica de origen. Su entrada es `index.html`. |
| `index.html`, `js/` y `styles/` de la raíz | Versión modular anterior y sus recursos | Para consultar la versión previa o su Launcher. |

## Mapa de `V2.0/js/`

Los archivos se agrupan por responsabilidad. Si buscas una función concreta, empieza por la carpeta indicada y luego revisa el manifiesto para encontrar sus dependencias.

| Carpeta | Qué contiene / dónde buscar |
|---|---|
| `bootstrap/` | Inicio de V2.0. `index.html` define el canvas, elementos HTML y shaders; `loader.js` carga los módulos; `module-manifest.js` registra archivos y dependencias; `assembler.js` los ensambla y arranca el juego. |
| `core/` | Entorno compartido, constantes, ajustes y estado global (`environment.js`, `constants.js`, `settings.js`, `state.js`), eventos (`hooks.js`), inicialización y bucle (`init.js`, `game-loop.js`), métricas (`analytics.js`). |
| `utils/` | Herramientas generales: formato, vectores, hash aleatorio y generadores de ruido Perlin/Simplex. |
| `blocks/` | Registro, propiedades, variantes y definiciones de bloques; datos de texturas y creación del atlas WebGL. Para añadir un bloque, revisar `block-registry.js`, `block-defs-*.js` y `texture-data-*.js`. |
| `render/` | Renderizado 2D/WebGL, shaders, contexto, cámara y matrices; geometría, mallas de bloques, iconos, fondos y renderizado del mundo. |
| `world/` | Mundo, chunks y secciones, colas, sombras, almacenamiento y formato de guardado. `worldgen/` agrupa generación de terreno, cuevas y árboles. |
| `physics/` | Movimiento y física del jugador, colisiones, gravedad y búsqueda de bloques mediante raycast. |
| `player/` | Estado, modos, inicialización y punto de aparición del jugador. |
| `controls/` | Entrada de usuario: teclado, ratón, rueda, movimiento, asignación de teclas, redimensionado y captura del puntero. |
| `interaction/` | Acciones de juego sobre bloques: romperlos y colocarlos. |
| `inventory/` | Estado del inventario, pilas de objetos, lógica de la hotbar e inventario creativo. |
| `gamemodes/` | Gestión de modos de juego. `creative.js` y `survival/` contienen la lógica de creativo y supervivencia. |
| `entities/` | Entidades del juego, su ciclo de vida y objetos soltados. |
| `audio/` | Gestor de audio, registro de sonidos y eventos asociados. |
| `ui/` | Gestión de escenas, layout, botones y sliders. `screens/` contiene menús y pantallas; `hud/`, la interfaz durante la partida. |

Los archivos con prefijo `_legacy-` conservan partes antiguas de supervivencia que todavía forman parte del ensamblado. No son carpetas temporales.

## Cómo arranca V2.0

1. El navegador abre `V2.0/js/bootstrap/index.html`.
2. `loader.js` lee `module-manifest.js` y carga los módulos respetando sus dependencias (`requires`).
3. Cada archivo registra una o más secciones de código en `window.MineKhanParts`.
4. `assembler.js` ordena las secciones por `order`, construye el ámbito compartido `MineKhan()` y ejecuta el bucle del juego.

Este ensamblado conserva variables compartidas entre secciones. El orden de carga del manifiesto resuelve dependencias entre archivos; el campo `order` determina el orden del código ensamblado. Al cambiar una sección, comprueba ambos aspectos y actualiza `module-manifest.js` si agregas un archivo nuevo.

### Puntos de entrada rápidos

- **Inicio y ciclo de juego:** `js/bootstrap/index.html`, `js/bootstrap/loader.js`, `js/bootstrap/assembler.js`, `js/core/init.js`, `js/core/game-loop.js`.
- **Shaders y aspecto de la niebla:** shaders en `js/bootstrap/index.html`; lógica de distancia y chunks en `js/world/world.js` y `js/world/chunk-queues.js`.
- **Texturas y bloques:** `js/blocks/texture-atlas.js`, `js/blocks/texture-data-*.js`, `js/blocks/block-defs-*.js`.
- **Generación del mundo:** `js/world/worldgen/terrain.js`, `js/world/worldgen/caves.js`, `js/world/worldgen/trees.js`.
- **Movimiento, controles e interacción:** `js/physics/`, `js/player/`, `js/controls/`, `js/interaction/`.
- **Menús e interfaz:** `js/ui/screens/`, `js/ui/hud/`, `js/ui/widgets/`.
- **Guardado de mundos:** `js/world/world-storage.js`, `js/world/world-save-format.js`.

## Desarrollo y comprobaciones

- La guía de arquitectura está en `V2.0/docs/ARCHITECTURE.md`; las convenciones de modularización, en `V2.0/docs/AI_GUIDE.md`.
- Ejecuta `node V2.0/dev/check-modules.js` desde la raíz para comprobar que los módulos y las rutas del manifiesto existen y que no hay identificadores u órdenes duplicados.
- `V2.0/dev/smoke-test.md` contiene comprobaciones manuales de las funciones principales del juego.
- La versión usa JavaScript clásico en el navegador; no hay `npm install` ni paso de build.
