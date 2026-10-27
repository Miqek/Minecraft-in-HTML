/* js/player/player-init.js — Inicialización de propiedades y físicas del jugador | Provee: initPlayer | Requiere: Camera, PVector, getSpawnY, win, p2 | Posee: función initPlayer | Origen: sección #35 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "player/player-init",
	order: 35.00,
	name: "initPlayer()",
	body: function () {
	function initPlayer() {
		p = new Camera()
		p.speed = 0.075
		p.velocity = new PVector(0, 0, 0)
		p.pos = new Float32Array(3)
		p.sprintSpeed = 1.5
		p.flySpeed = 2.5
		p.x = 8
		p.y = getSpawnY()
		p.z = 8
		p.previousX = 8
		p.previousY = 70
		p.previousZ = 8
		p.w = 3 / 8
		p.bottomH = 1.62
		p.topH = 0.18
		p.onGround = false
		p.jumpSpeed = 0.3
		p.sprinting = false
		p.maxYVelocity = 1.5
		p.gravityStength = -0.032
		p.lastUpdate = win.performance.now()
		p.lastBreak = Date.now()
		p.lastPlace = Date.now()
		p.lastJump = Date.now()
		p.autoBreak = false
		p.flying = false
		p.sneaking = false
		p.spectator = false
		
		win.player = p
		win.p2 = p2
	}
	}
})