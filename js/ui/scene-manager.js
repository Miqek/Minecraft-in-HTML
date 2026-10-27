/* js/ui/scene-manager.js — Gestor de escenas, overlays DOM y ciclo de vida de transiciones | Provee: drawScreens, html, screen, previousScreen, clear, dirt, changeScene, play | Requiere: window, document, saveToDB, settings, currentGamemode, Button, Slider, canvas, p, updateHUD, use3d, gl, sky, getPointer, fill, textSize | Posee: tabla de drawScreens, controlador changeScene y play | Origen: secciones #10 de js/controls.js y #12 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/scene-registry",
	order: 10.00,
	name: "Registro de pantallas, overlays DOM y helpers de limpieza",
	body: function () {
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
		"dead": () => {},
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

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	function dirt() {
		ctx.putImageData(dirtbg, 0, 0)
	}
	}
})

window.MineKhanParts.push({
	id: "ui/scene-transitions",
	order: 10.50,
	name: "Transiciones de escena (changeScene)",
	body: function () {
	function changeScene(newScene) {
		if (screen === "options") {
			saveToDB("settings", settings).catch(e => console.error(e))
		}

		if (newScene === "pause" && currentGamemode.save) {
			currentGamemode.save()
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
	}
})

window.MineKhanParts.push({
	id: "ui/scene-play",
	order: 12.00,
	name: "Transición a juego (play)",
	body: function () {
	function play() {
		canvas.onblur()
		p.lastBreak = Date.now()
		updateHUD = true
		use3d()
		gl.clearColor(sky[0], sky[1], sky[2], 1.0)
		getPointer()
		fill(255, 255, 255)
		textSize(10)
		changeScene("play")
	}
	}
})