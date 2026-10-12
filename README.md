# Minecraft-In-Html

Versión modular del Minecraft en HTML/JS original (`Minecraft.html`). El juego, su apariencia y su
comportamiento son los del archivo original: el código se ha **repartido, no reescrito**.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Punto de entrada. Mantiene el DOM, los shaders GLSL y carga el CSS y los scripts. |
| `styles/main.css` | Estilos extraídos del `<style>` original (incluye el `@import` de Google Fonts «Poppins»). |
| `js/textures.js` | Texturas procedurales (16×16 generadas por código), registro de bloques (blockData) y initTextures (atlas WebGL). |
| `js/world.js` | Entorno, hash y semilla, ruido (Perlin/OpenSimplex), persistencia en IndexedDB, cuevas, Section/Chunk/World y menú de mundos. |
| `js/player.js` | Estado del jugador (cámara, hitbox, inventario), romper/colocar bloques, HUD, hotbar e inventario, initPlayer. |
| `js/physics.js` | PVector, ray tracing de bloques, colisiones, contactos y gravedad. |
| `js/controls.js` | Pantallas/escenas, pointer lock, movimiento por teclado, widgets Slider/Button, eventos de ratón/teclado/rueda/resize y dibujo de cada pantalla. |
| `js/engine.js` | Helpers 2D, contexto WebGL, shaders, formas, iconos, matrices y Camera, dibujo de bloques, use2d/use3d, initWebgl e initBackgrounds. |
| `js/main.js` | Prelude global, estado y ajustes, play(), utilidades, carga, initEverything, bucle principal (gameLoop) y ENSAMBLADO de todas las secciones. |
| `manifest.json` | Declara `entrypoint` y los archivos excluidos de la versión autocontenida. |
| `Launcher.html` | Lee el manifiesto y genera una versión de **un solo HTML** (CSS y JS integrados). |
| `README.md` | Este archivo. |

## Cómo usarlo

1. **Jugar:** abre `index.html` con doble clic (no necesita servidor; usa `<script src>` clásicos).
2. **Versión autocontenida:** abre `Launcher.html`.
   - Con servidor (`python -m http.server` en esta carpeta) se construye solo.
   - Con doble clic (`file://`) el navegador impide leer archivos: pulsa *Seleccionar la carpeta del proyecto…*.
   - Luego *Abrir el juego* o *Descargar HTML autocontenido*.

## Cómo está dividido el JavaScript (importante si lo editas)

El original es **una sola función** `MineKhan()` con ~100 variables `let` compartidas. Separarla en `<script>`
independientes o en módulos ES rompería ese ámbito, así que cada `js/*.js` registra **secciones numeradas**
(`order`) en `window.MineKhanParts` y `js/main.js` las ensambla en el orden original y reconstruye
`function MineKhan()` con el texto exacto de cada sección.

- Cada archivo lista arriba sus secciones y las líneas que ocupaban en el HTML original.
- No cambies el `order` de una sección ni muevas código entre secciones sin entender el orden de ejecución:
  las variables `let`/`class` deben estar declaradas antes de usarse en tiempo de ejecución.
- `main.js` debe cargarse el último y todos los `js/*.js` deben estar presentes (si falta uno, lanza un error claro).

## Limitaciones

- Recursos externos que el juego sigue necesitando (no se incrustan): fuente Google Fonts, favicon de minecraft.net y el widget de arc.io.
- El Launcher solo integra archivos locales referenciados por el entrypoint; no detecta cargas dinámicas.
- Los mundos guardados usan IndexedDB, ligado al origen de la página (`file://`, `http://localhost`, `blob:`…).
  Si abres `Launcher.html` con doble clic, el botón *Abrir el juego* crea una pestaña `blob:` donde Chromium **deniega IndexedDB**
  (el juego arranca, pero no guarda mundos ni ajustes). Para guardar usa *Descargar HTML autocontenido* y abre ese archivo,
  `index.html` o sirve la carpeta por HTTP.
