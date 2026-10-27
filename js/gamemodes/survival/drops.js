/* js/gamemodes/survival/drops.js — Resolución de drops y recompensas al romper bloques | Provee: survivalOnBroken | Requiere: blockName, survival, blockIds, survivalAdd | Posee: tabla y lógica de drops al minar | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/drops",
	order: 20.68,
	name: "Resolución de drops al romper bloques (survivalOnBroken)",
	body: function () {
	function survivalOnBroken(id) {
		let n = blockName(id)
		survival.exhaustion += 0.005
		survival.dirty = true
		if (!n || n === "air" || /water|lava/.test(n)) return
		if (/leaf|leaves/.test(n)) {
			if (Math.random() < 0.2) survival.food++
			return
		}
		let drop = id
		if (n === "stone" && blockIds.cobblestone) {
			drop = blockIds.cobblestone
		} else if (/^grass/.test(n) && blockIds.dirt) {
			drop = blockIds.dirt
		}
		survivalAdd(drop, 1)
		if (/^grass/.test(n) && Math.random() < 0.04) {
			survival.food++
		}
	}
	}
})