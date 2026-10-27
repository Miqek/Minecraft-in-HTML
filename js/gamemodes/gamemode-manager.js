/* js/gamemodes/gamemode-manager.js — Registro y gestor polimórfico de modos de juego | Provee: gamemodes, currentGamemode, registerGamemode, setGamemode | Requiere: gameMode | Posee: registro de modos y despachador de ciclo de vida | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/gamemode-manager",
	order: 20.25,
	name: "Gestor central de modos de juego",
	body: function () {
	let gamemodes = {}
	let currentGamemode = {
		name: "creative",
		init: function() {},
		canBreak: function(id) { return true },
		canPlace: function(id) { return true },
		onBroken: function(id) {},
		onPlaced: function(id) {},
		tick: function(now) { return false },
		drawHUD: null,
		allowFlight: true,
		allowSpectator: true,
		allowCreativeInventory: true,
		allowPickBlock: true,
		reach: 500,
		save: function() {},
		load: function(id) {}
	}

	function registerGamemode(mode) {
		gamemodes[mode.name] = mode
		if (gameMode === mode.name) {
			currentGamemode = mode
		}
	}

	function setGamemode(name) {
		gameMode = name
		currentGamemode = gamemodes[name] || gamemodes.creative || currentGamemode
		if (currentGamemode && currentGamemode.init) {
			currentGamemode.init()
		}
	}
	}
})