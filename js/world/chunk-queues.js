/* js/world/chunk-queues.js — Funciones de distancia, ordenación y filtrado de colas de chunks | Provee: chunkDist, sortChunks, fillReqs, maxDist, renderFilter, debug | Requiere: p, world, settings, performance | Posee: utilidades de cola de generación y carga | Origen: sección #23 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/chunk-queues",
	order: 23.20,
	name: "Funciones de ordenación, distancia y filtrado de chunks",
	body: function () {
	function chunkDist(c) {
		let dx = p.x - c.x
		let dz = p.z - c.z
		if (dx > 16) {
			dx -= 16
		} else if (dx > 0) {
			dx = 0
		}
		if (dz > 16) {
			dz -= 16
		} else if (dz > 0) {
			dz = 0
		}
		return dx * dx + dz * dz
	}

	function sortChunks(c1, c2) { //Sort the list of chunks based on distance from the player
		let dx1 = p.x - c1.x - 8
		let dy1 = p.z - c1.z - 8
		let dx2 = p.x - c2.x - 8
		let dy2 = p.z - c2.z - 8
		return (dx1 * dx1 + dy1 * dy1) - (dx2 * dx2 + dy2 * dy2)
	}

	function fillReqs(x, z) {
		//Check if the surrounding chunks are ready to have foliage/caves generated in them
		let done = true
		for (let i = x - 2; i <= x + 2; i++) {
			for (let j = z - 2; j <= z + 2; j++) {
				let chunk = world.loaded[(i + world.offsetX) * world.lwidth + j + world.offsetZ]
				if (!chunk) {
					done = false
					continue
				}
				if (!chunk.generated) {
					done = false
					if (!world.generateQueue.includes(chunk)) {
						world.generateQueue.push(chunk)
					}
				}
				if (!chunk.populated && i >= x - 1 && i <= x + 1 && j >= z - 1 && j <= z + 1) {
					done = false
					if (!world.populateQueue.includes(chunk)) {
						world.populateQueue.push(chunk)
					}
				}
			}
		}
		return done
	}

	function maxDist(x, z, x2, z2) {
		let ax = Math.abs(x2 - x)
		let az = Math.abs(z2 - z)
		return ax > az ? ax : az
	}

	function renderFilter(chunk) {
		return maxDist(chunk.x >> 4, chunk.z >> 4, p.cx, p.cz) <= settings.renderDistance
	}

	function debug(message) {
		let ellapsed = performance.now() - debug.start
		if (ellapsed > 30) {
			console.log(message, ellapsed.toFixed(2), "milliseconds")
		}
	}
	}
})