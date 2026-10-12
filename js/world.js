/*
 * js/world.js — Entorno, hash y semilla, ruido (Perlin/OpenSimplex), persistencia en IndexedDB, cuevas, Section/Chunk/World y menú de mundos.
 *
 * Secciones (nº = orden de ensamblado · líneas del HTML original):
 *   #04  Entorno (win/doc/console), hash, aleatoriedad, Perlin y OpenSimplex  (614–908)
 *   #07  Semilla aleatoria inicial  (979–980)
 *   #08  Persistencia en IndexedDB y save()  (981–1063)
 *   #21  Esfera para cuevas, isCave y carveSphere  (2789–2826)
 *   #22  Sombras, Section y Chunk  (2827–3542)
 *   #23  Analíticas, utilidades de chunks y clase World  (3543–4089)
 *   #36  initWorldsMenu(): lista de mundos guardados  (5319–5403)
 *
 * El juego original es UNA función (MineKhan) con variables compartidas; cada sección se registra
 * en window.MineKhanParts y js/main.js las reensambla en orden. Ver README.md.
 */

window.MineKhanParts = window.MineKhanParts || []

/* ── Sección #04 · Entorno (win/doc/console), hash, aleatoriedad, Perlin y OpenSimplex · líneas originales 614–908 ── */
window.MineKhanParts.push({ order: 4, name: "Entorno (win/doc/console), hash, aleatoriedad, Perlin y OpenSimplex", body: function () {
	let win = window.parent
	let doc = document
	let console = win.console
	let world

	let seedHash
	let hash = (function() {
		let seed = Math.random() * 2100000000 | 0
		let PRIME32_2 = 1883677709
		let PRIME32_3 = 2034071983
		let PRIME32_4 = 668265263
		let PRIME32_5 = 374761393

		seedHash = function(s) {
			seed = s | 0
		}

		return function(x, y) {
			let h32 = 0

			h32 = seed + PRIME32_5 | 0
			h32 += 8

			h32 += Math.imul(x, PRIME32_3)
			h32 = Math.imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)
			h32 += Math.imul(y, PRIME32_3)
			h32 = Math.imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)

			h32 ^= h32 >> 15
			h32 *= PRIME32_2
			h32 ^= h32 >> 13
			h32 *= PRIME32_3
			h32 ^= h32 >> 16

			return h32 / 2147483647
		}
	})()
	let worldSeed

	
	let currentRandom = null
	function Marsaglia(i1, i2) {
	
		let z = (i1 | 0) || 362436069, w = i2 || hash(521288629, z) * 2147483647 | 0

		let nextInt = function() {
			z=36969*(z&65535)+(z>>>16) & 0xFFFFFFFF
			w=18000*(w&65535)+(w>>>16) & 0xFFFFFFFF
			return ((z&0xFFFF)<<16 | w&0xFFFF) & 0xFFFFFFFF
		}

		this.nextDouble = function() {
			let i = nextInt() / 4294967296
			return i < 0 ? 1 + i : i
		}
		this.nextInt = nextInt
	}
	let randomSeed = function(seed) {
		currentRandom = (new Marsaglia(seed)).nextDouble
	}
	let random = function(min, max) {
		if (!max) {
			if (min) {
				max = min
				min = 0
			} else {
				min = 0
				max = 1
			}
		}
		return currentRandom() * (max - min) + min
	}
	let noiseProfile = { generator: undefined, octaves: 4, fallout: 0.5, seed: undefined }
	function PerlinNoise(seed) {
		let rnd = seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized()
		let i, j
		
		let perm = new Uint8Array(512)
		for(i=0;i<256;++i) {
			perm[i] = i
		}
		for(i=0;i<256;++i) {
			let t = perm[j = rnd.nextInt() & 0xFF]; perm[j] = perm[i]; perm[i] = t
		}
		
		for(i=0;i<256;++i) {
			perm[i + 256] = perm[i]
		}

		function grad3d(i,x,y,z) {
			let h = i & 15; 
			let u = h<8 ? x : y,
				v = h<4 ? y : h===12||h===14 ? x : z
			return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v)
		}

		function grad2d(i,x,y) {
			let v = (i & 1) === 0 ? x : y
			return (i&2) === 0 ? -v : v
		}

		function grad1d(i,x) {
			return (i&1) === 0 ? -x : x
		}

		function lerp(t,a,b) {
			return a + t * (b - a)
		}

		this.noise3d = function(x, y, z) {
			let X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
			x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
			let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z
			let p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
				p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z
			return lerp(fz,
				lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
					lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
				lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
					lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))))
		}

		this.noise2d = function(x, y) {
			let X = Math.floor(x)&255, Y = Math.floor(y)&255
			x -= Math.floor(x); y -= Math.floor(y)
			let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y
			let p0 = perm[X]+Y, p1 = perm[X + 1] + Y
			return lerp(fy,
				lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
				lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)))
		}

		this.noise1d = function(x) {
			let X = Math.floor(x)&255
			x -= Math.floor(x)
			let fx = (3-2*x)*x*x
			return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1))
		}
	}
	let noiseSeed = function(seed) {
		noiseProfile.seed = seed
		noiseProfile.generator = new PerlinNoise(noiseProfile.seed)
	}
	let noise = function(x, y, z) {
		let generator = noiseProfile.generator
		let effect = 1, k = 1, sum = 0
		for(let i = 0; i < noiseProfile.octaves; ++i) {
			effect *= noiseProfile.fallout
			switch (arguments.length) {
				case 1:
					sum += effect * (1 + generator.noise1d(k*x))/2; break
				case 2:
					sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break
				case 3:
					sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break
			}
			k *= 2
		}
		return sum
	}

	let caveNoise
	
	function openSimplexNoise(clientSeed) {
		const SQ4 = 2
		const toNums = function(s) { return s.split(",").map(function(s) { return new Uint8Array(s.split("").map(function(v) { return Number(v) })) }) }
		const decode = function(m, r, s) { return new Int8Array(s.split("").map(function(v) { return parseInt(v, r) + m })) }
		const toNumsB32 = function(s) { return s.split(",").map(function(s) { return parseInt(s, 32) }) }
		const NORM_3D = 1.0 / 206.0
		const SQUISH_3D = 1 / 3
		const STRETCH_3D = -1 / 6
		var base3D = toNums("0000110010101001,2110210120113111,110010101001211021012011")
		const gradients3D = decode(-11, 23, "0ff7mf7fmmfffmfffm07f70f77mm7ff0ff7m0f77m77f0mf7fm7ff0077707770m77f07f70")
		var lookupPairs3D = function() { return new Uint16Array(toNumsB32("0,2,1,1,2,2,5,1,6,0,7,0,10,2,12,2,41,1,45,1,50,5,51,5,g6,0,g7,0,h2,4,h6,4,k5,3,k7,3,l0,5,l1,5,l2,4,l5,3,l6,4,l7,3,l8,d,l9,d,la,c,ld,e,le,c,lf,e,m8,k,ma,i,p9,l,pd,n,q8,k,q9,l,15e,j,15f,m,16a,i,16e,j,19d,n,19f,m,1a8,f,1a9,h,1aa,f,1ad,h,1ae,g,1af,g,1ag,b,1ah,a,1ai,b,1al,a,1am,9,1an,9,1bg,b,1bi,b,1eh,a,1el,a,1fg,8,1fh,8,1qm,9,1qn,9,1ri,7,1rm,7,1ul,6,1un,6,1vg,8,1vh,8,1vi,7,1vl,6,1vm,7,1vn,6")) }
		var p3D = decode(-1, 5, "112011210110211120110121102132212220132122202131222022243214231243124213241324123222113311221213131221123113311112202311112022311112220342223113342223311342223131322023113322023311320223113320223131322203311322203131")
		const setOf = function(count) { var a = [],i = 0; while (i < count) { a.push(i++) } return a }
		const doFor = function(count, cb) { var i = 0; while (i < count && cb(i++) !== true) {} }

		function shuffleSeed(seed,count){
			seed = seed * 1664525 + 1013904223 | 0
			count -= 1
			return count > 0 ? shuffleSeed(seed, count) : seed
		}
		const types = {
			_3D : {
				base : base3D,
				squish : SQUISH_3D,
				dimensions : 3,
				pD : p3D,
				lookup : lookupPairs3D,
			}
		}

		function createContribution(type, baseSet, index) {
			var i = 0
			const multiplier = baseSet[index ++]
			const c = { next : undefined }
			while(i < type.dimensions) {
				const axis = ("xyzw")[i]
				c[axis + "sb"] = baseSet[index + i]
				c["d" + axis] = - baseSet[index + i++] - multiplier * type.squish
			}
			return c
		}

		function createLookupPairs(lookupArray, contributions){
			var i
			const a = lookupArray()
			const res = new Map()
			for (i = 0; i < a.length; i += 2) { res.set(a[i], contributions[a[i + 1]]); }
			return res
		}

		function createContributionArray(type) {
			const conts = []
			const d = type.dimensions
			const baseStep = d * d
			var k, i = 0
			while (i < type.pD.length) {
				const baseSet = type.base[type.pD[i]]
				let previous, current
				k = 0
				do {
					current = createContribution(type, baseSet, k)
					if (!previous) { conts[i / baseStep] = current; }
					else { previous.next = current; }
					previous = current
					k += d + 1
				} while(k < baseSet.length)

				current.next = createContribution(type, type.pD, i + 1)
				if (d >= 3) { current.next.next = createContribution(type, type.pD, i + d + 2) }
				if (d === 4) { current.next.next.next = createContribution(type, type.pD, i + 11) }
				i += baseStep
			}
			const result = [conts, createLookupPairs(type.lookup, conts)]
			type.base = undefined
			type.lookup = undefined
			return result
		}

		let temp = createContributionArray(types._3D)
		const contributions3D = temp[0], lookup3D = temp[1]
		const perm = new Uint8Array(256)
		const perm3D = new Uint8Array(256)
		const source = new Uint8Array(setOf(256))
		var seed = shuffleSeed(clientSeed, 3)
		doFor(256, function(i) {
			i = 255 - i
			seed = shuffleSeed(seed, 1)
			var r = (seed + 31) % (i + 1)
			r += r < 0 ? i + 1 : 0
			perm[i] = source[r]
			perm3D[i] = (perm[i] % 24) * 3
			source[r] = source[i]
		})
		base3D = undefined
		lookupPairs3D = undefined
		p3D = undefined

		return function(x, y, z) {
			const pD = perm3D
			const p = perm
			const g = gradients3D
			const stretchOffset = (x + y + z) * STRETCH_3D
			const xs = x + stretchOffset, ys = y + stretchOffset, zs = z + stretchOffset
			const xsb = Math.floor(xs), ysb = Math.floor(ys), zsb = Math.floor(zs)
			const squishOffset	= (xsb + ysb + zsb) * SQUISH_3D
			const dx0 = x - (xsb + squishOffset), dy0 = y - (ysb + squishOffset), dz0 = z - (zsb + squishOffset)
			const xins = xs - xsb, yins = ys - ysb, zins = zs - zsb
			const inSum = xins + yins + zins
			var c = lookup3D.get(
				(yins - zins + 1) |
				((xins - yins + 1) << 1) |
				((xins - zins + 1) << 2) |
				(inSum << 3) |
				((inSum + zins) << 5) |
				((inSum + yins) << 7) |
				((inSum + xins) << 9)
			)
			var i, value = 0
			while (c !== undefined) {
				const dx = dx0 + c.dx, dy = dy0 + c.dy, dz = dz0 + c.dz
				let attn = 2 - dx * dx - dy * dy - dz * dz
				if (attn > 0) {
					i = pD[(((p[(xsb + c.xsb) & 0xFF] + (ysb + c.ysb)) & 0xFF) + (zsb + c.zsb)) & 0xFF]
					attn *= attn
					value += attn * attn * (g[i++] * dx + g[i++] * dy + g[i] * dz)
				}
				c = c.next
			}
			return value * NORM_3D + 0.5
		}
	}

} });

/* ── Sección #07 · Semilla aleatoria inicial · líneas originales 979–980 ── */
window.MineKhanParts.push({ order: 7, name: "Semilla aleatoria inicial", body: function () {
	randomSeed(Math.random() * 10000000 | 0)

} });

/* ── Sección #08 · Persistencia en IndexedDB y save() · líneas originales 981–1063 ── */
window.MineKhanParts.push({ order: 8, name: "Persistencia en IndexedDB y save()", body: function () {
	async function createDatabase() {
		return await new Promise(async (resolve, reject) => {
			let request = window.indexedDB.open("MineKhan", 1)

			request.onupgradeneeded = function(event) {
				let DB = event.target.result
				
				let store = DB.createObjectStore("worlds", { keyPath: "id" })
				store.createIndex("id", "id", { unique: true })
				store.createIndex("data", "data", { unique: false })
			}

			request.onsuccess = function(e) {
				resolve(request.result)
			}

			request.onerror = function(e) {
				console.error(e)
				reject(e)
			}
		})
	}
	async function loadFromDB(id) {
		return await new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = id ? store.get(id) : store.getAll()
			req.onsuccess = function(e) {
				resolve(req.result)
				db.close()
			}
			req.onerror = function(e) { 
				resolve(null)
				db.close()
			}
		})
	}
	async function saveToDB(id, data) {
		return new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = store.put({ id: id, data: data })
			req.onsuccess = function() {
				resolve(req.result)
			}
			req.onerror = function(e) {
				reject(e)
			}
		})
	}
	async function deleteFromDB(id) {
		return new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = store.delete(id)
			req.onsuccess = function() {
				resolve(req.result)
			}
			req.onerror = function(e) {
				reject(e)
			}
		})
	}

	function save() {
		saveToDB(world.id, {
			id: world.id,
			edited: Date.now(),
			name: world.name,
			version: version,
			code: world.getSaveString()
		}).then(() => world.edited = Date.now()).catch(e => console.error(e))
	}

	
	win.saveToDB = saveToDB
	win.loadFromDB = loadFromDB
	win.createDatabase = createDatabase
	win.deleteFromDB = deleteFromDB

} });

/* ── Sección #21 · Esfera para cuevas, isCave y carveSphere · líneas originales 2789–2826 ── */
window.MineKhanParts.push({ order: 21, name: "Esfera para cuevas, isCave y carveSphere", body: function () {
	// Save the coords for a small sphere used to carve out caves
	let sphere;
	{
		let blocks = []
		let radius = 3.5
		let radsq = radius * radius
		for (let i = -radius; i <= radius; i++) {
			for (let j = -radius; j <= radius; j++) {
				for (let k = -radius; k <= radius; k++) {
					if (i*i + j*j + k*k < radsq) {
						blocks.push(i|0, j|0, k|0)
					}
				}
			}
		}
		sphere = new Int8Array(blocks)
	}

	function isCave(x, y, z) {
		// Generate a 3D rigid multifractal noise shell.
		// Then generate another one with different coordinates.
		// Overlay them on top of each other, and the overlapping parts should form a cave-like structure.
		// This is extremely slow, and requires generating 2 noise values for every single block in the world.
		// TODO: replace with a crawler system of some sort, that will never rely on a head position in un-generated chunks.
		let smooth = 0.02
		let caveSize = 0.0055
		let cave1 = Math.abs(0.5 - caveNoise(x * smooth, y * smooth, z * smooth)) < caveSize
		let cave2 = Math.abs(0.5 - caveNoise(y * smooth, z * smooth, x * smooth)) < caveSize
		return (cave1 && cave2)
	}
	function carveSphere(x, y, z) {
		if (y > 3) {
			for (let i = 0; i < sphere.length; i += 3) {
				world.setBlock(x + sphere[i], y + sphere[i + 1], z + sphere[i + 2], blockIds.air, true)
			}
		}
	}

} });

/* ── Sección #22 · Sombras, Section y Chunk · líneas originales 2827–3542 ── */
window.MineKhanParts.push({ order: 22, name: "Sombras, Section y Chunk", body: function () {
	let renderedChunks = 0
	function getBlock(x, y, z, blocks) {
		return blocks[((x >> 4) + 1) * 9 + ((y >> 4) + 1) * 3 + (z >> 4) + 1][((x & 15) << 8) + ((y & 15) << 4) + (z & 15)]
	}
	/**
	 * Returns a 1 if the face is exposed and should be drawn, or a 0 if the face is hidden
	 * 
	 * @param {number} x - The X coordinate of the block that may be covering a face
	 * @param {number} y - The Y coordinate of the block that may be covering a face
	 * @param {number} z - The Z coordinate of the block that may be covering a face
	 * @param {Collection} blocks - Some collection of blocks that can return the block at (x, y, z)
	 * @param {number} type - The blockstate of the block that's being considered for face culling
	 * @param {function} func - The function that can be called to return a block from the blocks collection
	*/
	function hideFace(x, y, z, blocks, type, func, sourceDir, dir) {
		let block = func.call(world, x, y, z, blocks)
		if (!block) {
			return 1
		}

		let data = blockData[block]
		let sourceData = blockData[type]

		let sourceRange = 3
		let hiderRange = 3
		if (func !== getBlock || screen === "loading") {
			// getBlock is only used during the optimize phase of worldGen
			sourceRange = sourceData.shape.cull[sourceDir]
			hiderRange = data.shape.cull[dir]
		}

		if ((sourceRange & hiderRange) !== sourceRange || sourceRange === 0 || block !== type && data.transparent || data.transparent && data.shadow) {
			return 1
		}
		return 0
	}
	let getShadows = {
		shade: [ 1, 0.85, 0.7, 0.6, 0.3 ],
		ret: [],
		blocks: [],
		top: function(x, y, z, block) { // Actually the bottom... How did these get flipped?
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x, y-1, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y-1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y-1, z, block)].shadow
			blocks[4] = blockData[getBlock(x, y-1, z, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y-1, z, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y-1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x, y-1, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y-1, z+1, block)].shadow

			ret[0] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.75
			ret[1] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.75
			ret[2] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.75
			ret[3] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.75
			return ret
		},
		bottom: function(x, y, z, block) { // Actually the top
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y+1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x, y+1, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y+1, z, block)].shadow
			blocks[4] = blockData[getBlock(x, y+1, z, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y+1, z, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y+1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x, y+1, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]
			ret[2] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]
			ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]
			return ret
		},
		north: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z+1, block)].shadow
			blocks[1] = blockData[getBlock(x, y-1, z+1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y-1, z+1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y, z+1, block)].shadow
			blocks[4] = blockData[getBlock(x, y, z+1, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y, z+1, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y+1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x, y+1, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.95
			ret[1] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.95
			ret[2] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.95
			ret[3] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.95
			return ret
		},
		south: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x-1, y, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x-1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x, y-1, z-1, block)].shadow
			blocks[4] = blockData[getBlock(x, y, z-1, block)].shadow
			blocks[5] = blockData[getBlock(x, y+1, z-1, block)].shadow
			blocks[6] = blockData[getBlock(x+1, y-1, z-1, block)].shadow
			blocks[7] = blockData[getBlock(x+1, y, z-1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z-1, block)].shadow

			ret[0] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.95
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.95
			ret[2] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.95
			ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.95
			return ret
		},
		east: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x+1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x+1, y, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x+1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x+1, y-1, z, block)].shadow
			blocks[4] = blockData[getBlock(x+1, y, z, block)].shadow
			blocks[5] = blockData[getBlock(x+1, y+1, z, block)].shadow
			blocks[6] = blockData[getBlock(x+1, y-1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x+1, y, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x+1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[1] + blocks[2] + blocks[4] + blocks[5]]*0.8
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[8] + blocks[7]]*0.8
			ret[2] = this.shade[blocks[4] + blocks[3] + blocks[7] + blocks[6]]*0.8
			ret[3] = this.shade[blocks[0] + blocks[1] + blocks[3] + blocks[4]]*0.8
			return ret
		},
		west: function(x, y, z, block) {
			let blocks = this.blocks
			let ret = this.ret
			blocks[0] = blockData[getBlock(x-1, y-1, z-1, block)].shadow
			blocks[1] = blockData[getBlock(x-1, y, z-1, block)].shadow
			blocks[2] = blockData[getBlock(x-1, y+1, z-1, block)].shadow
			blocks[3] = blockData[getBlock(x-1, y-1, z, block)].shadow
			blocks[4] = blockData[getBlock(x-1, y, z, block)].shadow
			blocks[5] = blockData[getBlock(x-1, y+1, z, block)].shadow
			blocks[6] = blockData[getBlock(x-1, y-1, z+1, block)].shadow
			blocks[7] = blockData[getBlock(x-1, y, z+1, block)].shadow
			blocks[8] = blockData[getBlock(x-1, y+1, z+1, block)].shadow

			ret[0] = this.shade[blocks[7] + blocks[8] + blocks[4] + blocks[5]]*0.8
			ret[1] = this.shade[blocks[5] + blocks[4] + blocks[2] + blocks[1]]*0.8
			ret[2] = this.shade[blocks[4] + blocks[3] + blocks[1] + blocks[0]]*0.8
			ret[3] = this.shade[blocks[6] + blocks[7] + blocks[3] + blocks[4]]*0.8
			return ret
		},
	}

	function interpolateShadows(shadows, x, y) {
		let sx = (shadows[1] - shadows[0]) * x + shadows[0]
		let sx2 = (shadows[3] - shadows[2]) * x + shadows[2]
		return (sx2 - sx) * y + sx
	}

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

							barray[index] = verts[0] + x2
							barray[index+1] = verts[1] + y2
							barray[index+2] = verts[2] + z2
							barray[index+3] = tx + texShapeVerts[0]
							barray[index+4] = ty + texShapeVerts[1]
							barray[index+5] = shadows[0]

							barray[index+6] = verts[3] + x2
							barray[index+7] = verts[4] + y2
							barray[index+8] = verts[5] + z2
							barray[index+9] = tx + texShapeVerts[2]
							barray[index+10] = ty + texShapeVerts[3]
							barray[index+11] = shadows[1]

							barray[index+12] = verts[6] + x2
							barray[index+13] = verts[7] + y2
							barray[index+14] = verts[8] + z2
							barray[index+15] = tx + texShapeVerts[4]
							barray[index+16] = ty + texShapeVerts[5]
							barray[index+17] = shadows[2]

							barray[index+18] = verts[9] + x2
							barray[index+19] = verts[10] + y2
							barray[index+20] = verts[11] + z2
							barray[index+21] = tx + texShapeVerts[6]
							barray[index+22] = ty + texShapeVerts[7]
							barray[index+23] = shadows[3]
							index += 24
						}
					}
					texNum++
				}
			}
			return index
		}
		carveCaves() {
			let wx = this.x + 16, wz = this.z + 16, wy = this.y + 16
			for (let x = this.x, xx = 0; x < wx; x++, xx++) {
				for (let z = this.z, zz = 0; z < wz; z++, zz++) {
					wy = this.chunk.tops[zz * 16 + xx]
					for (let y = this.y; y < wy; y++) {
						if (isCave(x, y, z)) {
							carveSphere(x, y, z)
						}
					}
				}
			}
			this.caves = true
		}
		tick() {
			for (let i = 0; i < 3; i++) {
				let rnd = Math.random() * this.blocks.length | 0
				if ((this.blocks[rnd]) === blockIds.grass) {
					// Spread grass

					let x = (rnd >> 8) + this.x
					let y = (rnd >> 4 & 15) + this.y
					let z = (rnd & 15) + this.z
					if (!blockData[world.getBlock(x, y + 1, z)].transparent) {
						world.setBlock(x, y, z, blockIds.dirt, false)
						return
					}

					let rnd2 = Math.random() * 27 | 0
					let x2 = rnd2 % 3 - 1
					rnd2 = (rnd2 - x2 - 1) / 3
					let y2 = rnd2 % 3 - 1
					rnd2 = (rnd2 - y2 - 1) / 3
					z += rnd2 - 1
					x += x2
					y += y2

					if (world.getBlock(x, y, z) === blockIds.dirt && world.getBlock(x, y + 1, z) === blockIds.air) {
						world.setBlock(x, y, z, blockIds.grass, false)
					}
				}
			}
		}
	}
	let emptySection = new Section(0, 0, 0, 16)
	let fullSection = new Section(0, 0, 0, 16)
	fullSection.blocks.fill(blockIds.bedrock)

	class Chunk {
		constructor(x, z) {
			this.x = x
			this.z = z
			this.maxY = 0
			this.minY = 255
			this.sections = []
			this.cleanSections = []
			this.tops = new Uint8Array(16 * 16); // Store the heighest block at every (x,z) coordinate
			this.optimized = false
			this.generated = false; // Terrain
			this.populated = superflat; // Trees and ores
			this.lazy = false
			this.edited = false
			this.loaded = false
			this.caves = !caves
		}
		getBlock(x, y, z) {
			let s = y >> 4
			return this.sections.length > s ? this.sections[s].getBlock(x, y & 15, z) : 0
		}
		setBlock(x, y, z, blockID, hidden, user) {
			if (!this.sections[y >> 4]) {
				do {
					this.sections.push(new Section(this.x, this.sections.length * 16, this.z, 16, this))
				} while (!this.sections[y >> 4])
			}
			if (user && !this.sections[y >> 4].edited) {
				this.cleanSections[y >> 4] = this.sections[y >> 4].blocks.slice()
				this.sections[y >> 4].edited = true
				this.edited = true
			}
			this.sections[y >> 4].setBlock(x, y & 15, z, blockID, hidden)
		}
		optimize() {
			for (let i = 0; i < this.sections.length; i++) {
				this.sections[i].optimize()
			}
			if (!world.meshQueue.includes(this)) {
				world.meshQueue.push(this)
			}
			this.optimized = true
		}
		render() {
			if (!this.buffer) {
				return
			}
			if (p.canSee(this.x, this.minY, this.z, this.maxY)) {
				renderedChunks++
				gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
				gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 24, 0)
				gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 24, 12)
				gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 24, 20)
				gl.drawElements(gl.TRIANGLES, 6 * this.faces, gl.UNSIGNED_INT, 0)
			}
		}
		updateBlock(x, y, z, world, lazy) {
			if (this.buffer) {
				this.lazy = lazy
				if (this.sections.length > y >> 4) {
					this.sections[y >> 4].updateBlock(x, y & 15, z, world)
				}
			}
		}
		deleteBlock(x, y, z, user) {
			if (!this.sections[y >> 4]) {
				return
			}
			if (user && !this.sections[y >> 4].edited) {
				this.cleanSections[y >> 4] = this.sections[y >> 4].blocks.slice()
				this.sections[y >> 4].edited = true
				this.edited = true
			}
			this.sections[y >> 4].deleteBlock(x, y & 15, z)
			this.minY = y < this.minY ? y : this.minY
			this.maxY = y > this.maxY ? y : this.maxY
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
		}
		populate() {
			randomSeed(hash(this.x, this.z) * 210000000)
			let wx = 0, wz = 0, ground = 0, top = 0, rand = 0, place = false

			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++) {
					wx = this.x + i
					wz = this.z + k
					ground = this.tops[k * 16 + i]
					if (trees && random() < 0.005 && this.getBlock(i, ground, k)) {

						top = ground + Math.floor(4.5 + random(2.5))
						rand = Math.floor(random(4096))
						let tree = random() < 0.6 ? blockIds.oakLog : ++top && blockIds.birchLog

						//Center
						for (let j = ground + 1; j <= top; j++) {
							this.setBlock(i, j, k, tree)
						}
						this.setBlock(i, top + 1, k, blockIds.leaves)
						this.setBlock(i, ground, k, blockIds.dirt)

						//Bottom leaves
						for (let x = -2; x <= 2; x++) {
							for (let z = -2; z <= 2; z++) {
								if (x || z) {
									if ((x * z & 7) === 4) {
										place = rand & 1
										rand >>>= 1
										if (place) {
											world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
										}
									} else {
										world.spawnBlock(wx + x, top - 2, wz + z, blockIds.leaves)
									}
								}
							}
						}

						//2nd layer leaves
						for (let x = -2; x <= 2; x++) {
							for (let z = -2; z <= 2; z++) {
								if (x || z) {
									if ((x * z & 7) === 4) {
										place = rand & 1
										rand >>>= 1
										if (place) {
											world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
										}
									} else {
										world.spawnBlock(wx + x, top - 1, wz + z, blockIds.leaves)
									}
								}
							}
						}

						//3rd layer leaves
						for (let x = -1; x <= 1; x++) {
							for (let z = -1; z <= 1; z++) {
								if (x || z) {
									if (x & z) {
										place = rand & 1
										rand >>>= 1
										if (place) {
											world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
										}
									} else {
										world.spawnBlock(wx + x, top, wz + z, blockIds.leaves)
									}
								}
							}
						}

						//Top leaves
						world.spawnBlock(wx + 1, top + 1, wz, blockIds.leaves)
						world.spawnBlock(wx, top + 1, wz - 1, blockIds.leaves)
						world.spawnBlock(wx, top + 1, wz + 1, blockIds.leaves)
						world.spawnBlock(wx - 1, top + 1, wz, blockIds.leaves)
					}

					// Blocks of each per chunk in Minecraft
					// Coal: 185.5
					// Iron: 111.5
					// Gold: 10.4
					// Redstone: 29.1
					// Diamond: 3.7
					// Lapis: 4.1
					ground -= 4

					if (random() < 3.7 / 256) {
						let y = random() * 16 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.diamondOre)
						}
					}

					if (random() < 111.5 / 256) {
						let y = random() * 64 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.ironOre)
						}
					}

					if (random() < 185.5 / 256) {
						let y = random() * ground | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.coalOre)
						}
					}

					if (random() < 10.4 / 256) {
						let y = random() * 32 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.goldOre)
						}
					}

					if (random() < 29.1 / 256) {
						let y = random() * 16 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.redstoneOre)
						}
					}

					if (random() < 4.1 / 256) {
						let y = random() * 32 | 0 + 1
						y = y < ground ? y : ground
						if (this.getBlock(i, y, k)) {
							this.setBlock(i, y < ground ? y : ground, k, blockIds.lapisOre)
						}
					}
				}
			}

			this.populated = true
		}
		genMesh() {
			let start = win.performance.now()
			let barray = bigArray
			let index = 0
			for (let i = 0; i < this.sections.length; i++) {
				index = this.sections[i].genMesh(barray, index)
			}
			let arrayDone = win.performance.now()

			if (!this.buffer) {
				this.buffer = gl.createBuffer()
			}
			let data = barray.slice(0, index)

			let maxY = 0
			let minY = 255
			let y = 0
			for (let i = 1; i < data.length; i += 6) {
				y = data[i]
				maxY = Math.max(maxY, y)
				minY = Math.min(minY, y)
			}
			this.maxY = maxY
			this.minY = minY
			this.faces = data.length / 24
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
			this.lazy = false
		}
		tick() {
			if (this.edited) {
				for (let i = 0; i < this.sections.length; i++) {
					if (this.sections[i].edited) {
						this.sections[i].tick()
					}
				}
			}
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

} });

/* ── Sección #23 · Analíticas, utilidades de chunks y clase World · líneas originales 3543–4089 ── */
window.MineKhanParts.push({ order: 23, name: "Anal\u00edticas, utilidades de chunks y clase World", body: function () {
	let analytics = {
		totalTickTime: 0,
		worstFrameTime: 0,
		totalRenderTime: 0,
		totalFrameTime: 0,
		lastUpdate: 0,
		frames: 1,
		displayedTickTime: "0",
		displayedRenderTime: "0",
		displayedFrameTime: "0",
		displayedwFrameTime: 0,
		fps: 0,
	}
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
		return Math.sqrt(dx * dx + dz * dz)
	}
	function sortChunks(c1, c2) { //Sort the list of chunks based on distance from the player
		let dx1 = p.x - c1.x - 8
		let dy1 = p.z - c1.z - 8
		let dx2 = p.x - c2.x - 8
		let dy2 = p.z - c2.z - 8
		return dx1 * dx1 + dy1 * dy1 - (dx2 * dx2 + dy2 * dy2)
	}
	function fillReqs(x, z) {
		// Chunks must all be loaded first.
		var done = true
		for (let i = x - 2; i <= x + 2; i++) {
			for (let j = z - 2; j <= z + 2; j++) {
				let chunk = world.loaded[(i + world.offsetX) * world.lwidth + j + world.offsetZ]
				if (!chunk.generated) {
					world.generateQueue.push(chunk)
					done = false
				}
				if (!chunk.populated && i >= x - 1 && i <= x + 1 && j >= z - 1 && j <= z + 1) {
					world.populateQueue.push(chunk)
					done = false
				}
			}
		}
		return done
	}
	function maxDist(x, z, x2, z2) {
		let ax = Math.abs(x2 - x)
		let az = Math.abs(z2 - z)
		return Math.max(ax, az)
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
			this.populateQueue = []
			this.generateQueue = []
			this.meshQueue = []
			this.loadFrom = []
			this.lastChunk = ","
		}
		genChunk(chunk) {
			let x = chunk.x >> 4
			let z = chunk.z >> 4
			let trueX = chunk.x
			let trueZ = chunk.z

			if (chunk.generated) {
				return false
			}
			let hide = !loadString
			let smoothness = generator.smooth
			let hilliness = generator.height
			let gen = 0
			for (let i = 0; i < 16; i++) {
				for (let k = 0; k < 16; k++) {
					gen = superflat ? 4 : Math.round(noise((trueX + i) * smoothness, (trueZ + k) * smoothness) * hilliness) + generator.extra
					chunk.tops[k * 16 + i] = gen

					chunk.setBlock(i, gen, k, blockIds.grass)
					chunk.setBlock(i, gen - 1, k, blockIds.dirt)
					chunk.setBlock(i, gen - 2, k, blockIds.dirt)
					chunk.setBlock(i, gen - 3, k, blockIds.dirt)
					for (let j = 1; j < gen - 3; j++) {
						chunk.setBlock(i, j, k, blockIds.stone)
					}
					chunk.setBlock(i, 0, k, blockIds.bedrock)
				}
			}
			chunk.generated = true
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
			for (x = minChunkX; x <= maxChunkX; x++) {
				for (let y = minChunkY; y <= maxChunkY; y++) {
					for (z = minChunkZ; z <= maxChunkZ; z++) {
						if (y < 0) {
							ret.push(fullSection.blocks)
						} else if (this.chunks[x] && this.chunks[x][z]) {
							section = this.chunks[x][z].sections[y] || emptySection
							ret.push(section.blocks)
						} else {
							ret.push(emptySection.blocks)
						}
					}
				}
			}
			return ret
		}
		updateBlock(x, y, z, lazy) {
			let chunk = this.chunks[x >> 4] && this.chunks[x >> 4][z >> 4]
			if (chunk && chunk.buffer) {
				chunk.updateBlock(x & 15, y, z & 15, this, lazy)
			}
		}
		getWorldBlock(x, y, z) {
			if (!this.chunks[x >> 4] || !this.chunks[x >> 4][z >> 4]) {
				return blockIds.air
			}
			return this.chunks[x >> 4][z >> 4].getBlock(x & 15, y, z & 15)
		}
		getBlock(x, y, z) {
			let X = (x >> 4) + this.offsetX
			let Z = (z >> 4) + this.offsetZ
			if (y > maxHeight) {
				return blockIds.air
			} else if (y < 0) {
				return blockIds.bedrock
			} else if (X < 0 || X >= this.lwidth || Z < 0 || Z >= this.lwidth) {
				return this.getWorldBlock(x, y, z)
			}
			return this.loaded[X * this.lwidth + Z].getBlock(x & 15, y, z & 15)
		}
		setBlock(x, y, z, blockID, lazy) {
			if (!this.chunks[x >> 4] || !this.chunks[x >> 4][z >> 4]) {
				return
			}
			let chunk = this.chunks[x >> 4][z >> 4]

			let xm = x & 15
			let zm = z & 15
			if (blockID) {
				chunk.setBlock(xm, y, zm, blockID, false, !lazy)
			} else {
				chunk.deleteBlock(xm, y, zm, !lazy)
			}

			if (lazy) {
				return
			}

			//Update the 6 adjacent blocks and 1 changed block
			if (xm && xm !== 15 && zm && zm !== 15) {
				chunk.updateBlock(xm - 1, y, zm, this, lazy)
				chunk.updateBlock(xm + 1, y, zm, this, lazy)
				chunk.updateBlock(xm, y - 1, zm, this, lazy)
				chunk.updateBlock(xm, y + 1, zm, this, lazy)
				chunk.updateBlock(xm, y, zm - 1, this, lazy)
				chunk.updateBlock(xm, y, zm + 1, this, lazy)
			}
			else {
				this.updateBlock(x - 1, y, z, lazy)
				this.updateBlock(x + 1, y, z, lazy)
				this.updateBlock(x, y - 1, z, lazy)
				this.updateBlock(x, y + 1, z, lazy)
				this.updateBlock(x, y, z - 1, lazy)
				this.updateBlock(x, y, z + 1, lazy)
			}

			chunk.updateBlock(xm, y, zm, this, lazy)

			// Update the corner chunks so shadows in adjacent chunks update correctly
			if (xm | zm === 0) { this.updateBlock(x - 1, y, z - 1, lazy); }
			if (xm === 15 && zm === 0) { this.updateBlock(x + 1, y, z - 1, lazy); }
			if (xm === 0 && zm === 15) { this.updateBlock(x - 1, y, z + 1, lazy); }
			if (xm & zm === 15) { this.updateBlock(x + 1, y, z + 1, lazy); }
		}
		spawnBlock(x, y, z, blockID) {
			//Sets a block anywhere without causing block updates around it. Only to be used in world gen.

			let chunkX = x >> 4
			let chunkZ = z >> 4
			if (!this.chunks[chunkX]) {
				this.chunks[chunkX] = []
			}
			let chunk = this.chunks[chunkX][chunkZ]
			if (!chunk) {
				chunk = new Chunk(chunkX * 16, chunkZ * 16)
				this.chunks[chunkX][chunkZ] = chunk
			}
			if (chunk.buffer) {
				//Only used if spawning a block post-gen
				this.setBlock(x, y, z, blockID, true)
			} else if (!chunk.getBlock(x & 15, y, z & 15)) {
				chunk.setBlock(x & 15, y, z & 15, blockID, false)
			}
		}
		tick() {
			let tickStart = win.performance.now()
			let maxChunkX = (p.x >> 4) + settings.renderDistance
			let maxChunkZ = (p.z >> 4) + settings.renderDistance
			let chunk = maxChunkX + "," + maxChunkZ
			if (chunk !== this.lastChunk) {
				this.lastChunk = chunk
				this.loadChunks()
				this.chunkGenQueue.sort(sortChunks)
			}

			if (Key.leftMouse && !Key.control && p.lastBreak < Date.now() - 250 && screen === "play") {
				changeWorldBlock(0)
			}
			if ((Key.rightMouse || Key.leftMouse && Key.control) && p.lastPlace < Date.now() - 250) {
				newWorldBlock()
			}
			if (Key.leftMouse && p.autoBreak && !Key.control) {
				changeWorldBlock(0)
			}

			for (let i = 0; i < this.sortedChunks.length; i++) {
				this.sortedChunks[i].tick()
			}

			do {
				let doneWork = false
				debug.start = performance.now()
				if (this.meshQueue.length) {
					// Update all chunk meshes.
					let len = this.meshQueue.length - 1
					do {
						this.meshQueue.pop().genMesh()
					} while(this.meshQueue.length)
					doneWork = true
					debug("Meshes")
				}

				if (this.generateQueue.length && !doneWork) {
					let chunk = this.generateQueue.pop()
					this.genChunk(chunk)
					doneWork = true
				}
				if (this.populateQueue.length && !doneWork) {
					let chunk = this.populateQueue[this.populateQueue.length - 1]
					if (!chunk.caves) {
						chunk.carveCaves()
						debug("Carve caves")
					} else if (!chunk.populated) {
						chunk.populate()
						this.populateQueue.pop()
					}
					doneWork = true
				}

				if (this.chunkGenQueue.length && !doneWork) {
					let chunk = this.chunkGenQueue[0]
					if (!fillReqs(chunk.x >> 4, chunk.z >> 4)) {}
					else if (!chunk.loaded) {
						chunk.load()
					} else if (!chunk.optimized) {
						chunk.optimize(this)
						debug("Optimize")
					} else if (!chunk.buffer) {
						chunk.genMesh()
						debug("Initial mesh")
					} else {
						this.chunkGenQueue.shift()
						generatedChunks++
					}
					doneWork = true
				}
				if (!doneWork) {
					break
				}
			} while(win.performance.now() - tickStart < 5)
		}
		render() {
			initModelView(p)
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

			p2.x = Math.round(p.x)
			p2.y = Math.round(p.y)
			p2.z = Math.round(p.z)

			renderedChunks = 0

			let dist = (settings.renderDistance) * 16
			if (this.chunkGenQueue.length) {
				this.chunkGenQueue.sort(sortChunks)
				let chunk = this.chunkGenQueue[0]
				dist = Math.min(dist, chunkDist(chunk))
			}
			if (dist !== fogDist) {
				if (fogDist < dist - 0.1) fogDist += (dist - fogDist) / 120
				else if (fogDist > dist + 0.1) fogDist += (dist - fogDist) / 30
				else fogDist = dist
			}
			gl.uniform3f(glCache.uPos, p.x, p.y, p.z)
			gl.uniform1f(glCache.uDist, fogDist)

			let c = this.sortedChunks
			for (let chunk of c) {
				chunk.render()
			}

			gl.uniform3f(glCache.uPos, 0, 0, 0)

			if(hitBox.pos) {
				blockOutlines = true
				blockFill = false
				block2(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], 0, p)
				blockOutlines = false
				blockFill = true
			}
		}
		loadChunks() {
			let renderDistance = settings.renderDistance + 2
			let cx = p.x >> 4
			let cz = p.z >> 4
			p.cx = cx
			p.cz = cz
			let minChunkX = cx - renderDistance
			let maxChunkX = cx + renderDistance
			let minChunkZ = cz - renderDistance
			let maxChunkZ = cz + renderDistance

			this.offsetX = -minChunkX
			this.offsetZ = -minChunkZ
			this.lwidth = renderDistance * 2 + 1
			this.chunkGenQueue.length = 0

			if (this.loaded.length > this.lwidth * this.lwidth) {
				this.loaded.length = this.lwidth * this.lwidth
			}

			let i = 0
			for (let x = minChunkX; x <= maxChunkX; x++) {
				for (let z = minChunkZ; z <= maxChunkZ; z++) {
					let chunk
					if (!this.chunks[x]) {
						this.chunks[x] = []
					}
					if (!this.chunks[x][z]) {
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
		getSaveString() {
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
					if (id !== chunks[1][i]) {
						pallete[id] = true
						changes = true
					}
				})
				if (!changes) {
					chunks[0].edited = false
				}
			}

			let blocks = Object.keys(pallete).map(n => Number(n))
			pallete = {}
			blocks.forEach((block, index) => pallete[block] = index)

			let rnd = Math.round
			let options = p.flying | superflat << 1 | p.spectator << 2 | caves << 3 | trees << 4

			let str = world.name + ";" + worldSeed.toString(36) + ";"
				+ rnd(p.x).toString(36) + "," + rnd(p.y).toString(36) + "," + rnd(p.z).toString(36) + ","
				+ (p.rx * 100 | 0).toString(36) + "," + (p.ry * 100 | 0).toString(36) + "," + options.toString(36) + ";"
				+ version + ";"
				+ blocks.map(b => b.toString(36)).join(",") + ";"

			for (let i = 0; i < edited.length; i++) {
				if (!edited[i][0].edited) {
					continue
				}
				let real = edited[i][0]
				let blocks = real.blocks
				let original = edited[i][1]
				str += (real.x / 16).toString(36) + "," + (real.y / 16).toString(36) + "," + (real.z / 16).toString(36) + ","
				for (let j = 0; j < original.length; j++) {
					if (blocks[j] !== original[j]) {
						str += (pallete[blocks[j]] << 12 | j).toString(36) + ","
					}
				}
				str = str.substr(0, str.length - 1); //Remove trailing comma
				str += ";"
			}
			if (str.match(/;$/)) str = str.substr(0, str.length - 1)
			return str
		}
		loadSave(str) {
			let data = str.split(";")
			if (!str.includes("Alpha")) {
				return this.loadOldSave(str)
			}

			this.name = data.shift()
			worldSeed = parseInt(data.shift(), 36)
			seedHash(worldSeed)
			caveNoise = openSimplexNoise(worldSeed)
			noiseSeed(worldSeed)

			let playerData = data.shift().split(",")
			p.x = parseInt(playerData[0], 36)
			p.y = parseInt(playerData[1], 36)
			p.z = parseInt(playerData[2], 36)
			p.rx = parseInt(playerData[3], 36) / 100
			p.ry = parseInt(playerData[4], 36) / 100
			let options = parseInt(playerData[5], 36)
			p.flying = options & 1
			p.spectator = options >> 2 & 1
			superflat = options >> 1 & 1
			caves = options >> 3 & 1
			trees = options >> 4 & 1

			let version = data.shift()
			this.version = version

			// if (version.split(" ")[1].split(".").join("") < 70) {
			// 	alert("This save code is for an older version. 0.7.0 or later is needed")
			// }

			let pallete = data.shift().split(",").map(n => parseInt(n, 36))
			this.loadFrom = []

			for (let i = 0; data.length; i++) {
				let blocks = data.shift().split(",")
				this.loadFrom.push({
					x: parseInt(blocks.shift(), 36),
					y: parseInt(blocks.shift(), 36),
					z: parseInt(blocks.shift(), 36),
					blocks: [],
				})
				for (let j = 0; j < blocks.length; j++) {
					let block = parseInt(blocks[j], 36)
					let index = block & 0xffffff
					let pid = block >> 12
					this.loadFrom[i].blocks[index] = pallete[pid]
				}
			}
		}
		loadOldSave(str) {
			let data = str.split(";");
			worldSeed = parseInt(data.shift(), 36);
			this.id = Date.now()
			this.name = "Old World " + (Math.random() * 1000 | 0)
			seedHash(worldSeed);
			caveNoise = openSimplexNoise(worldSeed);
			noiseSeed(worldSeed);
			let playerData = data.shift().split(",");
			p.x = parseInt(playerData[0], 36);
			p.y = parseInt(playerData[1], 36);
			p.z = parseInt(playerData[2], 36);
			p.rx = parseInt(playerData[3], 36) / 100;
			p.ry = parseInt(playerData[4], 36) / 100;
			let editCount = parseInt(data.shift(), 36);

			this.loadFrom = [];

			let coords = data.shift().split(",").map(function(n) {
				return parseInt(n, 36);
			});
			for (let j = 0; j < coords.length; j += 3) {
				this.loadFrom.push({
					x: coords[j],
					y: coords[j + 1],
					z: coords[j + 2],
					blocks: [],
				})
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

} });

/* ── Sección #36 · initWorldsMenu(): lista de mundos guardados · líneas originales 5319–5403 ── */
window.MineKhanParts.push({ order: 36, name: "initWorldsMenu(): lista de mundos guardados", body: function () {
	function initWorldsMenu() {
		while (window.worlds.firstChild) {
			window.worlds.removeChild(window.worlds.firstChild)
		}
		selectedWorld = 0
		window.boxCenterTop.value = ""

		const deselect = () => {
			let elem = document.getElementsByClassName("selected")
			if (elem && elem[0]) {
				elem[0].classList.remove("selected")
			}
		}

		function addWorld(name, version, size, id, edited) {
			let div = doc.createElement("div")
			div.className = "world"
			div.onclick = e => {
				deselect()
				div.classList.add("selected")
				selectedWorld = id
			}
			let br = "<br>"
			div.id = id
			div.innerHTML = "<strong>" + name + "</strong>" + br
			
			if (edited){
				let str = (new Date(edited).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit"
				}))
				div.innerHTML += str + br
			}
			div.innerHTML += version + br
			div.innerHTML += `${size.toLocaleString()} bytes used`
			
			window.worlds.appendChild(div)
		}

		worlds = {}
		if (loadString) {
			try {
				let tempWorld = new World()
				tempWorld.loadSave(loadString)
				let now = Date.now()
				addWorld(`${tempWorld.name} (Pre-loaded)`, tempWorld.version, loadString.length, now)
				worlds[now] = {
					code: loadString,
					id: now
				}
			}
			catch(e) {
				console.log("Unable to load hardcoded save.")
				console.error(e)
			}
		}
		loadFromDB().then(res => {
			if(res && res.length) {
				let index = res.findIndex(obj => obj.id === "settings")
				if (index >= 0) {
					Object.assign(settings, res[index].data) // Stored data overrides any hardcoded settings
					p.FOV(settings.fov)
					res.splice(index, 1)
				}
			}
			
			if (res && res.length) {
				res = res.map(d => d.data).filter(d => d && d.code).sort((a, b) => b.edited - a.edited)
				for (let data of res) {
					addWorld(data.name, data.version, (data.code.length + 60), data.id, data.edited)
					worlds[data.id] = data
				}
			}
			window.worlds.onclick = Button.draw
			window.boxCenterTop.onkeyup = Button.draw
		}).catch(e => console.error(e))

		superflat = false
		trees = true
		caves = true
	}
	
} });
