/* js/entities/item-drops.js — Entidad física para ítems caídos en el mundo | Provee: ItemDrop | Requiere: Entity, entityManager, hooks, Hooks, p, survivalAdd, blockData | Posee: lógica de recogida y animación de ítems caídos | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "entities/item-drops",
	order: 24.52,
	name: "Entidad ItemDrop para recogida de bloques",
	body: function () {
	class ItemDrop extends Entity {
		constructor(x, y, z, id, count) {
			super(x, y, z)
			this.id = id
			this.count = count || 1
			this.age = 0
			this.pickupDelay = 10
		}
		tick(dt) {
			super.tick(dt)
			this.age += dt

			// Detección de proximidad con el jugador
			if (this.age > this.pickupDelay && typeof p !== "undefined") {
				let dx = p.x - this.x
				let dy = p.y - this.y
				let dz = p.z - this.z
				let distSq = dx * dx + dy * dy + dz * dz
				if (distSq < 2.25) { // Radio de recogida de 1.5 bloques (1.5^2 = 2.25)
					if (typeof survivalAdd === "function") {
						survivalAdd(this.id, this.count)
					}
					this.dead = true
				}
			}
		}
		render() {
			// Los drops se dibujan mediante billboard o iconos auxiliares si el motor 3D lo requiere
		}
	}

	let itemDropHookBus = typeof Hooks !== "undefined" ? Hooks : (typeof hooks !== "undefined" ? hooks : null)
	if (itemDropHookBus && itemDropHookBus.on) {
		itemDropHookBus.on("block:broken", function(data) {
			if (data && data.pos && data.id) {
				let drop = new ItemDrop(data.pos[0] + 0.5, data.pos[1] + 0.5, data.pos[2] + 0.5, data.id, 1)
				if (typeof entityManager !== "undefined") {
					entityManager.add(drop)
				}
			}
		})
	}
	}
})