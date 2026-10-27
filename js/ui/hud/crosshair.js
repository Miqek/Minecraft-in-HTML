/* js/ui/hud/crosshair.js — Dibujo de la mira central (crosshair) en pantalla | Provee: drawCrosshair | Requiere: p, width, height, ctx | Posee: mira de puntería | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/crosshair",
	order: 29.12,
	name: "Dibujo de la mira central (drawCrosshair)",
	body: function () {
	function drawCrosshair() {
		if (!p.spectator) {
			let x = width / 2 + 0.5
			let y = height / 2 + 0.5

			ctx.lineWidth = 1
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.moveTo(x - 10, y)
			ctx.lineTo(x + 10, y)
			ctx.moveTo(x, y - 10)
			ctx.lineTo(x + 10, y)
			ctx.stroke()
		}
	}
	}
})