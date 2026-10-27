/* js/core/analytics.js — Métricas y tiempos de renderizado, tick y frames | Provee: analytics | Requiere: — | Posee: contadores de rendimiento y FPS | Origen: sección #23 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/analytics",
	order: 23.10,
	name: "Objeto de analíticas y métricas de rendimiento",
	body: function () {
	let analytics = {
		totalTickTime: 0,
		worstFrameTime: 0,
		totalRenderTime: 0,
		totalFrameTime: 0,
		lastUpdate: 0,
		frames: 1,
		displayedTickTime: "0",
		displayedRenderTime: "0",
		displayedFrameTime: "0",
		displayedwFrameTime: 0,
		fps: 0,
	}
	}
})