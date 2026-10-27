/* js/ui/hud/hud-manager.js — Gestor principal del HUD y coordinación de capas de renderizado | Provee: HUD, hud | Requiere: p, hotbar, drawCrosshair, drawHotbarFrame, currentGamemode, drawDebugOverlay | Posee: registro de componentes HUD y función principal hud | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/hud-manager",
	order: 29.20,
	name: "Gestor y coordinador del HUD (HUD, hud)",
	body: function () {
	let HUD = {
		elements: [],
		register: function (element) {
			this.elements.push(element)
		},
		render: function (mode) {
			for (let i = 0; i < this.elements.length; i++) {
				let el = this.elements[i]
				if (!el.modes || el.modes.includes(mode)) {
					el.draw()
				}
			}
		}
	}

	function hud() {
		if (p.spectator) {
			return
		}

		hotbar()
		drawCrosshair()
		drawHotbarFrame()

		let modeName = currentGamemode && currentGamemode.name ? currentGamemode.name : gameMode
		HUD.render(modeName)

		if (currentGamemode && currentGamemode.drawHUD) {
			currentGamemode.drawHUD()
		}

		drawDebugOverlay()
	}
	}
})