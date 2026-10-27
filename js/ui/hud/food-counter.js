/* js/ui/hud/food-counter.js — Contador de manzanas y recordatorio de tecla para comer | Provee: — | Requiere: HUD, inventory, width, height, survival, ctx, text | Posee: texto de reserva de comida | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/food-counter",
	order: 29.43,
	name: "Contador de comida y manzanas",
	body: function () {
	HUD.register({
		name: "food-counter",
		modes: ["survival"],
		draw: function () {
			let s = inventory.size
			let hx = width / 2 - 9 / 2 * s + 25
			let hy = height - s * 1.5
			let q = Math.max(8, Math.round(s * 0.4))

			ctx.textAlign = "left"
			text("Apples: " + survival.food + (survival.food > 0 ? " (F to eat)" : ""), hx, hy - q - 12)
		}
	})
	}
})