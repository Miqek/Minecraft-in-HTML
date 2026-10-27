/* js/gamemodes/survival/death-respawn.js — Gestión de muerte del jugador y punto de reaparición | Provee: survivalDie, survivalRespawn | Requiere: survival, survivalSave, changeScene, releasePointer, p | Posee: lógica de defunción y reaparición en el spawn | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/death-respawn",
	order: 20.74,
	name: "Muerte del jugador y reaparición (survivalDie, survivalRespawn)",
	body: function () {
	function survivalDie() {
		survival.dead = true
		survival.mining = null
		survival.mineProgress = 0
		survivalSave()
		changeScene("dead")
		releasePointer()
	}

	function survivalRespawn() {
		let s = survival
		s.health = s.maxHealth
		s.hunger = 20
		s.saturation = 5
		s.exhaustion = 0
		s.regenTimer = 0
		s.starveTimer = 0
		s.hurtUntil = 0
		s.dead = false
		s.dirty = true
		if (s.spawn) {
			p.x = s.spawn.x
			p.y = s.spawn.y
			p.z = s.spawn.z
			s.fallPeak = s.spawn.y
			s.lastX = p.x
			s.lastZ = p.z
		}
		p.velocity.x = 0
		p.velocity.y = 0
		p.velocity.z = 0
		p.onGround = false
		s.lastTick = 0
		survivalSave()
		changeScene("loading") // recarga los chunks alrededor del punto de reaparición y vuelve a "play"
	}
	}
})