/* js/physics/gravity.js — Aplicación de gravedad, aceleración de salto y velocidad límite | Provee: runGravity | Requiere: p, Key, win | Posee: cálculo de gravedad vertical | Origen: sección #18 de js/physics.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "physics/gravity",
	order: 18.40,
	name: "Gravedad y salto (runGravity)",
	body: function () {
	let runGravity = function() {
		if (p.flying) {
			return
		}
		let dt = (win.performance.now() - p.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt
		if(p.onGround) {
			if(Key[" "]) {
				p.velocity.y = p.jumpSpeed
				p.onGround = false
			} else {
				p.velocity.y = 0
			}
		} else {
			p.velocity.y += p.gravityStength * dt
			if(p.velocity.y < -p.maxYVelocity) {
				p.velocity.y = -p.maxYVelocity
			}
		}
	}
	}
})