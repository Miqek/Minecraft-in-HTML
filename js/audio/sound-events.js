/* js/audio/sound-events.js — Suscripción de eventos de audio a hooks del juego | Provee: — | Requiere: hooks, audioManager | Posee: enrutamiento de eventos a reproducción de sonido | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "audio/sound-events",
	order: 30.52,
	name: "Enrutador de eventos de audio desacoplado",
	body: function () {
	if (typeof hooks !== "undefined" && hooks.on) {
		hooks.on("block:broken", function(data) {
			try {
				if (typeof audioManager !== "undefined") {
					audioManager.play("block:broken", data)
				}
			} catch (e) {}
		})

		hooks.on("block:placed", function(data) {
			try {
				if (typeof audioManager !== "undefined") {
					audioManager.play("block:placed", data)
				}
			} catch (e) {}
		})

		hooks.on("player:hurt", function(data) {
			try {
				if (typeof audioManager !== "undefined") {
					audioManager.play("player:hurt", data)
				}
			} catch (e) {}
		})

		hooks.on("player:eat", function(data) {
			try {
				if (typeof audioManager !== "undefined") {
					audioManager.play("player:eat", data)
				}
			} catch (e) {}
		})
	}
	}
})