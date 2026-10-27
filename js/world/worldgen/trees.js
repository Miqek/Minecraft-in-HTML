/* js/world/worldgen/trees.js — Población determinista de árboles y minerales | Provee: Chunk.prototype.populate | Requiere: Chunk, world, blockIds, trees, random, randomSeed, hash | Posee: población de superficie y vetas de mineral | Origen: sección #22 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/worldgen/trees",
	order: 23.60,
	name: "Población determinista de árboles y minerales",
	body: function () {
	Chunk.prototype.populate = function () {
		randomSeed(hash(this.x, this.z) * 210000000)
		let place = false
		for (let i = 0; i < 16; i++) {
			for (let k = 0; k < 16; k++) {
				let wx = this.x + i
				let wz = this.z + k
				let ground = this.tops[k * 16 + i]

				if (random() < 0.005 && trees && this.getBlock(i, ground, k)) {
					let top = ground + Math.floor(4.5 + random(2.5))
					let rand = Math.floor(random(4096))
					let tree = random() < 0.6 ? blockIds.oakLog : ++top && blockIds.birchLog

					for (let y = ground + 1; y <= top; y++) {
						this.setBlock(i, y, k, tree)
					}
					world.spawnBlock(wx, ground, wz, blockIds.dirt)

					for (let x = -2; x <= 2; x++) {
						for (let z = -2; z <= 2; z++) {
							if (x || z) {
								if ((x * z & 7) === 4) {
									place = rand & 1
									rand >>>= 1
									if (place) world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
								} else {
									world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
								}
							}
						}
					}

					for (let x = -2; x <= 2; x++) {
						for (let z = -2; z <= 2; z++) {
							if (x || z) {
								if ((x * z & 7) === 4) {
									place = rand & 1
									rand >>>= 1
									if (place) world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
								} else {
									world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
								}
							}
						}
					}

					for (let x = -1; x <= 1; x++) {
						for (let z = -1; z <= 1; z++) {
							if (x || z) {
								if (x & z) {
									place = rand & 1
									rand >>>= 1
									if (place) world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
								} else {
									world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
								}
							}
						}
					}

					world.spawnBlock(wx + 1, top + 1, wz, blockIds.leaves)
					world.spawnBlock(wx, top + 1, wz - 1, blockIds.leaves)
					world.spawnBlock(wx, top + 1, wz + 1, blockIds.leaves)
					world.spawnBlock(wx - 1, top + 1, wz, blockIds.leaves)
				}

				ground -= 4
				if (random() < 3.7 / 256) {
					let y = random() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) this.setBlock(i, y < ground ? y : ground, k, blockIds.diamondOre)
				}
				if (random() < 111.5 / 256) {
					let y = random() * 64 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) this.setBlock(i, y < ground ? y : ground, k, blockIds.ironOre)
				}
				if (random() < 185.5 / 256) {
					let y = random() * ground | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) this.setBlock(i, y < ground ? y : ground, k, blockIds.coalOre)
				}
				if (random() < 10.4 / 256) {
					let y = random() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) this.setBlock(i, y < ground ? y : ground, k, blockIds.goldOre)
				}
				if (random() < 29.1 / 256) {
					let y = random() * 16 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) this.setBlock(i, y < ground ? y : ground, k, blockIds.redstoneOre)
				}
				if (random() < 4.1 / 256) {
					let y = random() * 32 | 0 + 1
					y = y < ground ? y : ground
					if (this.getBlock(i, y, k)) this.setBlock(i, y < ground ? y : ground, k, blockIds.lapisOre)
				}
			}
		}
		this.populated = true
	}
	}
})
