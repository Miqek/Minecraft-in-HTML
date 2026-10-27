/* js/ui/hud/item-counts.js — Indicadores numéricos de cantidad de bloques en la hotbar | Provee: — | Requiere: HUD, inventory, width, height, survival, textSize, fill, ctx, text | Posee: renderizado de números de pila en hotbar | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/item-counts",
	order: 29.42,
	name: "Contadores numéricos de ítems en la hotbar",
	body: function () {
	HUD.register({
		name: "item-counts",
		modes: ["survival"],
		draw: function () {
			let s = inventory.size
			let hx = width / 2 - 9 / 2 * s + 25
			let hy = height - s * 1.5

			textSize(12)
			fill(255)
			ctx.textAlign = "right"
			for (let i = 0; i < inventory.hotbar.length; i++) {
				let id = inventory.hotbar[i]
				if (id && survival.counts[id]) {
					text(String(survival.counts[id]), hx + (i + 1) * s - 3, hy + s - 4)
				}
			}
		}
	})
	}
})