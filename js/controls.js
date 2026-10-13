/*
 * js/controls.js — Pantallas/escenas, pointer lock, movimiento por teclado, widgets Slider/Button, eventos de ratón/teclado/rueda/resize y dibujo de cada pantalla.
 *
 * Secciones (nº = orden de ensamblado · líneas del HTML original):
 *   #10  Pantallas, overlays HTML y changeScene()  (1124–1217)
 *   #14  Bloqueo de puntero (getPointer / releasePointer)  (1262–1272)
 *   #25  controls(): movimiento por teclado  (4099–4157)
 *   #26  Sensibilidad del ratón y widgets Slider/Button  (4158–4360)
 *   #27  initButtons(): botones y sliders de cada menú  (4361–4516)
 *   #30  Eventos de ratón, teclado, rueda, foco y resize  (4795–5071)
 *   #38  Funciones de dibujo de cada pantalla (drawScreens.*)  (5433–5577)
 *
 * El juego original es UNA función (MineKhan) con variables compartidas; cada sección se registra
 * en window.MineKhanParts y js/main.js las reensambla en orden. Ver README.md.
 */

window.MineKhanParts = window.MineKhanParts || []

/* ── Sección #10 · Pantallas, overlays HTML y changeScene() · líneas originales 1124–1217 ── */
window.MineKhanParts.push({ order: 10, name: "Pantallas, overlays HTML y changeScene()", body: function () {
	// Callback functions for all the screens; will define them further down the page
	let drawScreens = {
		"main menu": () => {},
		"options": () => {},
		"play": () => {},
		"pause": () => {},
		"creation menu": () => {},
		"inventory": () => {},
		"multiplayer menu": () => {},
		"comingsoon menu": () => {},
		"loadsave menu": () => {},
	}
	let html = {
		pause: {
			enter: [window.message],
			exit: [window.savebox, window.saveDirections, window.message]
		},
		"loadsave menu": {
			enter: [window.worlds, window.boxCenterTop, window.quota],
			exit: [window.worlds, window.boxCenterTop, window.quota],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter Save String (Optional)"
				if (navigator && navigator.storage && navigator.storage.estimate) {
					navigator.storage.estimate().then(data => {
						window.quota.innerText = `${data.usage.toLocaleString()} / ${data.quota.toLocaleString()} bytes (${(100 * data.usage / data.quota).toLocaleString(undefined, { maximumSignificantDigits: 2 })}%) of your quota used`
					}).catch(console.error)
				}
				window.boxCenterTop.onmousedown = e => {
					let elem = document.getElementsByClassName("selected")
					if (elem && elem[0]) {
						elem[0].classList.remove("selected")
					}
					selectedWorld = 0
					Button.draw()
				}
			},
			onexit: () => {
				window.boxCenterTop.onmousedown = null
			}
		},
		"creation menu": {
			enter: [window.boxCenterTop],
			exit: [window.boxCenterTop],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter World Name"
				window.boxCenterTop.value = ""
			}
		},
		loading: {
			onenter: startLoad
		},
		editworld: {
			enter: [window.boxCenterTop],
			exit: [window.boxCenterTop],
			onenter: () => {
				window.boxCenterTop.placeholder = "Enter World Name"
				window.boxCenterTop.value = ""
			}
		}
	}

	let screen = "main menu"
	let previousScreen = screen
	function changeScene(newScene) {
		if (screen === "options") {
			saveToDB("settings", settings).catch(e => console.error(e))
		}

		if (html[screen] && html[screen].exit) {
			for (let element of html[screen].exit) {
				element.classList.add("hidden")
			}
		}

		if (html[newScene] && html[newScene].enter) {
			for (let element of html[newScene].enter) {
				element.classList.remove("hidden")
			}
		}

		if (html[newScene] && html[newScene].onenter) {
			html[newScene].onenter()
		}
		if (html[screen] && html[screen].onexit) {
			html[screen].onexit()
		}

		previousScreen = screen
		screen = newScene
		mouseDown = false
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}
} });

/* ── Sección #14 · Bloqueo de puntero (getPointer / releasePointer) · líneas originales 1262–1272 ── */
window.MineKhanParts.push({ order: 14, name: "Bloqueo de puntero (getPointer / releasePointer)", body: function () {
	function getPointer() {
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock()
		}
	}
	function releasePointer() {
		if (doc.exitPointerLock) {
			doc.exitPointerLock()
		}
	}

} });

/* ── Sección #25 · controls(): movimiento por teclado · líneas originales 4099–4157 ── */
window.MineKhanParts.push({ order: 25, name: "controls(): movimiento por teclado", body: function () {
	let controls = function() {
		move.x = 0
		move.z = 0
		let dt = (win.performance.now() - p.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt

		if(Key.w) move.z += p.speed
		if(Key.s) move.z -= p.speed
		if(Key.a) move.x += p.speed
		if(Key.d) move.x -= p.speed
		if (p.flying) {
			if(Key[" "]) p.velocity.y += 0.06 * dt
			if(Key.shift) p.velocity.y -= 0.06 * dt
		}
		if(Key.arrowleft) p.ry -= 0.1 * dt
		if(Key.arrowright) p.ry += 0.1 * dt
		if(Key.arrowup) p.rx += 0.1 * dt
		if(Key.arrowdown) p.rx -= 0.1 * dt

		if (!p.sprinting && Key.q && !p.sneaking && Key.w) {
			p.FOV(settings.fov + 10, 250)
			p.sprinting = true
		}

		if(p.sprinting) {
			move.x *= p.sprintSpeed
			move.z *= p.sprintSpeed
		}
		if(p.flying) {
			move.x *= p.flySpeed
			move.z *= p.flySpeed
		}
		if (!move.x && !move.z) {
			if (p.sprinting) {
				p.FOV(settings.fov, 100)
			}
			p.sprinting = false
		} else if(Math.abs(move.x) > 0 && Math.abs(move.z) > 0) {
			move.x *= move.ang
			move.z *= move.ang
		}

		//Update the velocity, rather than the position.
		let co = Math.cos(p.ry)
		let si = Math.sin(p.ry)
		let friction = p.onGround ? 1 : 0.3
		p.velocity.x += (co * move.x - si * move.z) * friction * dt
		p.velocity.z += (si * move.x + co * move.z) * friction * dt

		const TAU = Math.PI * 2
		const PI1_2 = Math.PI / 2
		while(p.ry > TAU) p.ry -= TAU
		while(p.ry < 0)   p.ry += TAU
		if(p.rx > PI1_2)  p.rx = PI1_2
		if(p.rx < -PI1_2) p.rx = -PI1_2

		p.setDirection()
	}

} });

/* ── Sección #26 · Sensibilidad del ratón y widgets Slider/Button · líneas originales 4158–4360 ── */
window.MineKhanParts.push({ order: 26, name: "Sensibilidad del rat\u00f3n y widgets Slider/Button", body: function () {
	// Mouse sensitivity variable, used for the settings buttons and in the "mmoved" function
	let mouseS = 300

	class Slider {
		constructor(x, y, w, h, scenes, label, min, max, settingName, callback) {
			this.x = x
			this.y = y
			this.h = h
			this.w = Math.max(w, 350)
			this.name = settingName
			this.scenes = Array.isArray(scenes) ? scenes : [scenes]
			this.label = label
			this.min = min
			this.max = max
			this.sliding = false
			this.callback = callback
		}
		draw() {
			if (!this.scenes.includes(screen)) {
				return
			}
			let current = (settings[this.name] - this.min) / (this.max - this.min)

			// Outline
			ctx.beginPath()
			strokeWeight(2)
			stroke(0)
			fill(85)
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
			ctx.stroke()
			ctx.fill()

			// Slider bar
			let value = Math.round(settings[this.name])
			ctx.beginPath()
			fill(130)
			let x = this.x - (this.w - 10) / 2 + (this.w - 10) * current - 5
			ctx.fillRect(x, this.y - this.h / 2, 10, this.h)

			//Label
			fill(255, 255, 255)
			textSize(16)
			ctx.textAlign = 'center'
			text(`${this.label}: ${value}`, this.x, this.y + this.h / 8)
		}
		click() {
			if (!mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (mouseX > this.x - this.w / 2 && mouseX < this.x + this.w / 2 && mouseY > this.y - this.h / 2 && mouseY < this.y + this.h / 2) {
				let current = (mouseX - this.x + this.w / 2) / this.w
				if (current < 0) current = 0
				if (current > 1) current = 1
				this.sliding = true
				settings[this.name] = current * (this.max - this.min) + this.min
				this.callback(current * (this.max - this.min) + this.min)
				this.draw()
			}
		}
		drag() {
			if (!this.sliding || !this.scenes.includes(screen)) {
				return false
			}

			let current = (mouseX - this.x + this.w / 2) / this.w
			if (current < 0) current = 0
			if (current > 1) current = 1
			settings[this.name] = current * (this.max - this.min) + this.min
			this.callback(current * (this.max - this.min) + this.min)
		}
		release() {
			this.sliding = false
		}

		static draw() {
			for (let slider of Slider.all) {
				slider.draw()
			}
		}
		static click() {
			for (let slider of Slider.all) {
				slider.click()
			}
		}
		static release() {
			for (let slider of Slider.all) {
				slider.release()
			}
		}
		static drag() {
			if (mouseDown) {
				for (let slider of Slider.all) {
					slider.drag()
				}
			}
		}
		static add(x, y, w, h, scenes, label, min, max, defaut, callback) {
			Slider.all.push(new Slider(x, y, w, h, scenes, label, min, max, defaut, callback))
		}
	}
	Slider.all = []
	class Button {
		constructor(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
			this.x = x
			this.y = y
			this.h = h
			this.w = w
			this.index = 0
			this.disabled = disabled || (() => false)
			this.hoverText = !hoverText || typeof hoverText === "string" ? (() => hoverText) : hoverText
			this.scenes = Array.isArray(scenes) ? scenes : [scenes]
			this.labels = Array.isArray(labels) ? labels : [labels]
			this.callback = callback
		}

		mouseIsOver() {
			return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2
		}
		draw() {
			if (!this.scenes.includes(screen)) {
				return
			}
			let hovering = this.mouseIsOver()
			let disabled = this.disabled()
			let hoverText = this.hoverText()

			// Outline
			ctx.beginPath()
			if (hovering && !disabled) {
				strokeWeight(7)
				stroke(255)
				cursor(HAND)
			} else {
				strokeWeight(3)
				stroke(0)
			}
			if (disabled) {
				fill(60)
			} else {
				fill(120)
			}
			ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h)
			ctx.stroke()
			ctx.fill()

			//Label
			fill(255)
			textSize(16)
			ctx.textAlign = 'center'
			text(this.labels[this.index], this.x, this.y + this.h / 8)
			
			if (hovering && hoverText) {
				hoverbox.innerText = hoverText
				hoverbox.classList.remove("hidden")
				if (mouseY < height / 2) {
					hoverbox.style.bottom = ""
					hoverbox.style.top = mouseY + 10 + "px"
				} else {
					hoverbox.style.top = ""
					hoverbox.style.bottom = height - mouseY + 10 + "px"
				}
				if (mouseX < width / 2) {
					hoverbox.style.right = ""
					hoverbox.style.left = mouseX + 10 + "px"
				} else {
					hoverbox.style.left = ""
					hoverbox.style.right = width - mouseX + 10 + "px"
				}
			}
		}
		click() {
			if (this.disabled() || !mouseDown || !this.scenes.includes(screen)) {
				return false
			}

			if (this.mouseIsOver()) {
				this.index = (this.index + 1) % this.labels.length
				this.callback(this.labels[this.index])
				return true
			}
		}

		static draw() {
			hoverbox.classList.add("hidden")
			for (let button of Button.all) {
				button.draw()
			}
		}
		static click() {
			for (let button of Button.all) {
				if (button.click()) {
					Button.draw()
					break
				}
			}
		}
		static add(x, y, w, h, labels, scenes, callback, disabled, hoverText) {
			Button.all.push(new Button(x, y, w, h, labels, scenes, callback, disabled, hoverText))
		}
	}
	Button.all = []

} });

/* ── Sección #27 · initButtons(): botones y sliders de cada menú · líneas originales 4361–4516 ── */
window.MineKhanParts.push({ order: 27, name: "initButtons(): botones y sliders de cada men\u00fa", body: function () {
	var initEverything
	function initButtons() {
		Button.all = []
		Slider.all = []
		const nothing = () => false
		const always = () => true

		// Main menu buttons
		Button.add(width / 2, height / 2 - 20, 400, 40, "Singleplayer", "main menu", r => changeScene("loadsave menu"))
		Button.add(width / 2, height / 2 + 35, 400, 40, "Multiplayer", "main menu", nothing, always, "Multiplayer isn't possible at this time.")
		Button.add(width / 2, height / 2 + 90, 400, 40, "Options", "main menu", r => changeScene("options"))

		// Creation menu buttons
		Button.add(width / 2, 135, 300, 40, ["World Type: Normal", "World Type: Superflat"], "creation menu", r => superflat = r === "World Type: Superflat")
		Button.add(width / 2, 185, 300, 40, ["Trees: On", "Trees: Off"], "creation menu", r => trees = r === "Trees: On", function() {
			if (superflat) {
				this.index = 1
				trees = false
			}
			return superflat
		})
		Button.add(width / 2, 235, 300, 40, ["Caves: On", "Caves: Off"], "creation menu", r => caves = r === "Caves: On", function() {
			if (superflat) {
				this.index = 1
				caves = false
			}
			return superflat
		})
		Button.add(width / 2, 285, 300, 40, "Game Mode: Creative", "creation menu", nothing, always, "Coming Soon\n\nPlease stop asking for survival features. I don't want to half-implement anything, and I don't currently have the systems in place to create a full-featured survival mode. It'll come in due time.")
		Button.add(width / 2, 335, 300, 40, "Difficulty: Peaceful", "creation menu", nothing, always, "Coming soon\n\nPlease stop asking for mobs. Adding them will take a very long time. I know a lot of people want them, so just be patient.")
		Button.add(width / 2, height - 90, 300, 40, "Create New World", "creation menu", r => {
			world = new World()
			world.id = Date.now()
			let name = boxCenterTop.value || "World"
			let number = ""
			while(true) {
				let match = false
				for (let id in worlds) {
					if (worlds[id].name === name + number) {
						match = true
						break
					}
				}
				if (match) {
					number = number ? number + 1 : 1
				} else {
					name = name + number
					break
				}
			}
			world.name = name.replace(/;/g, "\u037e")
			win.world = world
			world.loadChunks()
			world.chunkGenQueue.sort(sortChunks)
			changeScene("loading")
		})
		Button.add(width / 2, height - 40, 300, 40, "Cancel", "creation menu", r => changeScene(previousScreen))

		// Loadsave menu buttons
		const selected = () => !selectedWorld || !worlds[selectedWorld]
		let w4 = Math.min(width / 4 - 10, 220)
		let x4 = w4 / 2 + 5
		let w2 = Math.min(width / 2 - 10, 450)
		let x2 = w2 / 2 + 5
		let mid = width / 2
		Button.add(mid - 3 * x4, height - 30, w4, 40, "Edit", "loadsave menu", r => changeScene("editworld"), () => (selected() || !worlds[selectedWorld].edited))
		Button.add(mid - x4, height - 30, w4, 40, "Delete", "loadsave menu", r => {
			if (worlds[selectedWorld] && confirm(`Are you sure you want to delete ${worlds[selectedWorld].name}?`)) {
				deleteFromDB(selectedWorld)
				window.worlds.removeChild(document.getElementById(selectedWorld))
				delete worlds[selectedWorld]
				selectedWorld = 0
			}
		}, () => (selected() || !worlds[selectedWorld].edited), "Delete the world forever.")
		Button.add(mid + x4, height - 30, w4, 40, "Export", "loadsave menu", r => {
			boxCenterTop.value = worlds[selectedWorld].code
		}, selected, "Export the save code into the text box above for copy/paste.")
		Button.add(mid + 3 * x4, height - 30, w4, 40, "Cancel", "loadsave menu", r => changeScene("main menu"))
		Button.add(mid - x2, height - 75, w2, 40, "Play Selected World", "loadsave menu", r => {
			world = new World()
			win.world = world

			let code
			if (!selectedWorld) {
				code = boxCenterTop.value
			} else {
				let data = worlds[selectedWorld]
				if (data) {
					code = data.code
					world.id = data.id
					world.edited = data.edited
				}
			}
			
			if (code) {
				try {
					world.loadSave(code)
					world.id = world.id || Date.now()
				}
				catch(e) {
					alert("Unable to load save")
					return
				}
				changeScene("loading")
			}
		}, () => !(!selectedWorld && boxCenterTop.value) && !worlds[selectedWorld])
		Button.add(mid + x2, height - 75, w2, 40, "Create New World", "loadsave menu", r => changeScene("creation menu"))

		Button.add(mid, height / 2, w2, 40, "Save", "editworld", r => {
			let w = worlds[selectedWorld]
			w.name = boxCenterTop.value.replace(/;/g, "\u037e")
			let split = w.code.split(";")
			split[0] = w.name
			w.code = split.join(";")
			saveToDB(w.id, w).then(success => {
				initWorldsMenu()
				changeScene("loadsave menu")
			}).catch(e => console.error(e))
		})
		Button.add(mid, height / 2 + 50, w2, 40, "Back", "editworld", r => changeScene(previousScreen))

		// Pause buttons
		Button.add(width / 2, 225, 300, 40, "Resume", "pause", play)
		Button.add(width / 2, 275, 300, 40, "Options", "pause", r => changeScene("options"))
		Button.add(width / 2, 325, 300, 40, "Save", "pause", save, nothing, () => `Save the world to your computer/browser. Doesn't work in incognito.\n\nLast saved ${timeString(Date.now() - world.edited)}.`)
		Button.add(width / 2, 375, 300, 40, "Get Save Code", "pause", r => {
			savebox.classList.remove("hidden")
			saveDirections.classList.remove("hidden")
			savebox.value = world.getSaveString()
		})
		Button.add(width / 2, 425, 300, 40, "Exit Without Saving", "pause", r => {
			savebox.value = world.getSaveString()
			initWorldsMenu()
			changeScene("main menu")
		})
		
		// Options buttons
		Button.add(width / 2, 455, width / 3, 40, "Back", "options", r => changeScene(previousScreen))
		
		// Comingsoon menu buttons
		Button.add(width / 2, 395, width / 3, 40, "Back", "comingsoon menu", r => changeScene(previousScreen))

		// Multiplayer buttons
		Button.add(width / 2, 395, width / 3, 40, "¯\\_(ツ)_/¯", "multiplayer menu", r => changeScene("main menu"))

		// Settings Sliders
		Slider.add(width/2, 245, width / 3, 40, "options", "Render Distance", 1, 32, "renderDistance", val => settings.renderDistance = Math.round(val))
		Slider.add(width/2, 305, width / 3, 40, "options", "FOV", 30, 110, "fov", val => {
			p.FOV(val)
			if (world) {
				p.setDirection()
				world.render()
			}
		})
		Slider.add(width/2, 365, width / 3, 40, "options", "Mouse Sensitivity", 30, 400, "mouseSense", val => settings.mouseSense = val)
	}
} });

/* ── Sección #30 · Eventos de ratón, teclado, rueda, foco y resize · líneas originales 4795–5071 ── */
window.MineKhanParts.push({ order: 30, name: "Eventos de rat\u00f3n, teclado, rueda, foco y resize", body: function () {
	let unpauseDelay = 0
	function mmoved(e) {
		let mouseS = settings.mouseSense / 30000
		p.rx -= e.movementY * mouseS
		p.ry += e.movementX * mouseS

		while(p.ry > Math.PI*2) {
			p.ry -= Math.PI*2
		}
		while(p.ry < 0) {
			p.ry += Math.PI*2
		}
		if(p.rx > Math.PI / 2) {
			p.rx = Math.PI / 2
		}
		if(p.rx < -Math.PI / 2) {
			p.rx = -Math.PI / 2
		}
	}
	function trackMouse(e) {
		cursor("")
		mouseX = e.x
		mouseY = e.y
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
		Slider.drag()
	}
	document.onmousemove = trackMouse
	document.onpointerlockchange = function() {
		if (doc.pointerLockElement === canvas) {
			doc.onmousemove = mmoved
		} else {
			doc.onmousemove = trackMouse
			if (screen === "play" && !freezeFrame) {
				changeScene("pause")
				unpauseDelay = Date.now() + 1000
			}
		}
		for (let key in Key) {
			Key[key] = false
		}
	}
	canvas.onmousedown = function(e) {
		mouseX = e.x
		mouseY = e.y
		mouseDown = true
		let block, index
		switch(e.button) {
			case 0:
				Key.leftMouse = true
				break
			case 1:
				Key.middleMouse = true
				if (!hitBox.pos) break
				updateHUD = true
				block = world.getBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2]) & 0x3ff
				index = inventory.hotbar.indexOf(block)
				if (index >= 0) {
					inventory.hotbarSlot = index
				} else {
					inventory.hotbar[inventory.hotbarSlot] = block
				}
				break
			case 2:
				Key.rightMouse = true
				break
		}
		if(screen === "play") {
			if (doc.pointerLockElement !== canvas) {
				getPointer()
				p.lastBreak = Date.now()
			} else {
				place = false
				if(e.button === 0) {
					if(Key.control) {
						place = true
					} else {
						changeWorldBlock(0)
					}
				}
				holding = inventory.hotbar[inventory.hotbarSlot]
				if(e.button === 2 && holding) {
					place = true
				}
				if(place) {
					newWorldBlock()
				}
			}
		} else if (screen === "inventory") {
			clickInv()
		}

		Button.click()
		Slider.click()
	}
	canvas.onmouseup = function(e) {
		switch(e.button) {
			case 0:
				Key.leftMouse = false
				break
			case 1:
				Key.middleMouse = false
				break
			case 2:
				Key.rightMouse = false
				break
		}
		mouseDown = false
		Slider.release()
	}
	canvas.onkeydown = function(e) {
		let k = e.key.toLowerCase()
		if (k === " ") {
			e.preventDefault()
		}
		if (e.repeat || Key[k]) {
			return
		}
		Key[k] = true

		if (k === "t") {
			initTextures()
		}

		if (k === "enter") {
			blockMode = blockMode === CUBE ? SLAB : (blockMode === SLAB ? STAIR : CUBE)
			updateHUD = true
		}

		if (screen === "play") {
			if(k === "p") {
				releasePointer()
				changeScene("pause")
			}

			if(k === "b") {
				p.autoBreak = !p.autoBreak
				updateHUD = true
			}

			if (k === " " && !p.spectator) {
				if (Date.now() < p.lastJump + 400) {
					p.flying ^= true
				} else {
					p.lastJump = Date.now()
				}
			}

			if (k === "z") {
				p.FOV(10, 300)
			}

			if (k === "shift" && !p.flying) {
				p.sneaking = true
				if (p.sprinting) {
					p.FOV(settings.fov, 100)
				}
				p.sprinting = false
				p.speed = 0.03
				p.bottomH = 1.32
			}

			if (k === "l") {
				p.spectator = !p.spectator
				p.flying = true
				p.onGround = false
				updateHUD = true
			}

			if (k === "e") {
				changeScene("inventory")
				releasePointer()
			}

			if (k === ";") {
				releasePointer()
				freezeFrame = true
			}

			if(Number(k)) {
				inventory.hotbarSlot = Number(k) - 1
				holding = inventory.hotbar[inventory.hotbarSlot]
				updateHUD = true
			}
		} else if (screen === "pause") {
			if(k === "p") {
				play()
			}
		} else if (screen === "inventory") {
			if (k === "e") {
				play()
			}
			if (k === "enter") {
				drawScreens.inventory()
			}
		}
	}
	canvas.onkeyup = function(e) {
		let k = e.key.toLowerCase()
		Key[k] = false
		if(k === "escape" && (screen === "pause" || screen === "inventory" || screen === "options" && previousScreen === "pause") && Date.now() > unpauseDelay) {
			play()
		}
		if (screen === "play") {
			if (k === "z") {
				p.FOV(settings.fov, 300)
			}

			if (k === "shift" && p.sneaking) {
				p.sneaking = false
				p.speed = 0.075
				p.bottomH = 1.62
				// p.y += 0.3
			}
		}
	}
	canvas.onblur = function() {
		for (let key in Key) {
			Key[key] = false
		}
		mouseDown = false
		Slider.release()
	}
	canvas.oncontextmenu = function(e) {
		e.preventDefault()
	}
	window.onbeforeunload = e => { 
		if (screen === "play" && Key.control) {
			releasePointer()
			e.preventDefault()
			e.returnValue = "Q is the sprint button; Ctrl + W closes the page."
			return true
		}
	}
	canvas.onwheel = e => {
		e.preventDefault()
		e.stopPropagation()
		if (e.deltaY > 0) {
			inventory.hotbarSlot++
		} else if (e.deltaY < 0) {
			inventory.hotbarSlot--
		}
		if (inventory.hotbarSlot > 8) {
			inventory.hotbarSlot = 0
		} else if (inventory.hotbarSlot < 0) {
			inventory.hotbarSlot = 8
		}

		updateHUD = true
		holding = inventory.hotbar[inventory.hotbarSlot]
	}
	document.onwheel = e => {} // Shouldn't do anything, but it helps with a Khan Academy bug somewhat
	window.onresize = e => {
		width = window.innerWidth
		height = window.innerHeight
		canvas.height = height
		canvas.width = width
		gl.canvas.height = height
		gl.canvas.width = width
		gl.viewport(0, 0, width, height)
		initButtons()
		initBackgrounds()
		inventory.size = 40 * Math.min(width, height) / 600
		genIcons()
		use3d()
		p.FOV(p.currentFov + 0.0001)

		if (screen === "play") {
			play()
		} else {
			drawScreens[screen]()
			Button.draw()
			Slider.draw()
		}
	}

} });

/* ── Sección #38 · Funciones de dibujo de cada pantalla (drawScreens.*) · líneas originales 5433–5577 ── */
window.MineKhanParts.push({ order: 38, name: "Funciones de dibujo de cada pantalla (drawScreens.*)", body: function () {
	// Define all the scene draw functions
	(function() {
		function title() {
			let title = "MINECRAFT"
			let subtext = "MINECRAFT IN JAVASCRIPT"
			let font = "Poppins"
			strokeWeight(1)
			ctx.textAlign = 'center'

			ctx.font = "bold 120px " + font
			fill(30)
			text(title, width / 2, 158)
			fill(40)
			text(title, width / 2, 155)
			ctx.font = "bold 121px " + font
			fill(50)
			text(title, width / 2, 152)
			fill(70)
			text(title, width / 2, 150)
			fill(90)
			ctx.font = "bold 122px " + font
			text(title, width / 2, 148)
			fill(110)
			text(title, width / 2, 145)

			ctx.font = "bold 32px " + font
			fill(50)
			text(subtext, width / 2-1, 180)
			text(subtext, width / 2+1, 180)
			text(subtext, width / 2, 179)
			text(subtext, width / 2, 181)
			ctx.font = "bold 32px " + font
			fill(150)
			text(subtext, width / 2, 180)
		}
		const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height)
		const dirt = () => ctx.putImageData(dirtbg, 0, 0)

		drawScreens["main menu"] = () => {
			ctx.putImageData(mainbg, 0, 0)
			title()
			fill(220)
			ctx.font = "20px Poppins"
			ctx.textAlign = 'left'
			text("JSCraft " + version, width - (width - 2), height - 2)
		}

		drawScreens.play = () => {
			controls()
			runGravity()
			resolveContactsAndUpdatePosition()

			if (updateHUD) {
				clear()
				gl.clearColor(0, 0, 0, 0)
				gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
				hud()
				ctx.drawImage(gl.canvas, 0, 0)
				updateHUD = false
				freezeFrame = false

				gl.clearColor(sky[0], sky[1], sky[2], 1.0)
			}
			defineWorld()
		}

		drawScreens.loading = () => {
			// This is really stupid, but it basically works by teleporting the player around to each chunk I'd like to load.
			// If chunks loaded from a save aren't generated, they're deleted from the save, so this loads them all.

			let sub = maxLoad - world.loadFrom.length - 9
			let standing = true
			if (world.loadFrom.length) {
				let load = world.loadFrom[0]
				p.x = load.x * 16
				p.y = load.y * 16
				p.z = load.z * 16
				standing = false
			} else {
				p.x = p2.x
				p.y = p2.y
				p.z = p2.z

				let cx = p.x >> 4
				let cz = p.z >> 4

				for (let x = cx - 1; x <= cx + 1; x++) {
					for (let z = cz - 1; z <= cz + 1; z++) {
						if (!world.chunks[x] || !world.chunks[x][z] || !world.chunks[x][z].buffer) {
							standing = false
						} else {
							sub++
						}
					}
				}
			}

			if (standing) {
				play()
				return
			}

			world.tick()

			let progress = Math.round(100 * sub / maxLoad)
			dirt()
			fill(255)
			textSize(30)
			ctx.textAlign = "center"
			text(`Loading... ${progress}% complete (${sub} / ${maxLoad})`, width / 2, height / 2)
		}

		drawScreens.inventory = drawInv

		drawScreens.pause = () => {
			strokeWeight(1)
			clear()
			ctx.drawImage(gl.canvas, 0, 0)

			textSize(60)
			fill(0, 0, 0)
			ctx.textAlign = 'center'
			text("Paused", width / 2, 60)
		}

		drawScreens.options = () => {
			clear()
		}
		drawScreens["creation menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Create New World", width / 2, 20)
		}
		drawScreens["loadsave menu"] = () => {
			dirt()
			ctx.textAlign = 'center'
			textSize(20)
			fill(255)
			text("Select World", width / 2, 20)
		}
		drawScreens.editworld = dirt
	})()

} });
