/* js/world/world-save-format.js — Serialización y deserialización de datos del mundo y guardado | Provee: World.prototype.getSaveString, World.prototype.loadSave, World.prototype.loadOldSave | Requiere: World, world, worldSeed, p, superflat, caves, trees | Posee: métodos de formato de guardado | Origen: sección #23 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/world-save-format",
	order: 23.40,
	name: "Métodos de guardado y carga del mundo (World.prototype)",
	body: function () {
	World.prototype.getSaveString = function () {
		let edited = []
		for (let x in this.chunks) {
			for (let z in this.chunks[x]) {
				let chunk = this.chunks[x][z]
				if (chunk.edited) {
					for (let y = 0; y < chunk.sections.length; y++) {
						if (chunk.sections[y].edited) {
							edited.push([ chunk.sections[y], chunk.cleanSections[y] ])
						}
					}
				}
			}
		}

		let pallete = {}
		for (let chunks of edited) {
			let changes = false
			chunks[0].blocks.forEach((id, i) => {
				if (chunks[1][i] !== id) {
					pallete[id] = true
					changes = true
				}
			})
			chunks.changes = changes
		}

		let blocks = Object.keys(pallete).map(n => Number(n))
		pallete = {}
		blocks.forEach((id, i) => pallete[id] = i)

		let rnd = Math.round
		let options = p.flying | superflat << 1 | p.spectator << 2 | caves << 3 | trees << 4
		let playerData = [ rnd(p.x), rnd(p.y), rnd(p.z), rnd(p.rx * 100) / 100, rnd(p.ry * 100) / 100, options.toString(36) ]
		let str = world.name + ";" + worldSeed.toString(36) + ";"
		str += playerData.join(",") + ";"
		str += version + ";"
		str += blocks.map(n => n.toString(36)).join(",") + ";"

		//Coordinates of each edited chunk
		for (let i = 0; i < edited.length; i++) {
			if (!edited[i].changes) {
				continue
			}
			let real = edited[i][0]
			let blocks = real.blocks
			let original = edited[i][1]
			str += real.chunk.x / 16 + "," + real.y / 16 + "," + real.chunk.z / 16 + ";"
			for (let j = 0; j < original.length; j++) {
				if (original[j] !== blocks[j]) {
					str += (pallete[blocks[j]] << 12 | j).toString(36) + ","
				}
			}
			str = str.slice(0, -1) + ";"
		}
		return str.slice(0, -1)
	}

	World.prototype.loadSave = function (str) {
		let data = str.split(";")
		this.name = data.shift()

		worldSeed = parseInt(data.shift(), 36)
		seedHash(worldSeed)
		caveNoise = openSimplexNoise(worldSeed)
		noiseSeed(worldSeed)

		//Player pos, orientation, and other world options
		let playerData = data.shift().split(",")
		p.x = Number(playerData[0])
		p.y = Number(playerData[1])
		p.z = Number(playerData[2])
		p.rx = Number(playerData[3])
		p.ry = Number(playerData[4])
		let options = parseInt(playerData[5], 36)
		p.flying = (options & 1) === 1
		superflat = (options & 2) === 2
		p.spectator = (options & 4) === 4
		caves = (options & 8) === 8
		trees = (options & 16) === 16

		let version = data.shift()
		if (version === "Indev 0.0" || !data[0]) {
			//The save was created before sections were added
			this.loadOldSave(str)
			return
		}

		let pallete = data.shift().split(",").map(n => parseInt(n, 36))

		for (let i = 0; data.length; i++) {
			let blocks = data.shift().split(",")
			this.loadFrom.push({
				x: Number(blocks[0]),
				y: Number(blocks[1]),
				z: Number(blocks[2]),
				blocks: {}
			})
			blocks = data.shift().split(",")
			for (let j = 0; j < blocks.length; j++) {
				let block = parseInt(blocks[j], 36)
				let index = block & 0xfff
				let pid = block >> 12
				this.loadFrom[i].blocks[index] = pallete[pid]
			}
		}
	}

	World.prototype.loadOldSave = function (str) {
		let data = str.split(";");
		this.name = data.shift();

		worldSeed = parseInt(data.shift(), 36);
		seedHash(worldSeed);
		noiseSeed(worldSeed);

		let playerData = data.shift().split(",");
		p.x = Number(playerData[0]);
		p.y = Number(playerData[1]);
		p.z = Number(playerData[2]);
		p.rx = Number(playerData[3]);
		p.ry = Number(playerData[4]);

		let editCount = parseInt(data.shift(), 36);
		if (!editCount) {
			return;
		}
		let coords = data.shift().split(",").map(function(n) {
			return parseInt(n, 36);
		});
		for (let j = 0; j < coords.length; j += 3) {
			this.loadFrom.push({
				x: coords[j],
				y: coords[j + 1],
				z: coords[j + 2],
				blocks: {}
			});
		}

		for (let i = 0; data.length > 0; i++) {
			let blocks = data.shift().split(",");
			for (let j = 0; j < blocks.length; j++) {
				let block = parseInt(blocks[j], 36);
				let index = block >> 8;
				let id = block & 0x7f | (block & 0x80) << 1;
				this.loadFrom[i].blocks[index] = id;
			}
		}
	}
	}
})