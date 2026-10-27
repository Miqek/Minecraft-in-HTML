/* js/audio/audio-manager.js — Motor de síntesis WebAudio y gestión de volumen | Provee: audioManager | Requiere: window | Posee: instancia de AudioContext e interfaz de reproducción | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "audio/audio-manager",
	order: 30.50,
	name: "Gestor principal de audio sintético",
	body: function () {
	let audioManager = {
		ctx: null,
		enabled: true,
		sounds: {},
		init: function() {
			try {
				let AudioContextClass = window.AudioContext || window.webkitAudioContext
				if (AudioContextClass) {
					this.ctx = new AudioContextClass()
				}
			} catch (e) {
				this.ctx = null
			}
		},
		unlock: function() {
			if (!this.ctx) {
				this.init()
			}
			if (this.ctx && this.ctx.state === "suspended") {
				try {
					this.ctx.resume()
				} catch (e) {}
			}
		},
		registerSound: function(name, generatorFn) {
			this.sounds[name] = generatorFn
		},
		play: function(name, options) {
			if (!this.enabled) return
			if (!this.ctx) {
				this.init()
			}
			if (!this.ctx) return
			this.unlock()
			try {
				let generator = this.sounds[name]
				if (typeof generator === "function") {
					generator(this.ctx, options || {})
				}
			} catch (e) {}
		}
	}
	audioManager.init()
	window.addEventListener("click", function() { audioManager.unlock() }, { once: true })
	window.addEventListener("keydown", function() { audioManager.unlock() }, { once: true })
	}
})