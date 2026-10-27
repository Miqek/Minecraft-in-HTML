/* js/utils/random-hash.js — Generador pseudoaleatorio, hash Murmur/PRIME32 y Marsaglia | Provee: seedHash, hash, worldSeed, Marsaglia, randomSeed, random | Requiere: MathGlob | Posee: funciones de azar y hashing | Origen: secciones #04 y #07 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "utils/random-hash",
	order: 4.10,
	name: "Generación de hash, números pseudoaleatorios y generador Marsaglia",
	body: function () {
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
	}
})

window.MineKhanParts.push({
	id: "utils/random-seed-init",
	order: 7.00,
	name: "Semilla aleatoria inicial",
	body: function () {
	randomSeed(Math.random() * 10000000 | 0)
	}
})