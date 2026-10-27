/* js/utils/vector.js — Clase vectorial tridimensional PVector | Provee: PVector | Requiere: MathGlob | Posee: operaciones vectoriales (set, normalize, add, mult) | Origen: sección #05 de js/physics.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "utils/vector",
	order: 5.00,
	name: "Vector PVector",
	body: function () {
	let PVector = function(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
		this.set = function(x, y, z) {
			if (y === undefined) {
				this.x = x.x
				this.y = x.y
				this.z = x.z
			} else {
				this.x = x
				this.y = y
				this.z = z
			}
		}
		this.normalize = function() {
			let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
			this.x /= mag
			this.y /= mag
			this.z /= mag
		}
		this.add = function(v) {
			this.x += v.x
			this.y += v.y
			this.z += v.z
		}
		this.mult = function(m) {
			this.x *= m
			this.y *= m
			this.z *= m
		}
	}
	}
})