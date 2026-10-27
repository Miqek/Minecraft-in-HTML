/* js/world/world.js — Estructura principal del mundo, gestión de bloques y ciclo de vida de chunks | Provee: fogDist, World | Requiere: Chunk, p, superflat, noise, generator, settings, renderFilter, sortChunks, maxDist, blockIds, win | Posee: clase World y estado espacial | Origen: sección #23 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/world",
	order: 23.30,
	name: "Clase World y gestión de chunks",
	body: function () {
	let fogDist = 16
	class World {
		constructor() {
			generatedChunks = 0
			fogDist = 16
			p.y = superflat ? 6 : (Math.round(noise(8 * generator.smooth, 8 * generator.smooth) * generator.height) + 2 + generator.extra)

			//Initialize the world's arrays
			this.chunks = []
			this.loaded = []
			this.sortedChunks = []
			this.offsetX = 0
			this.offsetZ = 0
			this.lwidth = 0
			this.chunkGenQueue = []
			this.meshQueue = []
			this.generateQueue = []
			this.populateQueue = []
			this.loadFrom = []
			this.name = "World"
			this.id = 0
			this.edited = false
		}
		genChunk(chunk) {
			let x = chunk.x >> 4
			let z = chunk.z >> 4
			let trueX = chunk.x
			let trueZ = chunk.z

			chunk.genTerrain()
			chunk.generated = true

			let hide = !loadString
			let smoothness = generator.smooth
			let hilliness = generator.height
			let gen = 0
			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++) {
					if (superflat) {
						gen = 4
					} else {
						gen = Math.round(noise((trueX + i) * smoothness, (trueZ + k) * smoothness) * hilliness) + generator.extra
					}
					
					for (let j = 1; j < gen - 3; j++) {
						if (!chunk.getBlock(i, j, k)) {
							chunk.sections[j >> 4].caves = true
						}
					}
				}
			}
			generatedChunks++
		}
		getAdjacentSubchunks(x, y, z) {
			let minChunkX = x - 16 >> 4
			let maxChunkX = x + 16 >> 4
			let minChunkY = y - 16 >> 4
			let maxChunkY = y + 16 >> 4
			let minChunkZ = z - 16 >> 4
			let maxChunkZ = z + 16 >> 4
			let section = null
			let ret = []
			let i = 0
			for (let x = minChunkX; x <= maxChunkX; x++) {
				for (let y = minChunkY; y <= maxChunkY; y++) {
					for (let z = minChunkZ; z <= maxChunkZ; z++) {
						if (y < 0) {
							ret[i] = fullSection.blocks
						} else if (this.chunks[x] && this.chunks[x][z]) {
							section = this.chunks[x][z].sections[y]
							ret[i] = section ? section.blocks : emptySection.blocks
						} else {
							ret[i] = emptySection.blocks
						}
						i++
					}
				}
			}
			return ret
		}
		updateBlock(x, y, z, lazy) {
			let chunk = this.chunks[x >> 4] && this.chunks[x >> 4][z >> 4]
			if (chunk && chunk.buffer && y >= 0 && y <= maxHeight) {
				chunk.updateBlock(x & 15, y, z & 15, this)
			}
		}
		getWorldBlock(x, y, z) {
			if (y < 0 || y > maxHeight) {
				return 0
			}
			return this.chunks[x >> 4][z >> 4].getBlock(x & 15, y, z & 15)
		}
		getBlock(x, y, z) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			if (y > maxHeight) {
				return 0
			} else if (y < 0) {
				return blockIds.bedrock
			} else if (X < 0 || X >= this.lwidth || Z < 0 || Z >= this.lwidth) {
				return 0
			}
			return this.loaded[X * this.lwidth + Z].getBlock(x & 15, y, z & 15)
		}
		setBlock(x, y, z, blockID, lazy) {
			if (y < 0 || y > maxHeight) {
				return
			}
			let chunk = this.chunks[x >> 4] && this.chunks[x >> 4][z >> 4]
			if (!chunk) {
				return
			}
			chunk.setBlock(x & 15, y, z & 15, blockID)
			if (!lazy) {
				this.updateBlock(x, y, z)
				this.updateBlock(x - 1, y, z)
				this.updateBlock(x + 1, y, z)
				this.updateBlock(x, y - 1, z)
				this.updateBlock(x, y + 1, z)
				this.updateBlock(x, y, z - 1)
				this.updateBlock(x, y, z + 1)
			}
			chunk.sections[y >> 4].edited = true
			chunk.edited = true
			this.edited = true
		}
		spawnBlock(x, y, z, blockID) {
			if (y < 0 || y > maxHeight) {
				return
			}
			let chunkX = x >> 4
			let chunkZ = z >> 4
			if (this.chunks[chunkX] === undefined || this.chunks[chunkX][chunkZ] === undefined) {
				return
			}
			let chunk = this.chunks[chunkX][chunkZ]
			if (chunk.generated) {
				this.setBlock(x, y, z, blockID)
			} else if (chunk.loaded) {
				chunk.setBlock(x & 15, y, z & 15, blockID)
			} else if (!chunk.getBlock(x & 15, y, z & 15)) {
				chunk.setBlock(x & 15, y, z & 15, blockID)
			}
		}
		tick() {
			let tickStart = win.performance.now()
			let maxChunkX = (p.x >> 4) + settings.renderDistance
			let maxChunkZ = (p.z >> 4) + settings.renderDistance
			let chunk = maxChunkX + "," + maxChunkZ

			if (p.cx !== p.x >> 4 || p.cz !== p.z >> 4) {
				p.cx = p.x >> 4
				p.cz = p.z >> 4

				let dist = (settings.renderDistance) * 16 + 16
				let maxDist = dist * dist
				for (let i = 0; i < this.sortedChunks.length; i++) {
					if (chunkDist(this.sortedChunks[i]) > maxDist) {
						this.sortedChunks.splice(i--, 1)
					}
				}
				this.loadChunks()
			}

			for (let i = 0; i < this.sortedChunks.length; i++) {
				this.sortedChunks[i].dist = chunkDist(this.sortedChunks[i])
			}

			let doneWork
			do {
				doneWork = false
				
				//Re-generate the mesh for chunks with updated blocks
				if (this.meshQueue.length) {
					let len = this.meshQueue.length - 1
					do {
						this.meshQueue[len].genMesh()
					}
					while(len--)
					this.meshQueue.length = 0
				}
				
				if (this.generateQueue.length) {
					let chunk = this.generateQueue.pop()
					this.genChunk(chunk)
					doneWork = true
				}
				else if (this.populateQueue.length) {
					let chunk = this.populateQueue[this.populateQueue.length - 1]
					if (!chunk.caves) {
						chunk.carveCaves()
						doneWork = true
					} else if (!chunk.populated) {
						chunk.populate()
						this.populateQueue.pop()
						doneWork = true
					} else {
						this.populateQueue.pop()
					}
				}

				//Generate new chunks
				if (this.chunkGenQueue.length) {
					let chunk = this.chunkGenQueue[0]
					if (fillReqs(chunk.x >> 4, chunk.z >> 4)) {
						if (!chunk.loaded) {
							chunk.load()
						} else if (!chunk.optimized) {
							chunk.optimize()
							chunk.optimized = true
						} else if (!chunk.buffer) {
							chunk.genMesh()
							doneWork = true
						} else {
							this.chunkGenQueue.shift()
						}
					}
				}

				if (win.performance.now() - tickStart > 8) {
					return
				}
			} while(doneWork)
		}
		render() {
			p2.x = Math.round(p.x)
			p2.y = Math.round(p.y)
			p2.z = Math.round(p.z)
			if (!this.sortedChunks.length) {
				return
			}
			use3d()
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
			p.setDirection()
			initModelView(p)
			let dist = (settings.renderDistance) * 16
			if (this.chunkGenQueue.length) {
				this.chunkGenQueue.sort(sortChunks)
				dist = Math.min(dist, Math.sqrt(chunkDist(this.chunkGenQueue[0])))
			}
			if (dist !== fogDist) {
				if (fogDist < dist - 0.1) fogDist += (dist - fogDist) / 120
				else if (fogDist > dist + 0.1) fogDist += (dist - fogDist) / 30
				else fogDist = dist
			}
			gl.uniform3f(glCache.uPos, p.x, p.y, p.z)
			gl.uniform1f(glCache.uDist, fogDist)

			let chunk = this.chunkGenQueue[0]
			if (chunk && chunk.buffer) {
				this.chunkGenQueue.shift()
			}
			this.sortedChunks.sort(sortChunks)
			this.sortedChunks.sort(sortChunks)

			renderedChunks = 0
			let c = this.sortedChunks
			for (let chunk of c) {
				if (chunk.buffer && p.canSee(chunk.x + 8, chunk.y + 128, chunk.z + 8, 128)) {
					gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffer)
					gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 24, 0)
					gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 24, 12)
					gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 24, 20)
					gl.drawElements(gl.TRIANGLES, chunk.verts, gl.UNSIGNED_INT, 0)
					renderedChunks++
				}
			}
		}
		loadChunks() {
			let renderDistance = settings.renderDistance + 2
			let cx = p.x >> 4
			let cz = p.z >> 4

			//Chunk coordinates of chunks on the edges of the loaded area
			let minChunkX = cx - renderDistance
			let maxChunkX = cx + renderDistance
			let minChunkZ = cz - renderDistance
			let maxChunkZ = cz + renderDistance

			this.offsetX = -minChunkX
			this.offsetZ = -minChunkZ
			this.lwidth = maxChunkX - minChunkX + 1

			//Create chunks that don't exist yet
			let i = 0
			for (let x = minChunkX; x <= maxChunkX; x++) {
				for (let z = minChunkZ; z <= maxChunkZ; z++) {
					let chunk
					if (this.chunks[x] === undefined) {
						this.chunks[x] = []
					}
					if (this.chunks[x][z] === undefined) {
						chunk = new Chunk(x * 16, z * 16)
						if (maxDist(cx, cz, x, z) <= settings.renderDistance) {
							this.chunkGenQueue.push(chunk)
						}
						this.chunks[x][z] = chunk
					}
					chunk = this.chunks[x][z]
					if (!chunk.buffer && !this.chunkGenQueue.includes(chunk) && maxDist(cx, cz, x, z) <= settings.renderDistance) {
						this.chunkGenQueue.push(chunk)
					}
					this.loaded[i++] = chunk
				}
			}
			this.sortedChunks = this.loaded.filter(renderFilter)
			this.sortedChunks.sort(sortChunks)
		}
	}
	}
})