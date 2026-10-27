/* js/controls/mouse.js — Manejadores de ratón, movimiento de cámara, clic y bloqueo de puntero | Provee: unpauseDelay, mmoved, trackMouse, document.onmousemove, document.onpointerlockchange, canvas.onmousedown, canvas.onmouseup, canvas.oncontextmenu | Requiere: settings, p, cursor, mouseX, mouseY, drawScreens, screen, Button, Slider, doc, canvas, freezeFrame, changeScene, Key, pickBlock, breakBlock, getPointer, place, holding, inventory, newWorldBlock, clickInv | Posee: listeners de eventos de ratón | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "controls/mouse",
	order: 30.10,
	name: "Manejadores de ratón (movimiento, clic y bloqueo de puntero)",
	body: function () {
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
				pickBlock()
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
						// En Supervivencia esta llamada no rompe nada: el minado se gestiona en survivalTick()
						breakBlock()
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
	canvas.oncontextmenu = function(e) {
		e.preventDefault()
	}
	}
})