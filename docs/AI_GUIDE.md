# Guía operativa para asistentes de IA y desarrollo

Esta guía define las instrucciones estrictas para ejecutar los prompts de refactorización sobre el código base de Minecraft-in-HTML.

---

## 1. Principio fundamental: Refactor puro

- **Prohibido alterar la lógica:** No se renombran variables, no se reestructuran algoritmos ni se moderniza la sintaxis.
- **Respeto de estilo:** Conservar tabuladores para la indentación y respetar la ausencia de puntos y coma en el código original.
- **Bugs preexistentes:** Si se detecta un error o comportamiento defectuoso en el código original, **no se arregla**. Se documenta en el apartado `E) Observaciones`.
- **Hoisting y prototipos:** Si un método de una clase debe moverse a otro archivo para cumplir los límites de tamaño o responsabilidad, debe asignarse externamente mediante la propiedad prototype:
  ```javascript
  Clase.prototype.metodo = function () {
    // cuerpo idéntico sin modificar
  }
  ```

---

## 2. Aislamiento del modo Supervivencia

Todo el código asociado a la modalidad de supervivencia (`gameMode`, `newGameMode`, `survival*`, `SURVIVAL_REACH`, `breakTime`, `blockName`, `survivalHUD`, etc.) no debe fragmentarse de forma prematura:
- Si aparece durante la división de secciones intermedias, debe mantenerse intacto y agruparse temporalmente en:
  - `gamemodes/survival/_legacy-survival.js`
  - `ui/hud/_legacy-survival-hud.js`
- Su modularización final se realiza exclusivamente en los prompts específicos (26 a 30).

---

## 3. Tamaño y granularidad de archivos

- **Línea objetivo:** Cada archivo nuevo debe situarse entre **50 y 300 líneas**.
- **Límite técnico:** Ningún archivo puede superar las **1000 líneas** (la herramienta `dev/check-modules.js` bloqueará la integración).
- **Responsabilidad única:** Un solo concepto funcional por archivo (una clase, un subsistema o un grupo cohesivo de helpers).

---

## 4. Estructura requerida en cada respuesta

Las respuestas de cada prompt deben entregarse estrictamente en este orden:

1. **A) Cada archivo:** Encabezado `### ruta/al/archivo.js` seguido del bloque de código completo sin abreviaciones.
2. **B) Filas para `bootstrap/module-manifest.js`:** Entradas en formato `{ id: "...", file: "...", requires: [...] }`.
3. **C) Secciones a eliminar del archivo original:** Indicación precisa de los números de sección o el archivo reducido si queda por debajo de 150 líneas.
4. **D) Filas para `docs/MODULE_MAP.md`:** Mapeo de la sección original hacia el nuevo módulo.
5. **E) Observaciones:** Registro de inconsistencias, dependencias implícitas o posibles bugs detectados.
