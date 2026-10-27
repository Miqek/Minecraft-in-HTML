/* js/blocks/block-registry.js — Registro central de bloques, normalización y mapa de IDs | Provee: blockData, BLOCK_COUNT, blockIds, win.blockData, win.blockIds | Requiere: win | Posee: array blockData y diccionario blockIds | Origen: secciones #03 de js/textures.js y #09 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/registry-init",
	order: 3.00,
	name: "Inicialización del registro de bloques (blockData)",
	body: function () {
	let blockData = [
		{
			name: "air",
			id: 0,
			textures: [],
			transparent: true,
			shadow: false,
		}
	]
	}
})

window.MineKhanParts.push({
	id: "blocks/registry-finalize",
	order: 3.90,
	name: "Normalización de texturas y BLOCK_COUNT",
	body: function () {
	const BLOCK_COUNT = blockData.length;

	(function() {
		for (let i = 1; i < BLOCK_COUNT; i++) {
			let data = blockData[i]
			data.id = i

			if (!data.textures) {
				data.textures = [ data.name, data.name, data.name, data.name, data.name, data.name ]
			} else if (typeof data.textures === "string") {
				let texture = data.textures
				data.textures = [ texture, texture, texture, texture, texture, texture ]
			} else if (data.textures.length === 3) {
				data.textures[3] = data.textures[2]
				data.textures[4] = data.textures[2]
				data.textures[5] = data.textures[2]
			} else if (data.textures.length === 2) {
			
				data.textures[2] = data.textures[1]
				data.textures[3] = data.textures[2]
				data.textures[4] = data.textures[2]
				data.textures[5] = data.textures[2]
				data.textures[1] = data.textures[0]
			}

			data.transparent = data.transparent || false
			data.shadow = data.shadow !== undefined ? data.shadow : true
		}
	})()
	}
})

window.MineKhanParts.push({
	id: "blocks/registry-ids",
	order: 9.30,
	name: "Mapa de identificadores de bloques (blockIds)",
	body: function () {
	let blockIds = {}
	blockData.forEach(block => blockIds[block.name] = block.id)
	win.blockData = blockData
	win.blockIds = blockIds
	}
})