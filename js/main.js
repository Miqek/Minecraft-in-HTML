/*
 * js/main.js — Prelude global, estado y ajustes, play(), utilidades, carga, initEverything, bucle principal (gameLoop) y ENSAMBLADO de todas las secciones.
 *
 * Secciones (nº = orden de ensamblado · líneas del HTML original):
 *   #09  Estado global y ajustes (version, reach, settings, bigArray…)  (1064–1123)
 *   #12  play()  (1249–1260)
 *   #17  Utilidades: timeString y roundBits  (2222–2260)
 *   #32  Pantalla de carga (maxLoad, startLoad)  (5093–5100)
 *   #37  initEverything()  (5404–5432)
 *   #39  Redibujado inicial tras cargar la fuente  (5578–5584)
 *   #40  Bucle principal gameLoop()  (5585–5617)
 *
 * El juego original es UNA función (MineKhan) con variables compartidas; cada sección se registra
 * en window.MineKhanParts y js/main.js las reensambla en orden. Ver README.md.
 */

/* ── Prelude global original (se ejecuta antes de definir MineKhan, igual que en el HTML) ── */
window.canvas = document.getElementById("overlay")
window.ctx = canvas.getContext("2d")
window.savebox = document.getElementById("savebox")
window.boxCenterTop = document.getElementById("boxcentertop")
window.saveDirections = document.getElementById("savedirections")
window.message = document.getElementById("message")
window.worlds = document.getElementById("worlds")
window.quota = document.getElementById("quota")
var hoverbox = document.getElementById("onhover")
ctx.canvas.width  = window.innerWidth
ctx.canvas.height = window.innerHeight


var MathGlob = Math

window.MineKhanParts = window.MineKhanParts || []

/* ── Sección #09 · Estado global y ajustes (version, reach, settings, bigArray…) · líneas originales 1064–1123 ── */
window.MineKhanParts.push({ order: 9, name: "Estado global y ajustes (version, reach, settings, bigArray\u2026)", body: function () {
	//globals
	//{
	let version = "Beta"
	let reach = 500 
	let sky = [0.33, 0.54, 0.72] 
	let superflat = false
	let trees = true
	let caves = true

	let blockIds = {}
	blockData.forEach(block => blockIds[block.name] = block.id)
	win.blockData = blockData
	win.blockIds = blockIds

	let currentFov

	
	let settings = {
		renderDistance: 10,
		fov: 70, 
		mouseSense: 100 
	}
	let locked = true
	let generatedChunks
	let mouseX, mouseY, mouseDown
	let width = window.innerWidth
	let height = window.innerHeight

	if (height === 400) alert("Canvas is too small. Click the \"Settings\" button to the left of the \"Vote Up\" button under the editor and change the height to 600.")

	let generator = {
		height: 80, 
		smooth: 0.01, 
		extra: 30, 
		caveSize: 1000.00 
	}
	let maxHeight = 255
	let blockOutlines = false
	let blockFill = true
	let updateHUD = true
	const CUBE     = 0
	const SLAB     = 0x100 // 9th bit
	const STAIR    = 0x200 // 10th bit
	const FLIP     = 0x400 // 11th bit
	const NORTH    = 0 // 12th and 13th bits for the 4 directions
	const SOUTH    = 0x800
	const EAST     = 0x1000
	const WEST     = 0x1800
	const ROTATION = 0x1800 
	let blockMode  = CUBE
	let tex
	let textureMap
	let dirtBuffer
	let dirtTexture
	let textureCoords
	let texCoordsBuffers
	let mainbg, dirtbg // Background images
	let bigArray = win.bigArray || new Float32Array(600000)
	win.bigArray = bigArray

} });

/* ── Sección #12 · play() · líneas originales 1249–1260 ── */
window.MineKhanParts.push({ order: 12, name: "play()", body: function () {
	function play() {
		canvas.onblur()
		p.lastBreak = Date.now()
		updateHUD = true
		use3d()
		gl.clearColor(sky[0], sky[1], sky[2], 1.0)
		getPointer()
		fill(255, 255, 255)
		textSize(10)
		changeScene("play")
	}

} });

/* ── Sección #17 · Utilidades: timeString y roundBits · líneas originales 2222–2260 ── */
window.MineKhanParts.push({ order: 17, name: "Utilidades: timeString y roundBits", body: function () {
	function timeString(millis) {
		if (millis > 300000000000 || !millis) {
			return "never"
		}
		const SECOND = 1000
		const MINUTE = SECOND * 60
		const HOUR = MINUTE * 60
		const DAY = HOUR * 24
		const YEAR = DAY * 365

		if (millis < MINUTE) {
			return "just now"
		}

		let years = Math.floor(millis / YEAR)
		millis -= years * YEAR

		let days = Math.floor(millis / DAY)
		millis -= days * DAY

		let hours = Math.floor(millis / HOUR)
		millis -= hours * HOUR

		let minutes = Math.floor(millis / MINUTE)

		if (years) {
			return `${years} year${years > 1 ? "s" : ""} and ${days} day${day !== 1 ? "s" : ""} ago`
		}
		if (days) {
			return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`
		}
		if (hours) {
			return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""} ago`
		}
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
	}
	function roundBits(number) {
		return Math.round(number * 1000000) / 1000000
	}
} });

/* ── Sección #32 · Pantalla de carga (maxLoad, startLoad) · líneas originales 5093–5100 ── */
window.MineKhanParts.push({ order: 32, name: "Pantalla de carga (maxLoad, startLoad)", body: function () {
	let maxLoad = 1
	function startLoad() {
		// Runs when the loading screen is opened; cache the player's position
		p2.x = p.x
		p2.y = p.y
		p2.z = p.z
		maxLoad = world.loadFrom.length + 9
	}
} });

/* ── Sección #37 · initEverything() · líneas originales 5404–5432 ── */
window.MineKhanParts.push({ order: 37, name: "initEverything()", body: function () {
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

} });

/* ── Sección #39 · Redibujado inicial tras cargar la fuente · líneas originales 5578–5584 ── */
window.MineKhanParts.push({ order: 39, name: "Redibujado inicial tras cargar la fuente", body: function () {
	// Give the font time to load and redraw the homescreen
	setTimeout(e => {
		drawScreens[screen]()
		Button.draw()
		Slider.draw()
	}, 100)

} });

/* ── Sección #40 · Bucle principal gameLoop() · líneas originales 5585–5617 ── */
window.MineKhanParts.push({ order: 40, name: "Bucle principal gameLoop()", body: function () {
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
} });

/* ── Ensamblado ───────────────────────────────────────────────────────────────────────
 * Todo el juego original es UNA función (function MineKhan) con variables `let` compartidas.
 * Para conservar ese ámbito sin perder ni una línea, cada js/*.js registra sus secciones en
 * window.MineKhanParts (con un número `order` = posición en el código original). Aquí se
 * ordenan, se extrae el texto EXACTO de cada sección y se reconstruye la función original.
 * ------------------------------------------------------------------------------------- */
(function assembleMineKhan() {
	var EXPECTED = 40
	var parts = (window.MineKhanParts || []).slice().sort(function (a, b) { return a.order - b.order })

	var seen = {}
	parts.forEach(function (p) { seen[p.order] = (seen[p.order] || 0) + 1 })
	var missing = [], duplicated = []
	for (var n = 1; n <= EXPECTED; n++) {
		if (!seen[n]) missing.push(n)
		else if (seen[n] > 1) duplicated.push(n)
	}
	if (missing.length || duplicated.length || parts.length !== EXPECTED) {
		throw new Error("MineKhan: secciones incompletas. Faltan: [" + missing.join(", ") + "] · duplicadas: [" +
			duplicated.join(", ") + "]. Comprueba que index.html carga todos los js/*.js antes de main.js.")
	}

	var body = parts.map(function (p) {
		var src = Function.prototype.toString.call(p.body)
		return src.slice(src.indexOf("{") + 1, src.lastIndexOf("}")).slice(1, -1)
	}).join("\n")

	var tag = document.createElement("script")
	tag.type = "application/javascript"
	tag.text = "function MineKhan() {" + "\n" + body + "\n" + "}" + "\n//# sourceURL=MineKhan.assembled.js"
	document.body.appendChild(tag)
})()

/* ── Arranque original (después de definir MineKhan) ── */
init = MineKhan()
if (window.parent.raf) {
	window.cancelAnimationFrame(window.parent.raf)
	console.log("Canceled", window.parent.raf)
}
init()


	
