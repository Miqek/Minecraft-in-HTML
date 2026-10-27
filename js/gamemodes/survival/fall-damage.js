/* js/gamemodes/survival/fall-damage.js — Detección de caída, daño por impacto y caída al vacío | Provee: survivalFallTick | Requiere: survival, p, survivalHurt | Posee: física de daño por altura y límite inferior | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/fall-damage",
	order: 20.64,
	name: "Daño por caída y vacío (survivalFallTick)",
	body: function () {
	function survivalFallTick() {
		let s = survival
		// Daño por caída
		if (p.onGround) {
			let drop = s.fallPeak - p.y
			if (drop > 3) {
				survivalHurt(Math.floor(drop - 3))
			}
			s.fallPeak = p.y
		} else if (p.y > s.fallPeak) {
			s.fallPeak = p.y
		}

		// Vacío
		if (p.y < -10) {
			survivalHurt(s.health)
		}
	}
	}
})