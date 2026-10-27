/* js/gamemodes/survival/mining.js — Lógica de minado continuo de bloques en modo Supervivencia | Provee: survivalMine | Requiere: Key, p, hitBox, SURVIVAL_REACH, survival, world, maxHeight, breakTime, updateHUD, changeWorldBlock | Posee: proceso de progreso de minado de bloques | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/mining",
	order: 20.66,
	name: "Proceso de minado continuo de bloques (survivalMine)",
	body: function () {
	function survivalMine(now) {
		let s = survival
		if (!Key.leftMouse || Key.control || p.spectator || !hitBox.pos || hitBox.closest > SURVIVAL_REACH) {
			if (s.mineProgress > 0) s.dirty = true
			s.mining = null
			s.mineProgress = 0
			return
		}
		let x = hitBox.pos[0], y = hitBox.pos[1], z = hitBox.pos[2]
		let id = world.getBlock(x, y, z) & 0xff
		if (!id || y <= 0 || y >= maxHeight) {
			s.mining = null
			s.mineProgress = 0
			return
		}
		let time = breakTime(id)
		if (time === Infinity) {
			s.mining = null
			s.mineProgress = 0
			return
		}
		let key = x + "," + y + "," + z
		if (s.mining !== key) {
			s.mining = key
			s.mineStart = now
		}
		s.mineProgress = Math.min(1, (now - s.mineStart) / time)
		updateHUD = true
		if (s.mineProgress >= 1) {
			s.allowBreak = true
			changeWorldBlock(0)
			s.allowBreak = false
			s.mining = null
			s.mineProgress = 0
		}
	}
	}
})