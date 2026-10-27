/* js/gamemodes/survival/health.js — Sistema de salud, daño por impacto, regeneración e inanición | Provee: survivalHurt, survivalHealthTick | Requiere: survival | Posee: lógica de daño y regeneración vital | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/health",
	order: 20.60,
	name: "Salud, daño y regeneración vital",
	body: function () {
	function survivalHurt(amount) {
		if (amount <= 0 || survival.health <= 0) return
		survival.health = Math.max(0, survival.health - amount)
		survival.hurtUntil = Date.now() + 350
		survival.dirty = true
	}

	function survivalHealthTick(dt) {
		let s = survival
		if (s.hunger >= 18 && s.health < s.maxHealth) {
			s.regenTimer += dt
			if (s.regenTimer >= 4) {
				s.regenTimer = 0
				s.health++
				s.exhaustion += 0.6
				s.dirty = true
			}
		} else {
			s.regenTimer = 0
		}
		if (s.hunger <= 0) {
			s.starveTimer += dt
			if (s.starveTimer >= 4) {
				s.starveTimer = 0
				if (s.health > 1) survivalHurt(1)
			}
		} else {
			s.starveTimer = 0
		}
	}
	}
})