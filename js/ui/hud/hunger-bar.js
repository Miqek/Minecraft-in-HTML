/* js/ui/hud/hunger-bar.js — Indicador de muslos de hambre para modo Supervivencia | Provee: — | Requiere: HUD, inventory, width, height, survival, fill, ctx | Posee: renderizado de iconos de hambre en HUD | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/hunger-bar",
	order: 29.41,
	name: "Indicador de muslos de hambre",
	body: function () {
	HUD.register({
		name: "hunger-bar",
		modes: ["survival"],
		draw: function () {
			let s = inventory.size
			let hx = width / 2 - 9 / 2 * s + 25
			let hy = height - s * 1.5
			let q = Math.max(8, Math.round(s * 0.4))

			for (let i = 0; i < 10; i++) {
				let x = hx + 9 * s - (i + 1) * (q + 2) + 2
				let y = hy - q - 6
				fill(50, 30, 0)
				ctx.fillRect(x, y, q, q)
				let hg = survival.hunger - i * 2
				if (hg > 0) {
					fill(200, 130, 40)
					ctx.fillRect(hg >= 2 ? x : x + q / 2, y, hg >= 2 ? q : q / 2, q)
				}
			}
		}
	})
	}
})