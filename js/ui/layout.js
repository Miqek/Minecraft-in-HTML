/* js/ui/layout.js — Disposición y orquestación modular de todos los menús del juego | Provee: initEverything, initButtons | Requiere: Button, Slider, initMainMenuButtons, initOptionsMenuButtons, initWorldSelectButtons, initWorldEditButtons, initPlaceholderButtons, initWorldCreateButtons, initPauseMenuButtons | Posee: orquestador central initButtons | Origen: sección #27 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/layout",
	order: 27.00,
	name: "initButtons(): botones y sliders de cada menú",
	body: function () {
	var initEverything
	function initButtons() {
		Button.all = []
		Slider.all = []
		const nothing = () => false
		const always = () => true

		initMainMenuButtons()
		initOptionsMenuButtons()
		initWorldSelectButtons()
		initWorldEditButtons()
		initPlaceholderButtons()
		initWorldCreateButtons()
		initPauseMenuButtons()
	}
	}
})