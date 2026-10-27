# Arquitectura de Minecraft-in-HTML (MineKhan Modular)

Este documento detalla el modelo de ejecución, la jerarquía de dependencias y los mecanismos de ensamblado del proyecto Minecraft-in-HTML (JSCraft/MineKhan).

---

## 1. Modelo de ejecución y ámbito compartido

El juego completo se ejecuta dentro del ámbito léxico de una única función contenedora: `function MineKhan() { ... }`.

- **Entorno:** JavaScript vanilla sin empaquetadores (webpack, vite, esbuild) ni módulos ES (`import`/`export`).
- **Ámbito compartido:** Las variables principales (`world`, `p`, `gl`, `blockData`, `settings`, etc.) residen en el cierre local de `MineKhan()`.
- **Registro de fragmentos:** Cada script modular se carga mediante etiquetas `<script>` en el navegador y registra su contenido en el array global:
  ```javascript
  window.MineKhanParts.push({
    id: "subcarpeta/archivo",
    order: 16.20,
    name: "Nombre descriptivo",
    body: function () {
  // Código exacto de la sección sin alteraciones
    }
  })
  ```
- **Ensamblado (`bootstrap/assembler.js`):**
  1. Ordena `window.MineKhanParts` de menor a mayor según la propiedad numérica `order`.
  2. Extrae el texto fuente de cada función `body` (el contenido situado entre la primera llave `{` y la última llave `}`, descartando el primer y último carácter para no duplicar saltos ni envoltorios).
  3. Concatena los cuerpos en una única cadena: `"function MineKhan() {\n" + bodies + "\n}"`.
  4. Inyecta y ejecuta el script resultante en el DOM con su correspondiente atributo `//# sourceURL=MineKhan.assembled.js`.
  5. La última sección ejecutada (`order: 40`) retorna la función `gameLoop`.

---

## 2. Jerarquía de capas y regla unidireccional

El código está estructurado en capas estrictas. Una capa solo puede acceder a elementos declarados en las capas anteriores:
bootstrap
└── core
└── utils
└── blocks
└── render / world / physics
└── player / inventory
└── interaction
└── gamemodes / entities / audio
└── controls
└── ui

text

### Reglas de comunicación:
1. **Flujo descendente directo:** Un módulo de `player` puede invocar funciones o leer variables de `physics`, `world`, `blocks`, `utils` o `core`.
2. **Flujo ascendente mediante hooks (`core/hooks.js`):** Una capa inferior **nunca** invoca directamente a una capa superior. Si una capa inferior necesita notificar un evento (por ejemplo, `world` informando de un bloque modificado o `physics` notificando daño), debe emitirlo mediante el bus de eventos desacoplado en `core/hooks.js`.
3. **Archivos globales:** Los scripts en `bootstrap/*` y el preludio de `core/environment.js` son globales y no se envuelven en `MineKhanParts.push`.

---

## 3. Esquema de `order` y reglas de hoisting

Cada bloque registrado posee un valor numérico `order`:
$$\text{order} = \text{Nº de sección original (1 a 40)} + \text{decimal de subdivisión}$$

Por ejemplo, la sección original `#16` (shaders, formas y cámara) se subdivide en:
- `16.10`: Shaders GLSL y compilación de programas
- `16.20`: Definición de geometría y formas base
- `16.30`: Generación de iconos de bloques
- `16.40`: Matriz y transformaciones lineales
- `16.50`: Planos de frustum y clase Camera

### Hoisting y Temporal Dead Zone (TDZ):
- Las declaraciones `function nombre() {}` sufren hoisting al inicio del ámbito de `MineKhan()`.
- Las declaraciones `let`, `const` y `class` **no** se elevan antes de su ejecución textual y entran en TDZ. Por tanto, el valor de `order` debe garantizar que cualquier variable o clase sea declarada antes del primer punto donde se utilice.
- El orden `40.00` (`return gameLoop`) debe ser siempre el último módulo registrado.

---

## 4. Convención de cabeceras de módulo

Cada archivo de código que integre `MineKhanParts` debe comenzar con la siguiente cabecera informativa:
```javascript
/* ruta — descripción | Provee: símbolo1, símbolo2 | Requiere: símboloA, símboloB | Posee: contexto | Origen: sección #N de js/x.js */
```