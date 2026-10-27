/* js/core/game-loop.js — Pantalla de juego activa, redibujado inicial y bucle principal | Provee: drawScreens.play, gameLoop | Requiere: controls, runGravity, resolveContactsAndUpdatePosition, updateHUD, clear, gl, hud, ctx, sky, defineWorld, drawScreens, Button, Slider, win, initEverything, releasePointer, screen, analytics, requestAnimationFrame, currentGamemode | Posee: ciclo principal de actualización y retorno de MineKhan | Origen: secciones #38 de js/controls.js y #39, #40 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/draw-play",
	order: 38.90,
	name: "Dibujo y ciclo de juego en pantalla (drawScreens.play)",
	body: function () {
	drawScreens.play = () => {
		controls()
		runGravity()
		resolveContactsAndUpdatePosition()

		if (currentGamemode.tick && currentGamemode.tick(Date.now())) {
			return
		}

		if (updateHUD) {
			clear()
			gl.clearColor(0, 0, 0, 0)
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
			hud()
			ctx.drawImage(gl.canvas, 0, 0)
			updateHUD = false
			freezeFrame = false

			gl.clearColor(sky[0], sky[1], sky[2], 1.0)
		}
		defineWorld()
		hooks.emit("frame")
	}
	}
})

window.MineKhanParts.push({
	id: "core/redraw-font",
	order: 39.00,
	name: "Redibujado inicial tras cargar la fuente",
	body: function () {
	// Give the font time to load and redraw the homescreen
	setTimeout(e => {
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}, 100)
	}
})

window.MineKhanParts.push({
	id: "core/game-loop",
	order: 40.00,
	name: "Bucle principal gameLoop()",
	body: function () {
	let debugMenu = false
	function gameLoop() {
		let frameStart = win.performance.now()
		if (!gl) {
			initEverything()
			releasePointer()
		}

		if (screen === "play" || screen === "loading") {
			drawScreens[screen]()
		}

		if (Date.now() - analytics.lastUpdate > 500 && analytics.frames) {
			analytics.displayedTickTime = (analytics.totalTickTime / analytics.frames).toFixed(1)
			analytics.displayedRenderTime = (analytics.totalRenderTime / analytics.frames).toFixed(1)
			analytics.displayedFrameTime = (analytics.totalFrameTime / analytics.frames).toFixed(1)
			analytics.fps = Math.round(analytics.frames * 1000 / (Date.now() - analytics.lastUpdate))
			analytics.displayedwFrameTime = analytics.worstFrameTime.toFixed(1)
			analytics.frames = 0
			analytics.totalRenderTime = 0
			analytics.totalTickTime = 0
			analytics.totalFrameTime = 0
			analytics.worstFrameTime = 0
			analytics.lastUpdate = Date.now()
			updateHUD = true
		}

		analytics.frames++
		analytics.totalFrameTime += win.performance.now() - frameStart
		analytics.worstFrameTime = Math.max(win.performance.now() - frameStart, analytics.worstFrameTime)
		win.raf = requestAnimationFrame(gameLoop)
	}
	return gameLoop
	}
})