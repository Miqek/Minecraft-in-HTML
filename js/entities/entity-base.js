/* js/entities/entity-base.js — Clase base para entidades del mundo | Provee: Entity | Requiere: PVector | Posee: propiedades cinemáticas y ciclo de vida de entidades | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "entities/entity-base",
	order: 24.50,
	name: "Clase base Entity",
	body: function () {
	class Entity {
		constructor(x, y, z) {
			this.x = x || 0
			this.y = y || 0
			this.z = z || 0
			this.vx = 0
			this.vy = 0
			this.vz = 0
			this.w = 0.25
			this.h = 0.25
			this.dead = false
			this.onGround = false
		}
		tick(dt) {
			this.x += this.vx * dt
			this.y += this.vy * dt
			this.z += this.vz * dt
		}
		render() {
			// Método de renderizado sobreescrito por clases derivadas
		}
	}
	}
})