/* js/ui/hud/health-hearts.js — Indicador de corazones de salud para modo Supervivencia | Provee: — | Requiere: HUD, inventory, width, height, survival, fill, ctx | Posee: renderizado de corazones en HUD | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/health-hearts",
	order: 29.40,
	name: "Indicador de corazones de salud",
	body: function () {
	HUD.register({
		name: "health-hearts",
		modes: ["survival"],
		draw: function () {
			let s = inventory.size
			let hx = width / 2 - 9 / 2 * s + 25
			let hy = height - s * 1.5
			let q = Math.max(8, Math.round(s * 0.4))

			for (let i = 0; i < 10; i++) {
				let x = hx + i * (q + 2)
				let y = hy - q - 6
				fill(50, 0, 0)
				ctx.fillRect(x, y, q, q)
				let hp = survival.health - i * 2
				if (hp > 0) {
					fill(220, 30, 30)
					ctx.fillRect(x, y, hp >= 2 ? q : q / 2, q)
				}
			}
		}
	})
	}
})