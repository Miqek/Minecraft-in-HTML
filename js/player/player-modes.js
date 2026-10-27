/* js/player/player-modes.js — Modos del jugador (vuelo, sneak, zoom, espectador, autobreak, modo de bloque) | Provee: toggleBlockMode, toggleAutoBreak, toggleFlight, setZoom, setSneaking, toggleSpectator | Requiere: blockMode, CUBE, SLAB, STAIR, updateHUD, currentGamemode, p, settings | Posee: lógica de conmutación de modos del jugador | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "player/player-modes",
	order: 30.05,
	name: "Modos del jugador (vuelo, agacharse, zoom, espectador, modo bloque)",
	body: function () {
	function toggleBlockMode() {
		blockMode = blockMode === CUBE ? SLAB : (blockMode === SLAB ? STAIR : CUBE)
		updateHUD = true
	}

	function toggleAutoBreak() {
		if (currentGamemode.allowFlight) {
			p.autoBreak = !p.autoBreak
			updateHUD = true
		}
	}

	function toggleFlight() {
		if (!p.spectator && currentGamemode.allowFlight) {
			if (Date.now() < p.lastJump + 400) {
				p.flying ^= true
			} else {
				p.lastJump = Date.now()
			}
		}
	}

	function setZoom(active) {
		if (active) {
			p.FOV(10, 300)
		} else {
			p.FOV(settings.fov, 300)
		}
	}

	function setSneaking(active) {
		if (active) {
			if (!p.flying) {
				p.sneaking = true
				if (p.sprinting) {
					p.FOV(settings.fov, 100)
				}
				p.sprinting = false
				p.speed = 0.03
				p.bottomH = 1.32
			}
		} else {
			if (p.sneaking) {
				p.sneaking = false
				p.speed = 0.075
				p.bottomH = 1.62
				// p.y += 0.3
			}
		}
	}

	function toggleSpectator() {
		if (currentGamemode.allowSpectator) {
			p.spectator = !p.spectator
			p.flying = true
			p.onGround = false
			updateHUD = true
		}
	}
	}
})