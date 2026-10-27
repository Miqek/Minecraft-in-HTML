/* js/gamemodes/survival/_legacy-survival.js — Ciclo de tick, muerte, reaparición y persistencia legacy de Supervivencia | Provee: survivalTick, survivalDie, survivalRespawn, survivalKey, survivalSave, survivalForget, survivalInit, survivalLoad | Requiere: gameMode, survival, p, survivalHungerTick, survivalFallTick, survivalHealthTick, survivalMine, updateHUD, changeScene, releasePointer, world, inventory, holding, savedCreativeHotbar | Posee: orquestador del ciclo de vida y guardado en localStorage | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/legacy-survival-logic",
	order: 20.50,
	name: "Mecánicas legacy del modo Supervivencia (ciclo tick, muerte y guardado)",
	body: function () {
	// ══════════════ Modo Supervivencia ══════════════

	// Se llama cada frame desde drawScreens.play. Devuelve true si el jugador ha muerto en este frame.
	function survivalTick() {
		if (gameMode !== "survival") return false
		let s = survival
		let now = Date.now()
		let dt = Math.min(now - (s.lastTick || now), 100) / 1000
		s.lastTick = now

		if (!s.spawn) {
			s.spawn = { x: p.x, y: p.y, z: p.z }
			s.fallPeak = p.y
			s.lastX = p.x
			s.lastZ = p.z
		}

		// Sin vuelo ni espectador
		if (p.flying) p.flying = false
		if (p.spectator) p.spectator = false

		survivalHungerTick()
		survivalFallTick()
		survivalHealthTick(dt)
		survivalMine(now)

		if (s.health <= 0) {
			survivalDie()
			return true
		}

		if (now < s.hurtUntil) {
			updateHUD = true
			s.dirty = true // un último redibujado al terminar el destello
		}
		if (s.dirty) {
			updateHUD = true
			s.dirty = false
		}
		if (now - s.lastSave > 5000) {
			s.lastSave = now
			survivalSave()
		}
		return false
	}

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

	// ── Persistencia (localStorage, una entrada por mundo) ──
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

	// Prepara el estado para un mundo nuevo o cargado en el modo indicado
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