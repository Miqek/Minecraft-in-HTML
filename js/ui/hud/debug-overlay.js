/* js/ui/hud/debug-overlay.js — Métricas de rendimiento, FPS, coordenadas y texto de estado | Provee: drawDebugOverlay | Requiere: analytics, renderedChunks, world, generatedChunks, p, text, height, p2, width, ctx | Posee: capa de texto e información técnica | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/debug-overlay",
	order: 29.14,
	name: "Overlay de métricas y depuración (drawDebugOverlay)",
	body: function () {
	function drawDebugOverlay() {
		let str = "Average Frame Time: " + analytics.displayedFrameTime + "ms\n"
		+ "Worst Frame Time: " + analytics.displayedwFrameTime + "ms\n"
		+ "Render Time: " + analytics.displayedRenderTime + "ms\n"
		+ "Tick Time: " + analytics.displayedTickTime + "ms\n"
		+ "Rendered Chunks: " + renderedChunks.toLocaleString() + " / " + world.loaded.length + "\n"
		+ "Generated Chunks: " + generatedChunks.toLocaleString() + "\n"
		+ "FPS: " + analytics.fps

		if (p.autoBreak) {
			text("Super breaker enabled", 5, height - 89, 12)
		}

		ctx.textAlign = 'right'
		text(p2.x + ", " + p2.y + ", " + p2.z, width - 10, 15, 0)
		ctx.textAlign = 'left'
		text(str, 5, height - 77, 12)
	}
	}
})