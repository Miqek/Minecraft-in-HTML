/* js/core/settings.js — Configuración y ajustes del juego | Provee: settings | Requiere: — | Posee: renderDistance, fov, mouseSense | Origen: sección #09 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/settings",
	order: 9.10,
	name: "Ajustes y configuración del juego",
	body: function () {
	let settings = {
		renderDistance: 10,
		fov: 70, 
		mouseSense: 100 
	}
	}
})