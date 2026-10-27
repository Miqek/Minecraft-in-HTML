/* js/blocks/block-properties.js — Tabla de propiedades precalculadas y tiempos de rotura de bloques | Provee: blockName, blockBreakTimes, breakTime | Requiere: blockData, BLOCK_COUNT | Posee: tabla de dureza y tiempos de minado por bloque | Origen: secciones #03 de js/textures.js y #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/block-properties",
	order: 3.96,
	name: "Tabla de propiedades de bloques y tiempos de minado",
	body: function () {
	function blockName(id) {
		let b = blockData[id & 0xff]
		return b && b.name ? String(b.name).toLowerCase() : ""
	}

	let blockBreakTimes = {}
	for (let i = 0; i < BLOCK_COUNT; i++) {
		let n = blockData[i] && blockData[i].name ? String(blockData[i].name).toLowerCase() : ""
		let time = 800
		if (n.includes("bedrock")) time = Infinity
		else if (/leaf|leaves/.test(n)) time = 200
		else if (n.includes("glass")) time = 300
		else if (n.includes("obsidian")) time = 4000
		else if (/sand|gravel|dirt|grass|snow|clay/.test(n)) time = 500
		else if (/wood|log|plank|trunk/.test(n)) time = 1000
		else if (/stone|cobble|ore|brick/.test(n)) time = 1500
		blockBreakTimes[i] = time
	}

	function breakTime(id) {
		let t = blockBreakTimes[id & 0xff]
		return t !== undefined ? t : 800
	}
	}
})