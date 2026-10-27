/* js/gamemodes/creative.js — Implementación del modo Creativo con bloques ilimitados y vuelo | Provee: creativeGamemode | Requiere: registerGamemode, reach, inventory, savedCreativeHotbar, holding, updateHUD, hooks, hitBox | Posee: definición del modo Creativo | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/creative",
	order: 20.26,
	name: "Modo Creativo (vuelo, inventario ilimitado y rotura instantánea)",
	body: function () {
	let creativeGamemode = {
		name: "creative",
		reach: reach,
		allowFlight: true,
		allowSpectator: true,
		allowCreativeInventory: true,
		allowPickBlock: true,
		drawHUD: null,
		init: function() {
			if (savedCreativeHotbar) {
				inventory.hotbar = savedCreativeHotbar.slice()
				savedCreativeHotbar = null
			}
			inventory.hotbarSlot = 0
			inventory.holding = 0
			holding = inventory.hotbar[0]
			updateHUD = true
		},
		canBreak: function(id) {
			return true
		},
		canPlace: function(id) {
			return true
		},
		onBroken: function(id) {
			hooks.emit("block:broken", { id: id, pos: hitBox.pos })
		},
		onPlaced: function(id) {
			hooks.emit("block:placed", { id: id, pos: hitBox.pos })
		},
		tick: function(now) {
			return false
		},
		save: function() {
			// El modo creativo no requiere persistencia de inventario ni de vida
		},
		load: function(id) {
			this.init()
		}
	}

	registerGamemode(creativeGamemode)
	}
})