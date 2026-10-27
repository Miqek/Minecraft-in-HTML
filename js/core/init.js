/* js/core/init.js — Inicialización global del juego y generadores | Provee: initEverything | Requiere: seedHash, openSimplexNoise, noiseSeed, initPlayer, initWebgl, initBackgrounds, drawScreens, Button, Slider, initWorldsMenu, initButtons, p, settings, win, doc | Posee: función initEverything | Origen: sección #37 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/init",
	order: 37.00,
	name: "initEverything()",
	body: function () {
	function initEverything() {
		console.log("Initializing world.")

		worldSeed = Math.random() * 2000000000 | 0
		seedHash(worldSeed)
		caveNoise = openSimplexNoise(worldSeed)
		noiseSeed(worldSeed)

		generatedChunks = 0

		initPlayer()
		initWebgl()

		if (win.location.origin === "https://www.kasandbox.org" && (loadString || MineKhan.toString().length !== 183240)) {
			// Prevent Ctrl F
			message.innerHTML = '.oot lanigiro eht tuo kcehc ot>rb<erus eb ,siht ekil uoy fI>rb<.dralliW yb >a/<nahKeniM>"wen_"=tegrat "8676731005517465/cm/sc/gro.ymedacanahk.www//:sptth"=ferh a< fo>rb<ffo-nips a si margorp sihT'.split("").reverse().join("")
		}

		initBackgrounds()
		
		drawScreens[screen]()
		Button.draw()
		Slider.draw()

		p.FOV(settings.fov)
		initWorldsMenu()
		initButtons()
	}
	}
})