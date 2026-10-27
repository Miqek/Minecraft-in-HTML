/* js/audio/sound-registry.js — Registro de recetas y generadores de sonido sintético WebAudio | Provee: soundRegistry | Requiere: audioManager | Posee: síntesis procedural de efectos sonoros | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "audio/sound-registry",
	order: 30.51,
	name: "Registro de sonidos sintéticos procedurales",
	body: function () {
	function synthDigBreak(ctx, opts) {
		let now = ctx.currentTime
		let osc = ctx.createOscillator()
		let gain = ctx.createGain()
		osc.type = "triangle"
		osc.frequency.setValueAtTime(140, now)
		osc.frequency.exponentialRampToValueAtTime(40, now + 0.12)
		gain.gain.setValueAtTime(0.3, now)
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
		osc.connect(gain)
		gain.connect(ctx.destination)
		osc.start(now)
		osc.stop(now + 0.12)
	}

	function synthPlace(ctx, opts) {
		let now = ctx.currentTime
		let osc = ctx.createOscillator()
		let gain = ctx.createGain()
		osc.type = "sine"
		osc.frequency.setValueAtTime(180, now)
		osc.frequency.exponentialRampToValueAtTime(80, now + 0.08)
		gain.gain.setValueAtTime(0.35, now)
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
		osc.connect(gain)
		gain.connect(ctx.destination)
		osc.start(now)
		osc.stop(now + 0.08)
	}

	function synthHurt(ctx, opts) {
		let now = ctx.currentTime
		let osc = ctx.createOscillator()
		let gain = ctx.createGain()
		osc.type = "sawtooth"
		osc.frequency.setValueAtTime(120, now)
		osc.frequency.linearRampToValueAtTime(60, now + 0.2)
		gain.gain.setValueAtTime(0.4, now)
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
		osc.connect(gain)
		gain.connect(ctx.destination)
		osc.start(now)
		osc.stop(now + 0.2)
	}

	function synthEat(ctx, opts) {
		let now = ctx.currentTime
		let osc = ctx.createOscillator()
		let gain = ctx.createGain()
		osc.type = "square"
		osc.frequency.setValueAtTime(320, now)
		osc.frequency.exponentialRampToValueAtTime(160, now + 0.06)
		gain.gain.setValueAtTime(0.15, now)
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
		osc.connect(gain)
		gain.connect(ctx.destination)
		osc.start(now)
		osc.stop(now + 0.06)
	}

	if (typeof audioManager !== "undefined" && audioManager.registerSound) {
		audioManager.registerSound("block:broken", synthDigBreak)
		audioManager.registerSound("block:placed", synthPlace)
		audioManager.registerSound("player:hurt", synthHurt)
		audioManager.registerSound("player:eat", synthEat)
	}
	}
})