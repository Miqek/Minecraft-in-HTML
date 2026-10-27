/* js/ui/hud/mining-progress.js — Barra de progreso visual al minar bloques en modo Supervivencia | Provee: — | Requiere: HUD, width, height, survival, fill, ctx | Posee: barra de progreso de rotura de bloque | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/mining-progress",
	order: 29.44,
	name: "Barra de progreso de minado",
	body: function () {
	HUD.register({
		name: "mining-progress",
		modes: ["survival"],
		draw: function () {
			if (survival.mineProgress > 0) {
				let bx = width / 2 - 30
				let by = height / 2 + 20
				fill(0)
				ctx.fillRect(bx - 1, by - 1, 62, 7)
				fill(255)
				ctx.fillRect(bx, by, 60 * survival.mineProgress, 5)
			}
			ctx.textAlign = "left"
		}
	})
	}
})