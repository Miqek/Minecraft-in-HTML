/* js/ui/hud/experience-bar.js — Barra de nivel y progreso de experiencia del jugador | Provee: — | Requiere: HUD, inventory, width, height, ctx | Posee: componente visual de experiencia | Origen: nuevo (arquitectura HUD modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/experience-bar",
	order: 29.45,
	name: "Barra de experiencia de supervivencia",
	body: function () {
	HUD.register({
		name: "experience-bar",
		modes: ["survival"],
		draw: function () {
			let s = inventory.size
			let hx = width / 2 - 9 / 2 * s + 25
			let hy = height - s * 1.5
			// Componente preparado para renderizado sobre la hotbar
		}
	})
	}
})