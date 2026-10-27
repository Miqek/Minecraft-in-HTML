/* js/ui/hud/_legacy-survival-hud.js — Elementos visuales legacy de supervivencia (corazones, hambre, minado) | Provee: survivalHUD | Requiere: inventory, width, height, survival, ctx, fill, textSize, text | Posee: indicadores de salud, alimento y minado | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/legacy-survival-hud",
	order: 29.50,
	name: "HUD del modo Supervivencia (survivalHUD)",
	body: function () {
	// HUD propio del modo Supervivencia: corazones, hambre, contadores, manzanas, minado y destello de daño
	function survivalHUD() {
		let s = inventory.size
		let hx = width / 2 - 9 / 2 * s + 25 // borde izquierdo de la hotbar
		let hy = height - s * 1.5            // borde superior de la hotbar
		let q = Math.max(8, Math.round(s * 0.4))

		if (Date.now() < survival.hurtUntil) {
			ctx.fillStyle = "rgba(200, 0, 0, 0.3)"
			ctx.fillRect(0, 0, width, height)
		}

		// Corazones
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

		// Hambre (alineada a la derecha de la hotbar)
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

		// Contadores de la hotbar
		textSize(12)
		fill(255)
		ctx.textAlign = "right"
		for (let i = 0; i < inventory.hotbar.length; i++) {
			let id = inventory.hotbar[i]
			if (id && survival.counts[id]) {
				text(String(survival.counts[id]), hx + (i + 1) * s - 3, hy + s - 4)
			}
		}

		// Manzanas
		ctx.textAlign = "left"
		text("Apples: " + survival.food + (survival.food > 0 ? " (F to eat)" : ""), hx, hy - q - 12)

		// Progreso de minado
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
	}
})