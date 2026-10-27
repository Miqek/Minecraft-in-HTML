/* js/ui/screens/world-edit.js — Pantalla y botones de edición de nombre de mundo guardado | Provee: initWorldEditButtons, drawScreens.editworld | Requiere: Button, width, height, worlds, selectedWorld, boxCenterTop, saveToDB, initWorldsMenu, changeScene, previousScreen, dirt | Posee: interfaz de edición de mundos | Origen: secciones #27 y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/world-edit-buttons",
	order: 27.40,
	name: "Botones de edición de mundo",
	body: function () {
	function initWorldEditButtons() {
		let w2 = Math.min(width / 2 - 10, 450)
		let mid = width / 2

		Button.add(mid, height / 2, w2, 40, "Save", "editworld", r => {
			let w = worlds[selectedWorld]
			w.name = boxCenterTop.value.replace(/;/g, "\u037e")
			let split = w.code.split(";")
			split[0] = w.name
			w.code = split.join(";")
			saveToDB(w.id, w).then(success => {
				initWorldsMenu()
				changeScene("loadsave menu")
			}).catch(e => console.error(e))
		})
		Button.add(mid, height / 2 + 50, w2, 40, "Back", "editworld", r => changeScene(previousScreen))
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/world-edit-draw",
	order: 38.40,
	name: "Dibujo de pantalla de edición de mundo (drawScreens.editworld)",
	body: function () {
	drawScreens.editworld = () => {
		dirt()
	}
	}
})