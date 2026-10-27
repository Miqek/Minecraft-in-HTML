/* js/controls/window-events.js — Eventos de ventana (desenfoque, cierre y redimensionamiento) | Provee: canvas.onblur, window.onbeforeunload, window.onresize | Requiere: Key, mouseDown, Slider, screen, releasePointer, width, height, canvas, gl, initButtons, initBackgrounds, inventory, genIcons, use3d, p, play, drawScreens, Button | Posee: listeners de ciclo de vida de ventana | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "controls/window-events",
	order: 30.40,
	name: "Listeners de desenfoque, cierre y resize (window.onresize)",
	body: function () {
	canvas.onblur = function() {
		for (let key in Key) {
			Key[key] = false
		}
		mouseDown = false
		Slider.release()
	}
	window.onbeforeunload = e => { 
		if (screen === "play" && Key.control) {
			releasePointer()
			e.preventDefault()
			e.returnValue = "Q is the sprint button; Ctrl + W closes the page."
			return true
		}
	}
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
	}
})