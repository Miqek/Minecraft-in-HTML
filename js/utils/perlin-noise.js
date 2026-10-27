/* js/utils/perlin-noise.js — Generador de ruido Perlin 1D/2D/3D con octavas | Provee: noiseProfile, PerlinNoise, noiseSeed, noise | Requiere: Marsaglia | Posee: clase PerlinNoise y función noise | Origen: sección #04 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "utils/perlin-noise",
	order: 4.20,
	name: "Ruido Perlin y funciones noise/noiseSeed",
	body: function () {
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
	}
})