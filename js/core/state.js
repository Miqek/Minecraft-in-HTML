/* js/core/state.js — Variables de estado global del juego y generación | Provee: version, reach, sky, superflat, trees, caves, currentFov, locked, generatedChunks, mouseX, mouseY, mouseDown, width, height, generator, maxHeight, blockOutlines, blockFill, updateHUD, blockMode, tex, textureMap, dirtBuffer, dirtTexture, textureCoords, texCoordsBuffers, mainbg, dirtbg, bigArray | Requiere: CUBE, win | Posee: estado global de MineKhan | Origen: sección #09 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/state",
	order: 9.20,
	name: "Estado global y ajustes de generación",
	body: function () {
	//globals
	//{
	let version = "Beta"
	let reach = 500 
	let sky = [0.33, 0.54, 0.72] 
	let superflat = false
	let trees = true
	let caves = true

	let currentFov

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
	}
})