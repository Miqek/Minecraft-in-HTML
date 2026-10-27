/* js/ui/screens/main-menu.js — Menú principal (título 3D de Minecraft y botones) | Provee: initMainMenuButtons, title, drawScreens["main menu"] | Requiere: Button, width, height, changeScene, ctx, fill, text, mainbg, version | Posee: pantalla y botones del menú principal | Origen: secciones #27 y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/main-menu-buttons",
	order: 27.10,
	name: "Botones del menú principal",
	body: function () {
	function initMainMenuButtons() {
		const nothing = () => false
		const always = () => true
		Button.add(width / 2, height / 2 - 20, 400, 40, "Singleplayer", "main menu", r => changeScene("loadsave menu"))
		Button.add(width / 2, height / 2 + 35, 400, 40, "Multiplayer", "main menu", nothing, always, "Multiplayer isn't possible at this time.")
		Button.add(width / 2, height / 2 + 90, 400, 40, "Options", "main menu", r => changeScene("options"))
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/main-menu-draw",
	order: 38.10,
	name: "Dibujo del menú principal y título (drawScreens['main menu'])",
	body: function () {
	function title() {
		let title = "MINECRAFT"
		let subtext = "MINECRAFT IN JAVASCRIPT"
		let font = "Poppins"
		strokeWeight(1)
		ctx.textAlign = 'center'

		ctx.font = "bold 120px " + font
		fill(30)
		text(title, width / 2, 158)
		fill(40)
		text(title, width / 2, 155)
		ctx.font = "bold 121px " + font
		fill(50)
		text(title, width / 2, 152)
		fill(70)
		text(title, width / 2, 150)
		fill(90)
		ctx.font = "bold 122px " + font
		text(title, width / 2, 148)
		fill(110)
		text(title, width / 2, 145)

		ctx.font = "bold 32px " + font
		fill(50)
		text(subtext, width / 2-1, 180)
		text(subtext, width / 2+1, 180)
		text(subtext, width / 2, 179)
		text(subtext, width / 2, 181)
		ctx.font = "bold 32px " + font
		fill(150)
		text(subtext, width / 2, 180)
	}

	drawScreens["main menu"] = () => {
		ctx.putImageData(mainbg, 0, 0)
		title()
		fill(220)
		ctx.font = "20px Poppins"
		ctx.textAlign = 'left'
		text("JSCraft " + version, width - (width - 2), height - 2)
	}
	}
})