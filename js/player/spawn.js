/* js/player/spawn.js — Cálculo de la altura de aparición inicial del jugador | Provee: getSpawnY | Requiere: superflat, noise, generator | Posee: función getSpawnY | Origen: sección #35 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "player/spawn",
	order: 35.10,
	name: "Cálculo de la altura de aparición (getSpawnY)",
	body: function () {
	function getSpawnY() {
		return superflat ? 6 : (Math.round(noise(8 * generator.smooth, 8 * generator.smooth) * generator.height) + 2 + generator.extra)
	}
	}
})