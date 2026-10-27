/* js/ui/hud/hotbar-bar.js — Renderizado de iconos y marco de la barra de acceso rápido (hotbar) | Provee: hotbar, drawHotbarFrame | Requiere: FOV, inventory, width, height, drawIcon, ctx | Posee: capas de iconos y ranuras de la hotbar | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/hotbar-bar",
	order: 29.10,
	name: "Iconos y marco de la hotbar (hotbar, drawHotbarFrame)",
	body: function () {
	function hotbar() {
		FOV(90)

		for(let i = 0; i < inventory.hotbar.length; i ++) {
			if(inventory.hotbar[i]) {
				let x = width / 2 - inventory.hotbar.length / 2 * inventory.size + (i + 0.5) * inventory.size + 25
				let y = height - inventory.size
				drawIcon(x, y, inventory.hotbar[i])
			}
		}
	}

	function drawHotbarFrame() {
		let s = inventory.size
		let x = width / 2 - 9 / 2 * s + 0.5 + 25
		let y = height - s * 1.5 + 0.5

		ctx.strokeStyle = "black"
		ctx.lineWidth = 2
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + s * 9, y)
		ctx.moveTo(x, y + s)
		ctx.lineTo(x + s * 9, y + s)
		for(let i = 0; i <= 9; i++) {
			ctx.moveTo(x + i * s, y)
			ctx.lineTo(x + i * s, y + s)
		}
		ctx.stroke()

		ctx.strokeStyle = "white"
		ctx.lineWidth = 2
		ctx.beginPath()

		ctx.strokeRect(width / 2 - 9 / 2 * s + inventory.hotbarSlot * s + 25, height - s * 1.5, s, s)
	}
	}
})