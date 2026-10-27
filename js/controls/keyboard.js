/* js/controls/keyboard.js — Manejadores de eventos de teclado onkeydown y onkeyup | Provee: canvas.onkeydown, canvas.onkeyup | Requiere: Key, initTextures, toggleBlockMode, toggleAutoBreak, toggleFlight, setZoom, setSneaking, toggleSpectator, selectHotbarSlot, screen, releasePointer, changeScene, currentGamemode, survivalEat, freezeFrame, play, drawScreens, unpauseDelay, previousScreen | Posee: listeners de teclado en canvas | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "controls/keyboard",
	order: 30.20,
	name: "Listeners de teclado (canvas.onkeydown, canvas.onkeyup)",
	body: function () {
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
			toggleBlockMode()
		}

		if (screen === "play") {
			if(k === "p") {
				releasePointer()
				changeScene("pause")
			}

			if(k === "b") {
				toggleAutoBreak()
			}

			if (k === " ") {
				toggleFlight()
			}

			if (k === "z") {
				setZoom(true)
			}

			if (k === "shift") {
				setSneaking(true)
			}

			if (k === "l") {
				toggleSpectator()
			}

			if (k === "e" && currentGamemode.allowCreativeInventory) {
				changeScene("inventory")
				releasePointer()
			}

			if (k === "f" && typeof survivalEat === "function") {
				survivalEat()
			}

			if (k === ";") {
				releasePointer()
				freezeFrame = true
			}

			if(Number(k)) {
				selectHotbarSlot(Number(k) - 1)
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
				setZoom(false)
			}

			if (k === "shift") {
				setSneaking(false)
			}
		}
	}
	}
})