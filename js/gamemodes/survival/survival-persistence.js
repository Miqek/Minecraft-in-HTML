/* js/gamemodes/survival/survival-persistence.js — Persistencia en localStorage e inicialización del modo | Provee: survivalKey, survivalSave, survivalForget, survivalInit, survivalLoad | Requiere: world, gameMode, survival, inventory, p, savedCreativeHotbar, holding, updateHUD, survivalSyncHotbar | Posee: serialización y recuperación de estado en almacenamiento local | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/survival-persistence",
	order: 20.76,
	name: "Persistencia en localStorage y preparación del modo (survivalSave, survivalLoad)",
	body: function () {
	function survivalKey(id) {
		return "jscraft_survival_" + id
	}

	function survivalSave() {
		if (!world || !world.id) return
		try {
			localStorage.setItem(survivalKey(world.id), JSON.stringify({
				mode: gameMode,
				health: survival.health,
				hunger: survival.hunger,
				saturation: survival.saturation,
				exhaustion: survival.exhaustion,
				food: survival.food,
				counts: survival.counts,
				hotbar: gameMode === "survival" ? inventory.hotbar : null,
				spawn: survival.spawn,
			}))
		} catch (e) {}
	}

	function survivalForget(id) {
		try {
			localStorage.removeItem(survivalKey(id))
		} catch (e) {}
	}

	function survivalInit(mode) {
		let s = survival
		s.health = s.maxHealth
		s.hunger = 20
		s.saturation = 5
		s.exhaustion = 0
		s.food = 0
		s.counts = {}
		s.spawn = null
		s.mining = null
		s.mineProgress = 0
		s.allowBreak = false
		s.dead = false
		s.lastTick = 0
		s.lastSave = Date.now()
		s.regenTimer = 0
		s.starveTimer = 0
		s.hurtUntil = 0
		s.wasOnGround = true
		s.dirty = true

		if (mode === "survival") {
			if (gameMode !== "survival") {
				savedCreativeHotbar = inventory.hotbar.slice()
			}
			inventory.hotbar = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
			if (p) {
				p.flying = false
				p.spectator = false
				p.autoBreak = false
			}
		} else if (gameMode === "survival" && savedCreativeHotbar) {
			inventory.hotbar = savedCreativeHotbar.slice()
			savedCreativeHotbar = null
		}
		gameMode = mode
		inventory.hotbarSlot = 0
		inventory.holding = 0
		holding = inventory.hotbar[0]
		updateHUD = true
	}

	function survivalLoad(id) {
		let raw = null
		try {
			raw = localStorage.getItem(survivalKey(id))
		} catch (e) {}
		if (!raw) {
			survivalInit("creative")
			return
		}
		let d
		try {
			d = JSON.parse(raw)
		} catch (e) {
			survivalInit("creative")
			return
		}
		survivalInit(d && d.mode === "survival" ? "survival" : "creative")
		if (gameMode === "survival") {
			let s = survival
			s.health = d.health > 0 ? d.health : s.maxHealth
			s.hunger = typeof d.hunger === "number" ? d.hunger : 20
			s.saturation = typeof d.saturation === "number" ? d.saturation : 5
			s.exhaustion = d.exhaustion || 0
			s.food = d.food || 0
			s.counts = d.counts || {}
			s.spawn = d.spawn || null
			if (s.spawn) {
				s.fallPeak = s.spawn.y
			}
			if (Array.isArray(d.hotbar) && d.hotbar.length === 9) {
				inventory.hotbar = d.hotbar.slice()
			}
			survivalSyncHotbar()
		}
	}
	}
})