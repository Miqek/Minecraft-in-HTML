/* js/render/world-renderer.js — Función defineWorld para actualización y renderizado del mundo | Provee: defineWorld | Requiere: win, world, analytics | Posee: función defineWorld | Origen: sección #24 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/world-renderer",
	order: 24.00,
	name: "defineWorld (tick + render)",
	body: function () {
	let defineWorld = function() {
		let tickStart = win.performance.now()
		world.tick()
		analytics.totalTickTime += win.performance.now() - tickStart
		let renderStart = win.performance.now()
		world.render()
		analytics.totalRenderTime += win.performance.now() - renderStart
	}
	}
})