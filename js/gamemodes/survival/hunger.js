/* js/gamemodes/survival/hunger.js — Sistema de hambre, saturación, agotamiento y consumo de alimentos | Provee: survivalEat, survivalHungerTick | Requiere: survival, gameMode, p, Key, settings | Posee: mecánica de nutrición y cansancio físico | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/hunger",
	order: 20.62,
	name: "Hambre, saturación, agotamiento y comida (survivalEat)",
	body: function () {
	function survivalEat() {
		let s = survival
		if (gameMode !== "survival" || s.food <= 0 || s.hunger >= 20) return
		s.food--
		s.hunger = Math.min(20, s.hunger + 4)
		s.saturation = Math.min(s.hunger, s.saturation + 2.4)
		s.dirty = true
	}

	function survivalHungerTick() {
		let s = survival
		// Sprint bloqueado con poca hambre
		if (s.hunger <= 6 && p.sprinting) {
			p.sprinting = false
			p.FOV(settings.fov, 100)
		}

		// Agotamiento por movimiento y salto
		let dx = p.x - s.lastX
		let dz = p.z - s.lastZ
		let dist = Math.sqrt(dx * dx + dz * dz)
		s.lastX = p.x
		s.lastZ = p.z
		if (dist < 3 && p.onGround) {
			s.exhaustion += dist * (p.sprinting ? 0.1 : 0.01)
		}
		if (s.wasOnGround && !p.onGround && p.velocity.y > 0.1) {
			s.exhaustion += p.sprinting ? 0.2 : 0.05
		}
		s.wasOnGround = p.onGround

		// Hambre
		if (s.exhaustion >= 4) {
			s.exhaustion -= 4
			if (s.saturation > 0) {
				s.saturation = Math.max(0, s.saturation - 1)
			} else if (s.hunger > 0) {
				s.hunger--
			}
			s.dirty = true
		}
	}
	}
})