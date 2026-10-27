/* js/ui/screens/world-create.js — Pantalla de creación de mundo y botones de configuración | Provee: initWorldCreateButtons, drawScreens["creation menu"] | Requiere: Button, width, height, superflat, trees, caves, newGameMode, World, world, win, survivalInit, survivalSave, sortChunks, changeScene, previousScreen, dirt, ctx, textSize, fill, text | Posee: interfaz y configuración de nuevo mundo | Origen: secciones #27 y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/world-create-buttons",
	order: 27.60,
	name: "Botones de creación de nuevo mundo",
	body: function () {
	function initWorldCreateButtons() {
		Button.add(width / 2, 135, 300, 40, ["World Type: Normal", "World Type: Superflat"], "creation menu", r => superflat = r === "World Type: Superflat")
		Button.add(width / 2, 185, 300, 40, ["Trees: On", "Trees: Off"], "creation menu", r => trees = r === "Trees: On", function() {
			if (superflat) {
				this.index = 1
				trees = false
			}
			return superflat
		})
		Button.add(width / 2, 235, 300, 40, ["Caves: On", "Caves: Off"], "creation menu", r => caves = r === "Caves: On", function() {
			if (superflat) {
				this.index = 1
				caves = false
			}
			return superflat
		})
		// Supervivencia: selector de modo de juego (antes era un botón desactivado "Coming Soon")
		Button.add(width / 2, 285, 300, 40, ["Game Mode: Creative", "Game Mode: Survival"], "creation menu", r => newGameMode = r === "Game Mode: Survival" ? "survival" : "creative", null, "Creative: unlimited blocks, flying, instant breaking.\n\nSurvival: health, hunger, fall damage, mining time and a limited number of blocks.")
		Button.all[Button.all.length - 1].index = newGameMode === "survival" ? 1 : 0
		Button.add(width / 2, 335, 300, 40, "Difficulty: Peaceful", "creation menu", () => false, () => true, "Coming soon\n\nPlease stop asking for mobs. Adding them will take a very long time. I know a lot of people want them, so just be patient.")
		Button.add(width / 2, height - 90, 300, 40, "Create New World", "creation menu", r => {
			world = new World()
			world.id = Date.now()
			let name = boxCenterTop.value || "World"
			let number = ""
			while(true) {
				let match = false
				for (let id in worlds) {
					if (worlds[id].name === name + number) {
						match = true
						break
					}
				}
				if (match) {
					number = number ? number + 1 : 1
				} else {
					name = name + number
					break
				}
			}
			world.name = name.replace(/;/g, "\u037e")
			win.world = world
			// Supervivencia: fijar el modo del mundo nuevo y guardarlo
			survivalInit(newGameMode)
			survivalSave()
			world.loadChunks()
			world.chunkGenQueue.sort(sortChunks)
			changeScene("loading")
		})
		Button.add(width / 2, height - 40, 300, 40, "Cancel", "creation menu", r => changeScene(previousScreen))
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/world-create-draw",
	order: 38.50,
	name: "Dibujo de pantalla de creación de mundo (drawScreens['creation menu'])",
	body: function () {
	drawScreens["creation menu"] = () => {
		dirt()
		ctx.textAlign = 'center'
		textSize(20)
		fill(255)
		text("Create New World", width / 2, 20)
	}
	}
})