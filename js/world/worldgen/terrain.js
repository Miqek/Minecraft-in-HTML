/* js/world/worldgen/terrain.js — Generación de la superficie y columnas iniciales | Provee: Chunk.prototype.genTerrain, World.prototype.genChunk | Requiere: Chunk, World, generator, noise, superflat, blockIds | Posee: terreno base y alturas por columna | Origen: sección #23 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/worldgen/terrain",
	order: 23.50,
	name: "Generación de superficie y alturas de chunks",
	body: function () {
	Chunk.prototype.genTerrain = function () {
		let smoothness = generator.smooth
		let hilliness = generator.height
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				let ground = superflat
					? 4
					: Math.round(noise((this.x + i) * smoothness, (this.z + k) * smoothness) * hilliness) + generator.extra
				this.tops[k * 16 + i] = ground

				this.setBlock(i, ground, k, blockIds.grass)
				this.setBlock(i, ground - 1, k, blockIds.dirt)
				this.setBlock(i, ground - 2, k, blockIds.dirt)
				this.setBlock(i, ground - 3, k, blockIds.dirt)
				for (let y = 1; y < ground - 3; y++) {
					this.setBlock(i, y, k, blockIds.stone)
				}
				this.setBlock(i, 0, k, blockIds.bedrock)
			}
		}
	}

	World.prototype.genChunk = function (chunk) {
		if (chunk.generated) {
			return false
		}
		chunk.genTerrain()
		chunk.generated = true
		generatedChunks++
	}
	}
})
