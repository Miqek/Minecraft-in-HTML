/* js/ui/screens/placeholder-screens.js — Pantallas de transición y menús pendientes (Coming Soon, Multiplayer) | Provee: initPlaceholderButtons | Requiere: Button, width, height, changeScene, previousScreen | Posee: botones de menús provisionales | Origen: sección #27 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/placeholder-buttons",
	order: 27.50,
	name: "Botones de pantallas pendientes (coming soon y multiplayer)",
	body: function () {
	function initPlaceholderButtons() {
		Button.add(width / 2, 395, width / 3, 40, "Back", "comingsoon menu", r => changeScene(previousScreen))
		Button.add(width / 2, 395, width / 3, 40, "¯\\_(ツ)_/¯", "multiplayer menu", r => changeScene("main menu"))
	}
	}
})