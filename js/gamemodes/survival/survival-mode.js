/* js/gamemodes/survival/survival-mode.js — Implementación completa del modo Supervivencia con interfaz unificada | Provee: survivalGamemode, survivalTick | Requiere: registerGamemode, SURVIVAL_REACH, survival, survivalHUD, survivalInit, breakTime, survivalOnBroken, survivalConsume, survivalDie, survivalSave, survivalLoad, survivalHungerTick, survivalFallTick, survivalHealthTick, survivalMine, updateHUD | Posee: definición del modo Supervivencia y ciclo de actualización | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/survival-mode",
	order: 20.80,
	name: "Modo Supervivencia unificado (survivalGamemode, survivalTick)",
	body: function () {
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

	let survivalGamemode = {
		name: "survival",
		reach: SURVIVAL_REACH,
		allowFlight: false,
		allowSpectator: false,
		allowCreativeInventory: false,
		allowPickBlock: false,
		drawHUD: function () {
			if (typeof survivalHUD === "function") {
				survivalHUD()
			}
		},
		init: function () {
			survivalInit("survival")
		},
		canBreak: function (id) {
			return survival.allowBreak && id && breakTime(id) !== Infinity
		},
		canPlace: function (id) {
			return survival.counts[id & 0xff] > 0
		},
		onBroken: function (id) {
			survivalOnBroken(id)
		},
		onPlaced: function (id) {
			survivalConsume(id & 0xff)
		},
		tick: function (now) {
			return survivalTick()
		},
		save: function () {
			survivalSave()
		},
		load: function (id) {
			survivalLoad(id)
		}
	}

	registerGamemode(survivalGamemode)
	}
})