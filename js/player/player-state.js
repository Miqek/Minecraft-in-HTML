/* js/player/player-state.js — Variables de estado del jugador, vectores y transformaciones | Provee: hitBox, holding, Key, modelView, win.modelView, glCache, worlds, selectedWorld, freezeFrame, p, vec1, vec2, vec3, move, p2, place | Requiere: win, PVector | Posee: variables de cámara y entrada del jugador | Origen: sección #11 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "player/player-state",
	order: 11.00,
	name: "Variables de estado del jugador y vectores de movimiento",
	body: function () {
	let hitBox = {}
	let holding = 0
	let Key = {}
	let modelView = win.modelView || new Float32Array(16)
	win.modelView = modelView
	let glCache
	let worlds, selectedWorld = 0
	let freezeFrame = 0
	let p
	let vec1 = new PVector(), vec2 = new PVector(), vec3 = new PVector()
	let move = {
		x: 0,
		y: 0,
		z: 0,
		ang: Math.sqrt(0.5),
	}
	let p2 = {
		x: 0,
		y: 0,
		z: 0,
	}
	let place
	}
})