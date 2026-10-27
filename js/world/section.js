/* js/world/section.js — Subchunk tridimensional Section de 16x16x16 bloques y optimización de malla | Provee: Section, emptySection, fullSection | Requiere: world, blockData, blockIds, Block, Sides, hideFace, getBlock, getShadows, interpolateShadows, caves | Posee: clase Section e instancias por defecto | Origen: sección #22 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/section",
	order: 22.20,
	name: "Subchunks tridimensionales Section",
	body: function () {
	class Section {
		constructor(x, y, z, size, chunk) {
			this.x = x
			this.y = y
			this.z = z
			this.size = size
			this.arraySize = size * size * size
			this.blocks = new Int32Array(this.arraySize)
			this.compressed = new Uint8Array(this.arraySize)
			this.renderData = []
			this.renderLength = 0
			this.faces = 0
			this.hasVisibleBlocks = false
			this.chunk = chunk
			this.edited = false
			this.caves = !caves
			this.pallete = [0]
			this.palleteMap = {"0": 0}
			this.palleteSize = 0
		}
		getBlock(x, y, z) {
			let s = this.size
			return this.blocks[x * s * s + y * s + z]
		}
		setBlock(x, y, z, blockId) {
			let s = this.size
			this.blocks[x * s * s + y * s + z] = blockId
		}
		deleteBlock(x, y, z) {
			let s = this.size
			this.blocks[x * s * s + y * s + z] = 0
		}
		optimize() {
			let visible = false
			let pos = 0
			let xx = this.x
			let yy = this.y
			let zz = this.z
			let blockState = 0
			let palleteIndex = 0
			let index = 0
			let s = this.size
			let blocks = this.blocks
			this.hasVisibleBlocks = false
			this.renderLength = 0
			let localBlocks = world.getAdjacentSubchunks(xx, yy, zz)

			//Check all the blocks in the subchunk to see if they're visible.
			for (let i = 0; i < s; i++) {
				for (let j = 0; j < s; j++) {
					for (let k = 0; k < s; k++, index++) {
						blockState = blocks[index]

						if (this.palleteMap[blockState] === undefined) {
							this.palleteMap[blockState] = this.pallete.length
							palleteIndex = this.pallete.length
							this.pallete.push(blockState)
						} else {
							palleteIndex = this.palleteMap[blockState]
						}

						visible = blockState && (hideFace(i-1, j, k, localBlocks, blockState, getBlock, "west", "east")
						| hideFace(i+1, j, k, localBlocks, blockState, getBlock, "east", "west") << 1
						| hideFace(i, j-1, k, localBlocks, blockState, getBlock, "bottom", "top") << 2
						| hideFace(i, j+1, k, localBlocks, blockState, getBlock, "top", "bottom") << 3
						| hideFace(i, j, k-1, localBlocks, blockState, getBlock, "south", "north") << 4
						| hideFace(i, j, k+1, localBlocks, blockState, getBlock, "north", "south") << 5)
						if (visible) {
							pos = (i | j << 4 | k << 8) << 19
							this.renderData[this.renderLength++] = 1 << 31 | pos | visible << 13 | palleteIndex
							this.hasVisibleBlocks = true
						}
					}
				}
			}
		}
		updateBlock(x, y, z, world) {
			if (!world.meshQueue.includes(this.chunk)) {
				world.meshQueue.push(this.chunk)
			}
			let i = x
			let j = y
			let k = z
			let s = this.size
			x += this.x
			y += this.y
			z += this.z
			let blockState = this.blocks[i * s * s + j * s + k]
			let visible = blockState && (hideFace(x-1, y, z, 0, blockState, world.getBlock, "west", "east")
			| hideFace(x+1, y, z, 0, blockState, world.getBlock, "east", "west") << 1
			| hideFace(x, y-1, z, 0, blockState, world.getBlock, "bottom", "top") << 2
			| hideFace(x, y+1, z, 0, blockState, world.getBlock, "top", "bottom") << 3
			| hideFace(x, y, z-1, 0, blockState, world.getBlock, "south", "north") << 4
			| hideFace(x, y, z+1, 0, blockState, world.getBlock, "north", "south") << 5)
			let pos = (i | j << 4 | k << 8) << 19
			let index = -1

			// Find index of current block in this.renderData
			for (let i = 0; i < this.renderLength; i++) {
				if ((this.renderData[i] & 0x7ff80000) === pos) {
					index = i
					break
				}
			}

			// Update pallete
			if (this.palleteMap[blockState] === undefined) {
				this.palleteMap[blockState] = this.pallete.length
				this.pallete.push(blockState)
			}

			if (index < 0 && !visible) {
				// Wasn't visible before, isn't visible after.
				return
			}
			if (!visible) {
				// Was visible before, isn't visible after.
				this.renderData.splice(index, 1)
				this.renderLength--
				this.hasVisibleBlocks = !!this.renderLength
				return
			}
			if (visible && index < 0) {
				// Wasn't visible before, is visible after.
				index = this.renderLength++
				this.hasVisibleBlocks = true
			}
			this.renderData[index] = 1 << 31 | pos | visible << 13 | this.palleteMap[blockState]
		}
		genMesh(barray, index) {
			if (!this.renderLength) {
				return index
			}
			let length = this.renderLength
			let rData = this.renderData
			let x = 0, y = 0, z = 0, loc = 0, data = 0, sides = 0, tex = null, x2 = 0, y2 = 0, z2 = 0, verts = null, texVerts = null, texShapeVerts = null, tx = 0, ty = 0
			let wx = this.x, wy = this.y, wz = this.z
			let blocks = world.getAdjacentSubchunks(wx, wy, wz)
			let block = null

			let shadows = null
			let blockSides = Object.keys(Block)
			let side = ""
			let shapeVerts = null
			let shapeTexVerts = null
			let pallete = this.pallete
			let intShad = interpolateShadows
			
			for (let i = 0; i < length; i++) {
				data = rData[i]
				block = blockData[pallete[data & 0x1fff]]
				tex = block.textures
				sides = data >> 13 & 0x3f
				loc = data >> 19 & 0xfff
				x = loc & 15
				y = loc >> 4 & 15
				z = loc >> 8 & 15

				x2 = x + this.x
				y2 = y + this.y
				z2 = z + this.z

				shapeVerts = block.shape.verts
				shapeTexVerts = block.shape.texVerts

				let texNum = 0
				for (let n = 0; n < 6; n++) {
					side = blockSides[n]
					if (sides & Block[side]) {
						shadows = getShadows[side](x, y, z, blocks)
						let directionalFaces = shapeVerts[Sides[side]]
						// if (directionalFaces.length > 1) {
						// 	let average = (shadows[0] + shadows[1] + shadows[2] + shadows[3]) / 4
						// 	shadows[0] = average
						// 	shadows[1] = average
						// 	shadows[2] = average
						// 	shadows[3] = average
						// }
						for (let facei = 0; facei < directionalFaces.length; facei++) {
							verts = directionalFaces[facei]
							texVerts = textureCoords[textureMap[tex[texNum]]]
							tx = texVerts[0]
							ty = texVerts[1]
							texShapeVerts = shapeTexVerts[n][facei]
							
							for (let j = 0; j < 4; j++) {
								barray[index++] = verts[j * 3 + 0] + x2
								barray[index++] = verts[j * 3 + 1] + y2
								barray[index++] = verts[j * 3 + 2] + z2
								barray[index++] = tx + texShapeVerts[j * 2]
								barray[index++] = ty + texShapeVerts[j * 2 + 1]
								barray[index++] = intShad(shadows, verts[j * 3 + 0] + 0.5, verts[j * 3 + 2] + 0.5)
							}
						}
					}
					texNum++
				}
			}
			return index
		}
		carveCaves() {
			let endX = this.x + 16
			let endZ = this.z + 16
			for (let x = this.x, xx = 0; x < endX; x++, xx++) {
				for (let z = this.z, zz = 0; z < endZ; z++, zz++) {
					let top = this.chunk.tops[zz * 16 + xx]
					for (let y = this.y; y < top; y++) {
						if (isCave(x, y, z)) {
							carveSphere(x, y, z)
						}
					}
				}
			}
			this.caves = true
		}
		spreadFoliage(x, y, z) {
			let wx = this.x + 16, wz = this.z + 16, wy = this.y + 16
			for (let x = this.x, xx = 0; x < wx; x++, xx++) {
				for (let z = this.z, zz = 0; z < wz; z++, zz++) {
					// Grass foliage
					for (let y = this.y; y < wy; y++) {
						if (world.getBlock(x, y, z) === blockIds.grass && world.getBlock(x, y + 1, z) === blockIds.air && Math.random() < 0.1) {
							world.setBlock(x, y + 1, z, blockIds.grassLeaves)
							break
						}
					}
				}
			}
		}
		spreadFoliage2() {
			// Alt-leaves foliage
			for (let i = 0; i < 3; i++) {
				let rnd = Math.random() * this.blocks.length | 0
				if (this.blocks[rnd] !== blockIds.leaves) {
					continue
				}
				let x = (rnd >> 8) + this.x
				let y = (rnd >> 4 & 15) + this.y
				let z = (rnd & 15) + this.z
				if (world.getBlock(x, y - 1, z) !== blockIds.leaves) {
					continue
				}
				for (let j = 0; j < 4; j++) {
					let rnd2 = Math.random() * 27 | 0
					let x2 = rnd2 % 3 - 1
					rnd2 = rnd2 / 3 | 0
					let y2 = rnd2 % 3 - 1
					rnd2 = rnd2 / 3 | 0
					let z2 = rnd2 % 3 - 1
					if (world.getBlock(x + x2, y + y2, z + z2) === blockIds.leaves && world.getBlock(x + x2, y + y2 - 1, z + z2) === blockIds.air) {
						world.setBlock(x + x2, y + y2 - 1, z + z2, blockIds.altLeaves)
						break
					}
				}
			}
		}
	}
	let emptySection = new Section(0, 0, 0, 16)
	let fullSection = new Section(0, 0, 0, 16)
	fullSection.blocks.fill(blockIds.bedrock)
	}
})