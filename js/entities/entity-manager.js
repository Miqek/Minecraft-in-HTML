/* js/entities/entity-manager.js — Gestor de entidades activas y ciclo de actualización | Provee: entityManager | Requiere: Entity, hooks, Hooks | Posee: lista de entidades activas y bucle de tick | Origen: nuevo (arquitectura modular) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "entities/entity-manager",
	order: 24.51,
	name: "Gestor de entidades del mundo",
	body: function () {
	let entityManager = {
		entities: [],
		add: function(entity) {
			this.entities.push(entity)
		},
		remove: function(entity) {
			let idx = this.entities.indexOf(entity)
			if (idx >= 0) {
				this.entities.splice(idx, 1)
			}
		},
		tick: function(dt) {
			dt = dt || 1
			for (let i = 0; i < this.entities.length; i++) {
				let ent = this.entities[i]
				if (ent.dead) {
					this.entities.splice(i--, 1)
					continue
				}
				ent.tick(dt)
			}
		},
		render: function() {
			for (let i = 0; i < this.entities.length; i++) {
				let ent = this.entities[i]
				if (!ent.dead) {
					ent.render()
				}
			}
		}
	}

	let entityHookBus = typeof Hooks !== "undefined" ? Hooks : (typeof hooks !== "undefined" ? hooks : null)
	if (entityHookBus && entityHookBus.on) {
		entityHookBus.on("frame", function() {
			entityManager.tick(1)
			entityManager.render()
		})
	}
	}
})