/* js/inventory/creative-inventory.js — Renderizado e interacción del inventario creativo | Provee: drawInv, clickInv | Requiere: inventory, gl, ctx, canvas, FOV, mouseX, mouseY, BLOCK_COUNT, drawIcon, hotbar, drawScreens | Posee: pantalla y eventos del inventario creativo | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "inventory/creative-inventory",
	order: 29.30,
	name: "Pantalla e interacción del inventario creativo (drawInv, clickInv)",
	body: function () {
	function drawInv() {
		let x = 0
		let y = 0
		let s = inventory.size
		let s2 = s / 2
		let perRow = 13

		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		ctx.fillStyle = "rgb(127, 127, 127)"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		FOV(90)

		// Draw the grid
		ctx.lineWidth = 1
		ctx.strokeStyle = "black"
		ctx.beginPath()
		for (y = 0; y < 10; y++) {
			ctx.moveTo(50.5 - s2, 50.5 - s2 + y * s)
			ctx.lineTo(50.5 - s2 + s * perRow, 50.5 - s2 + y * s)
		}
		y--
		for (x = 0; x < perRow + 1; x++) {
			ctx.moveTo(50.5 - s2 + s * x, 50.5 - s2)
			ctx.lineTo(50.5 - s2 + s * x, 50.5 - s2 + y * s)
		}

		// Hotbar
		x = width / 2 - inventory.hotbar.length / 2 * s + 0.5 + 25
		y = height - s * 1.5 + 0.5
		ctx.moveTo(x, y)
		ctx.lineTo(x + s * 9, y)
		ctx.moveTo(x, y + s)
		ctx.lineTo(x + s * 9, y + s)
		for(let i = 0; i <= inventory.hotbar.length; i ++) {
			ctx.moveTo(x + i * s, y)
			ctx.lineTo(x + i * s, y + s)
		}
		ctx.stroke()

		let overHot = (mouseX - x) / s | 0
		if (mouseX < x + 9 * s && mouseX > x && mouseY > y && mouseY < y + s) {
			x += s * overHot
			ctx.lineWidth = 2
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.strokeRect(x, y, s, s)
		}

		//Box highlight in inv
		let overInv = Math.round((mouseY - 50) / s) * perRow + Math.round((mouseX - 50) / s)
		if (overInv >= 0 && overInv < BLOCK_COUNT - 1 && mouseX < 50 - s2 + perRow * s && mouseX > 50 - s2) {
			x = overInv % perRow * s + 50 - s2
			y = (overInv / perRow | 0) * s + 50 - s2
			ctx.lineWidth = 2
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.strokeRect(x, y, s, s)
		}

		if (inventory.holding) {
			drawIcon(mouseX, mouseY, inventory.holding)
		}
		for (let i = 1; i < BLOCK_COUNT; i++) {
			x = (i - 1) % perRow * s + 50
			y = ((i - 1) / perRow | 0) * s + 50
			drawIcon(x, y, i)
		}

		hotbar()
		//hud()
		ctx.drawImage(gl.canvas, 0, 0)
	}
	function clickInv() {
		let s = inventory.size
		let s2 = s / 2
		let perRow = 13
		let over = Math.round((mouseY - 50) / s) * perRow + Math.round((mouseX - 50) / s)
		let x = width / 2 - 9 / 2 * s + 25
		let y = height - s * 1.5
		let overHot = (mouseX - x) / s | 0
		if (mouseX < x + 9 * s && mouseX > x && mouseY > y && mouseY < y + s) {
			let temp = inventory.hotbar[overHot]
			inventory.hotbar[overHot] = inventory.holding
			inventory.holding = temp
		} else if (over >= 0 && over < BLOCK_COUNT - 1 && mouseX < 50 - s2 + perRow * s && mouseX > 50 - s2) {
			inventory.holding = over + 1
		} else {
			inventory.holding = 0
		}

		drawScreens.inventory()
	}
	}
})