/* js/ui/screens/options-menu.js — Pantalla de opciones, deslizadores de configuración y retorno | Provee: initOptionsMenuButtons, drawScreens.options | Requiere: Button, Slider, width, height, changeScene, previousScreen, settings, p, world, clear | Posee: controles y renderizado de opciones | Origen: secciones #27 y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/options-menu-buttons",
	order: 27.20,
	name: "Botones y sliders de opciones",
	body: function () {
	function initOptionsMenuButtons() {
		Button.add(width / 2, 455, width / 3, 40, "Back", "options", r => changeScene(previousScreen))
		Slider.add(width/2, 245, width / 3, 40, "options", "Render Distance", 1, 32, "renderDistance", val => settings.renderDistance = Math.round(val))
		Slider.add(width/2, 305, width / 3, 40, "options", "FOV", 30, 110, "fov", val => {
			p.FOV(val)
			if (world) {
				p.setDirection()
				world.render()
			}
		})
		Slider.add(width/2, 365, width / 3, 40, "options", "Mouse Sensitivity", 30, 400, "mouseSense", val => settings.mouseSense = val)
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/options-menu-draw",
	order: 38.20,
	name: "Dibujo de la pantalla de opciones (drawScreens.options)",
	body: function () {
	drawScreens.options = () => {
		clear()
	}
	}
})