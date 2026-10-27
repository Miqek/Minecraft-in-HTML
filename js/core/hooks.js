/* js/core/hooks.js — Bus de eventos y hooks para comunicación desacoplada | Provee: hooks | Requiere: — | Posee: registro de callbacks | Origen: nuevo (arquitectura desacoplada) */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/hooks",
	order: 9.40,
	name: "Sistema de hooks y eventos desacoplados",
	body: function () {
	let hooks = {
		events: {},
		on: function(event, callback) {
			if (!this.events[event]) {
				this.events[event] = []
			}
			this.events[event].push(callback)
		},
		emit: function(event, data) {
			let callbacks = this.events[event]
			if (callbacks) {
				for (let i = 0; i < callbacks.length; i++) {
					callbacks[i](data)
				}
			}
		}
	}
	}
})