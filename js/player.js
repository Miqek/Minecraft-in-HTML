/*
 * js/player.js — Estado del jugador (cámara, hitbox, inventario), romper/colocar bloques, HUD, hotbar e inventario, initPlayer.
 *
 * Secciones (nº = orden de ensamblado · líneas del HTML original):
 *   #11  Estado del jugador: hitBox, Key, cámara p, move, inventory…  (1218–1248)
 *   #20  Romper y colocar bloques  (2728–2788)
 *   #29  HUD: drawIcon, hotbar, hud, inventario  (4613–4794)
 *   #35  initPlayer()  (5286–5318)
 *
 * El juego original es UNA función (MineKhan) con variables compartidas; cada sección se registra
 * en window.MineKhanParts y js/main.js las reensambla en orden. Ver README.md.
 */

window.MineKhanParts = window.MineKhanParts || []

/* ── Sección #11 · Estado del jugador: hitBox, Key, cámara p, move, inventory… · líneas originales 1218–1248 ── */
window.MineKhanParts.push({ order: 11, name: "Estado del jugador: hitBox, Key, c\u00e1mara p, move, inventory\u2026", body: function () {
	let hitBox = {}
	let holding = 0
	let Key = {}
	let modelView = win.modelView || new Float32Array(16)
	win.modelView = modelView
	let glCache
	let worlds, selectedWorld = 0
	let freezeFrame = 0
	let p
	let vec1 = new PVector(), vec2 = new PVector(), vec3 = new PVector()
	let move = {
		x: 0,
		y: 0,
		z: 0,
		ang: Math.sqrt(0.5),
	}
	let p2 = {
		x: 0,
		y: 0,
		z: 0,
	}
	let place
	let inventory = {
		hotbar: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
		main: [],
		hotbarSlot: 0,
		size: 40 * Math.min(width, height) / 600,
		holding: 0,
	}
	//}

} });

/* ── Sección #20 · Romper y colocar bloques · líneas originales 2728–2788 ── */
window.MineKhanParts.push({ order: 20, name: "Romper y colocar bloques", body: function () {
	function changeWorldBlock(t) {
		let pos = hitBox.pos
		if(pos && pos[1] > 0 && pos[1] < maxHeight) {
			let shape = t && blockData[t].shape
			if (t && shape.rotate) {
				let pi = Math.PI / 4
				if (p.ry <= pi) {} // North; default
				else if (p.ry < 3 * pi) {
					t |= WEST
				} else if (p.ry < 5 * pi) {
					t |= SOUTH
				} else if (p.ry < 7 * pi) {
					t |= EAST
				}
			}

			if (t && shape.flip && hitBox.face !== "top" && (hitBox.face === "bottom" || (p.direction.y * hitBox.closest + p.y) % 1 < 0.5)) {
				t |= FLIP
			}

			world.setBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], t)
			if (t) {
				p.lastPlace = Date.now()
			} else {
				p.lastBreak = Date.now()
			}
		}
	}
	function newWorldBlock() {
		if(!hitBox.pos || !holding) {
			return
		}
		let pos = hitBox.pos, x= pos[0], y = pos[1], z = pos[2]
		switch(hitBox.face) {
			case "top":
				y += 1
				break
			case "bottom":
				y -= 1
				break
			case "south":
				z -= 1
				break
			case "north":
				z += 1
				break
			case "west":
				x -= 1
				break
			case "east":
				x += 1
				break
		}
		if (!inBox(x, y, z, 1, 1, 1) && !world.getBlock(x, y, z)) {
			pos[0] = x
			pos[1] = y
			pos[2] = z
			changeWorldBlock(holding < 0xff ? (holding | blockMode) : holding)
		}
	}

} });

/* ── Sección #29 · HUD: drawIcon, hotbar, hud, inventario · líneas originales 4613–4794 ── */
window.MineKhanParts.push({ order: 29, name: "HUD: drawIcon, hotbar, hud, inventario", body: function () {
	function drawIcon(x, y, id) {
		id = id < 0xff ? (id | blockMode) : id
		x =  x / (3 * height) - 0.1666 * width / height
		y = y / (3 * height) - 0.1666
		initModelView(null, x, y, 0, 0, 0)

		let buffer = blockIcons[id]
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 24, 0)
		gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 24, 12)
		gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 24, 20)
		gl.drawElements(gl.TRIANGLES, blockIcons.lengths[id], gl.UNSIGNED_INT, 0)
	}

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
	function hud() {
		if (p.spectator) {
			return
		}

		hotbar()

		let s = inventory.size
		let x = width / 2 + 0.5
		let y = height / 2 + 0.5

		// Crosshair
		if (!p.spectator) {
			ctx.lineWidth = 1
			ctx.strokeStyle = "white"
			ctx.beginPath()
			ctx.moveTo(x - 10, y)
			ctx.lineTo(x + 10, y)
			ctx.moveTo(x, y - 10)
			ctx.lineTo(x, y + 10)
			ctx.stroke()
		}

		//Hotbar
		x = width / 2 - 9 / 2 * s + 0.5 + 25
		y = height - s * 1.5 + 0.5

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

		let str = "Average Frame Time: " + analytics.displayedFrameTime + "ms\n"
		+ "Worst Frame Time: " + analytics.displayedwFrameTime + "ms\n"
		+ "Render Time: " + analytics.displayedRenderTime + "ms\n"
		+ "Tick Time: " + analytics.displayedTickTime + "ms\n"
		+ "Rendered Chunks: " + renderedChunks.toLocaleString() + " / " + world.loaded.length + "\n"
		+ "Generated Chunks: " + generatedChunks.toLocaleString() + "\n"
		+ "FPS: " + analytics.fps

		if (p.autoBreak) {
			text("Super breaker enabled", 5, height - 89, 12)
		}

		ctx.textAlign = 'right'
		text(p2.x + ", " + p2.y + ", " + p2.z, width - 10, 15, 0)
		ctx.textAlign = 'left'
		text(str, 5, height - 77, 12)
	}
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

} });

/* ── Sección #35 · initPlayer() · líneas originales 5286–5318 ── */
window.MineKhanParts.push({ order: 35, name: "initPlayer()", body: function () {
	function initPlayer() {
		p = new Camera()
		p.speed = 0.075
		p.velocity = new PVector(0, 0, 0)
		p.pos = new Float32Array(3)
		p.sprintSpeed = 1.5
		p.flySpeed = 2.5
		p.x = 8
		p.y = superflat ? 6 : (Math.round(noise(8 * generator.smooth, 8 * generator.smooth) * generator.height) + 2 + generator.extra)
		p.z = 8
		p.previousX = 8
		p.previousY = 70
		p.previousZ = 8
		p.w = 3 / 8
		p.bottomH = 1.62
		p.topH = 0.18
		p.onGround = false
		p.jumpSpeed = 0.3
		p.sprinting = false
		p.maxYVelocity = 1.5
		p.gravityStength = -0.032
		p.lastUpdate = win.performance.now()
		p.lastBreak = Date.now()
		p.lastPlace = Date.now()
		p.lastJump = Date.now()
		p.autoBreak = false
		p.flying = false
		p.sneaking = false
		p.spectator = false
		
		win.player = p
		win.p2 = p2
	}
} });
