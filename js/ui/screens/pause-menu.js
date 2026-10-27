/* js/ui/screens/pause-menu.js — Menú de pausa, pantalla de muerte y botones de guardado | Provee: initPauseMenuButtons, drawScreens.pause | Requiere: Button, width, play, changeScene, save, timeString, world, savebox, saveDirections, initWorldsMenu, survivalRespawn, strokeWeight, clear, ctx, gl, textSize, fill, text | Posee: menú de pausa y opciones durante el juego | Origen: secciones #27 y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/pause-menu-buttons",
	order: 27.70,
	name: "Botones de menú de pausa y pantalla de muerte",
	body: function () {
	function initPauseMenuButtons() {
		// Pause buttons
		Button.add(width / 2, 225, 300, 40, "Resume", "pause", play)
		Button.add(width / 2, 275, 300, 40, "Options", "pause", r => changeScene("options"))
		Button.add(width / 2, 325, 300, 40, "Save", "pause", save, () => false, () => `Save the world to your computer/browser. Doesn't work in incognito.\n\nLast saved ${timeString(Date.now() - world.edited)}.`)
		Button.add(width / 2, 375, 300, 40, "Get Save Code", "pause", r => {
			savebox.classList.remove("hidden")
			saveDirections.classList.remove("hidden")
			savebox.value = world.getSaveString()
		})
		Button.add(width / 2, 425, 300, 40, "Exit Without Saving", "pause", r => {
			savebox.value = world.getSaveString()
			initWorldsMenu()
			changeScene("main menu")
		})

		// Supervivencia: pantalla de muerte
		Button.add(width / 2, height / 2, 300, 40, "Respawn", "dead", r => survivalRespawn())
		Button.add(width / 2, height / 2 + 50, 300, 40, "Title Screen", "dead", r => {
			initWorldsMenu()
			changeScene("main menu")
		})
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/pause-menu-draw",
	order: 38.60,
	name: "Dibujo de pantalla de pausa (drawScreens.pause)",
	body: function () {
	drawScreens.pause = () => {
		strokeWeight(1)
		clear()
		ctx.drawImage(gl.canvas, 0, 0)

		textSize(60)
		fill(0, 0, 0)
		ctx.textAlign = 'center'
		text("Paused", width / 2, 60)
	}
	}
})