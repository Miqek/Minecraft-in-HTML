/* js/world/chunk.js — Columna de chunks (Chunk de 16x256x16) y generación de terreno/árboles/menas | Provee: Chunk | Requiere: Section, emptySection, fullSection, world, blockData, blockIds, generator, maxHeight, noise, random, bigArray, win | Posee: clase Chunk y pipeline de generación de chunks | Origen: sección #22 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/chunk",
	order: 22.30,
	name: "Columna de chunks Chunk y generación de terreno",
	body: function () {
	class Chunk {
		constructor(x, z) {
			this.x = x
			this.z = z
			this.sections = []
			this.maxHeight = maxHeight
			this.tops = new Uint8Array(16 * 16)
			for (let i = 0; i < 16; i++) {
				this.sections.push(new Section(x, i * 16, z, 16, this))
			}
			this.buffer = null
			this.verts = 0
			this.loaded = false
			this.generated = false
			this.caves = !caves
			this.populated = superflat
		}
		setBlock(x, y, z, blockId) {
			let s = y >> 4
			return this.sections[s].setBlock(x, y - s * 16, z, blockId)
		}
		updateBlock(x, y, z, world) {
			let s = y >> 4
			return this.sections[s].updateBlock(x, y - s * 16, z, world)
		}
		getBlock(x, y, z) {
			let s = y >> 4
			if (s < 0 || s > 15) {
				return 0
			}
			return this.sections[s].getBlock(x, y - s * 16, z)
		}
		carveCaves() {
			for (let i = 0; i < this.sections.length; i++) {
				if (!this.sections[i].caves) {
					this.sections[i].carveCaves()
					if (i + 1 >= this.sections.length) {
						this.caves = true
					}
					return
				}
			}
			this.caves = true
		}
		optimize() {
			for (let i = 0; i < this.sections.length; i++) {
				this.sections[i].optimize()
			}
		}
		genMesh() {
			let length = 0
			for (let i = 0; i < this.sections.length; i++) {
				length += this.sections[i].renderLength
			}
			if (!length) {
				this.buffer = null
				this.verts = 0
				return
			}

			let start = win.performance.now()
			let barray = bigArray
			let index = 0
			for (let i = 0; i < this.sections.length; i++) {
				index = this.sections[i].genMesh(barray, index)
			}
			let arrayDone = win.performance.now()

			this.buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)

			let data = barray.slice(0, index)

			let maxY = 0
			let minY = 255
			let y = 0
			for (let i = 1; i < data.length; i += 6) {
				y = data[i]
				maxY = y > maxY ? y : maxY
				minY = y < minY ? y : minY
			}
			this.maxY = maxY
			this.minY = minY

			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
			this.verts = index / 4
			//analytics.totalRenderTime += win.performance.now() - arrayDone
			//analytics.totalTickTime += arrayDone - start
		}
		loadMesh() {
			for (let i = 0; i < this.sections.length; i++) {
				this.sections[i].spreadFoliage()
				this.sections[i].spreadFoliage2()
			}
			this.optimize()
			this.genMesh()
		}
		load() {
			let chunkX = this.x >> 4
			let chunkZ = this.z >> 4
			let load = null
			for (let i = 0; i < world.loadFrom.length; i++) {
				load = world.loadFrom[i]
				if (load.x === chunkX && load.z === chunkZ) {
					let y = load.y * 16
					for (let j in load.blocks) {
						world.setBlock((j >> 8 & 15) + this.x, (j >> 4 & 15) + y, (j & 15) + this.z, load.blocks[j])
					}
					world.loadFrom.splice(i--, 1)
				}
			}
			this.loaded = true
		}
	}
	}
})