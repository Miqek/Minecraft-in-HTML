# Protocolo de Smoke Test (20 Comprobaciones)

Este protocolo debe ejecutarse antes y después de cada bloque de refactorización para garantizar que no se introduzcan regresiones.

| Nº | Caso de prueba | Procedimiento | Resultado esperado |
|---|---|---|---|
| 01 | Crear nuevo mundo | Ir a Singleplayer -> Create New World -> Nombre "TestWorld" -> Create. | El mundo se genera, se muestran chunks y el jugador aparece en el spawn. |
| 02 | Guardar mundo | Presionar P o ESC -> Botón "Save". | El botón muestra la fecha de guardado actualizada y se persiste en IndexedDB. |
| 03 | Cargar mundo guardado | Volver a Main Menu -> Singleplayer -> Seleccionar "TestWorld" -> Play Selected World. | El mundo y la posición del jugador se recuperan fielmente. |
| 04 | Exportar código | En Singleplayer, seleccionar mundo -> Pulsar "Export". | El campo de texto superior se llena con el string base64/texto exportable del mundo. |
| 05 | Romper bloque | En modo Creativo, situarse frente a un bloque y hacer clic izquierdo. | El bloque desaparece instantáneamente sin retraso ni tiempo de minado. |
| 06 | Colocar bloque cúbico | Con un bloque seleccionado en la hotbar, hacer clic derecho sobre una cara expuesta. | El cubo se posiciona adyacente a la cara apuntada y genera oclusión visual. |
| 07 | Colocar losa | Pulsar ENTER hasta modo SLAB. Clic derecho en la mitad superior e inferior de un bloque. | Se colocan losas bajas o invertidas (FLIP) según el punto de colisión de la cara. |
| 08 | Colocar escalera | Pulsar ENTER hasta modo STAIR. Apuntar en cuatro direcciones cardinales y colocar. | Las escaleras se orientan correctamente hacia el jugador respetando la rotación. |
| 09 | Vuelo en Creativo | Pulsar la barra espaciadora dos veces consecutivas. | El jugador levita; espacio asciende, shift desciende; no sufre gravedad. |
| 10 | Sprint | Mantener tecla W y presionar Q (o doble toque rápido de W). | La velocidad de movimiento aumenta y el FOV se expande dinámicamente. |
| 11 | Agacharse (Sneak) | Mantener SHIFT cerca del borde de un bloque. | La cámara desciende ligeramente y el jugador no se cae por los precipicios. |
| 12 | Modo espectador | En modo Creativo, pulsar la tecla L. | El jugador puede atravesar bloques sin colisión ni raycast reactivo. |
| 13 | Pausar juego | Presionar la tecla P o la tecla ESC durante la partida. | Se libera el puntero del ratón (pointer lock) y se dibuja el menú de pausa. |
| 14 | Menú de opciones | Ir a Options -> Ajustar FOV, Render Distance y Mouse Sensitivity -> Back. | Los ajustes se aplican en tiempo real al renderizador y a la cámara. |
| 15 | Redimensión de ventana | Modificar el tamaño de la ventana del navegador. | El canvas 2D y el viewport WebGL ajustan su resolución sin deformar el aspecto. |
| 16 | Inventario creativo | Presionar la tecla E. Clic sobre un bloque de la paleta y colocarlo en la hotbar. | La cuadrícula muestra los bloques disponibles y permite transferirlos a los 9 slots. |
| 17 | Supervivencia: Daño | En modo Survival, saltar desde una altura superior a 4 bloques. | El jugador emite destello rojo en el HUD y pierde corazones proporcionales a la caída. |
| 18 | Supervivencia: Hambre | En modo Survival, correr hasta agotar saturación y pulsar F con manzanas. | La barra de muslos disminuye con el esfuerzo y se restablece al comer (tecla F). |
| 19 | Supervivencia: Muerte | En modo Survival, caer al vacío ($Y < -10$). | Aparece la pantalla de muerte ("dead"); pulsar "Respawn" devuelve al jugador al spawn con vida llena. |
| 20 | Barra de acceso rápido | Desplazar la rueda del ratón o pulsar números del 1 al 9. | El selector blanco de la hotbar rota cíclicamente y actualiza el bloque activo. |