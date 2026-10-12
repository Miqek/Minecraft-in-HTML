/*
 * js/physics.js — PVector, ray tracing de bloques, colisiones, contactos y gravedad.
 *
 * Secciones (nº = orden de ensamblado · líneas del HTML original):
 *   #05  Vector PVector  (909–940)
 *   #18  Ray tracing, colisiones, contactos y gravedad  (2261–2692)
 *
 * El juego original es UNA función (MineKhan) con variables compartidas; cada sección se registra
 * en window.MineKhanParts y js/main.js las reensambla en orden. Ver README.md.
 */

window.MineKhanParts = window.MineKhanParts || []

/* ── Sección #05 · Vector PVector · líneas originales 909–940 ── */
window.MineKhanParts.push({ order: 5, name: "Vector PVector", body: function () {
	let PVector = function(x, y, z) {
		this.x = x
		this.y = y
		this.z = z
		this.set = function(x, y, z) {
			if (y === undefined) {
				this.x = x.x
				this.y = x.y
				this.z = x.z
			} else {
				this.x = x
				this.y = y
				this.z = z
			}
		}
		this.normalize = function() {
			let mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
			this.x /= mag
			this.y /= mag
			this.z /= mag
		}
		this.add = function(v) {
			this.x += v.x
			this.y += v.y
			this.z += v.z
		}
		this.mult = function(m) {
			this.x *= m
			this.y *= m
			this.z *= m
		}
	}
} });

/* ── Sección #18 · Ray tracing, colisiones, contactos y gravedad · líneas originales 2261–2692 ── */
window.MineKhanParts.push({ order: 18, name: "Ray tracing, colisiones, contactos y gravedad", body: function () {
	function rayTrace(x, y, z, shape) {
		let cf, cd = 1e9; //Closest face and distance
		let m; //Absolute distance to intersection point
		let ix, iy, iz; //Intersection coords
		let minX, miny, minz, maxX, maxY, maxZ, min, max; //Bounds of face coordinates
		let east = p.direction.x < 0
		let top = p.direction.y < 0
		let north = p.direction.z < 0
		let verts = shape.verts
		let faces = verts[0]

		//Top and bottom faces

		if (top) {
			faces = verts[1]
		}
		if (p.direction.y) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				m = (y + face[1] - p.y) / p.direction.y
				ix = m * p.direction.x + p.x
				iz = m * p.direction.z + p.z
				if (m > 0 && m < cd && ix >= x + minX && ix <= x + maxX && iz >= z + minZ && iz <= z + maxZ) {
					cd = m; //Ray crosses bottom face
					cf = top ? "top" : "bottom"
				}
			}
		}

		//West and East faces
		if (east) {
			faces = verts[4]
		} else {
			faces = verts[5]
		}
		if (p.direction.x) {
			for (let face of faces) {
				min = face.min
				minY = min[1]
				minZ = min[2]
				max = face.max
				maxY = max[1]
				maxZ = max[2]
				m = (x + face[0] - p.x) / p.direction.x
				iy = m * p.direction.y + p.y
				iz = m * p.direction.z + p.z
				if (m > 0 && m < cd && iy >= y + minY && iy <= y + maxY && iz >= z + minZ && iz <= z + maxZ) {
					cd = m
					cf = east ? "east" : "west"
				}
			}
		}

		//South and North faces
		if (north) {
			faces = verts[2]
		} else {
			faces = verts[3]
		}
		if (p.direction.z) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				m = (z + face[2] - p.z) / p.direction.z
				ix = m * p.direction.x + p.x
				iy = m * p.direction.y + p.y
				if (m > 0 && m < cd && ix >= x + minX && ix <= x + maxX && iy >= y + minY && iy <= y + maxY) {
					cd = m
					cf = north ? "north" : "south"
				}
			}
		}
		return [ cd, cf ]
	}
	function runRayTrace(x, y, z) {
		let block = world.getBlock(x, y, z)
		if (block) {
			let shape = blockData[block].shape
			let rt = rayTrace(x, y, z, blockData[block].shape)

			if (rt[1] && rt[0] < hitBox.closest) {
				hitBox.closest = rt[0]
				hitBox.face = rt[1]
				hitBox.pos = [ x, y, z ]
				hitBox.shape = blockData[block].shape
			}
		}
	}
	function lookingAt() {
		// Checks blocks in front of the player to see which one they're looking at
		hitBox.pos = null
		hitBox.closest = 1e9

		if (p.spectator) {
			return
		}
		let blockState = world.getBlock(p2.x, p2.y, p2.z)
		if (blockState) {
			hitBox.pos = [ p2.x, p2.y, p2.z ]
			hitBox.closest = 0
			hitBox.shape = blockData[blockState].shape
			return
		}

		let pd = p.direction

		// Target block
		let tx = Math.round(pd.x * reach + p.x)
		let ty = Math.round(pd.y * reach + p.y)
		let tz = Math.round(pd.z * reach + p.z)

		let minX = p2.x
		let maxX = 0
		let minY = p2.y
		let maxY = 0
		let minZ = p2.z
		let maxZ = 0

		for (let i = 0; i < reach + 1; i++) {
			if (i > reach) {
				i = reach
			}
			maxX = Math.round(p.x + pd.x * i)
			maxY = Math.round(p.y + pd.y * i)
			maxZ = Math.round(p.z + pd.z * i)
			if (maxX === minX && maxY === minY && maxZ === minZ) {
				continue
			}
			if (minX !== maxX) {
				if (minY !== maxY) {
					if (minZ !== maxZ) {
						runRayTrace(maxX, maxY, maxZ)
					}
					runRayTrace(maxX, maxY, minZ)
				}
				if (minZ !== maxZ) {
					runRayTrace(maxX, minY, maxZ)
				}
				runRayTrace(maxX, minY, minZ)
			}
			if (minY !== maxY) {
				if (minZ !== maxZ) {
					runRayTrace(minX, maxY, maxZ)
				}
				runRayTrace(minX, maxY, minZ)
			}
			if (minZ !== maxZ) {
				runRayTrace(minX, minY, maxZ)
			}
			if (hitBox.pos) {
				return; //The ray has collided; it can't possibly find a closer collision now
			}
			minZ = maxZ
			minY = maxY
			minX = maxX
		}
	}
	let inBox = function(x, y, z, w, h, d) {
		let iy = y - h/2 - p.topH
		let ih = h + p.bottomH + p.topH
		let ix = x - w/2 - p.w
		let iw = w + p.w*2
		let iz = z - d/2 - p.w
		let id = d + p.w*2
		return p.x > ix && p.y > iy && p.z > iz && p.x < ix + iw && p.y < iy + ih && p.z < iz + id
	}
	let onBox = function(x, y, z, w, h, d) {
		let iy = roundBits(y - h/2 - p.topH)
		let ih = roundBits(h + p.bottomH + p.topH)
		let ix = roundBits(x - w/2 - p.w)
		let iw = roundBits(w + p.w*2)
		let iz = roundBits(z - d/2 - p.w)
		let id = roundBits(d + p.w*2)
		return p.x > ix && p.y > iy && p.z > iz && p.x < ix + iw && p.y <= iy + ih && p.z < iz + id
	}
	function collided(x, y, z, vx, vy, vz, block) {
		if(p.spectator) {
			return false
		}
		let verts = blockData[block].shape.verts
		let px = roundBits(p.x - p.w - x)
		let py = roundBits(p.y - p.bottomH - y)
		let pz = roundBits(p.z - p.w - z)
		let pxx = roundBits(p.x + p.w - x)
		let pyy = roundBits(p.y + p.topH - y)
		let pzz = roundBits(p.z + p.w - z)
		let minX, minY, minZ, maxX, maxY, maxZ, min, max

		//Top and bottom faces
		let faces = verts[0]
		if (vy <= 0) {
			faces = verts[1]
		}
		if (!vx && !vz) {
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minZ = min[2]
				max = face.max
				maxX = max[0]
				maxZ = max[2]
				if (face[1] > py && face[1] < pyy && minX < pxx && maxX > px && minZ < pzz && maxZ > pz) {
					if (vy <= 0) {
						p.onGround = true
						p.y = Math.round((face[1] + y + p.bottomH) * 10000) / 10000
						return false
					} else {
						return true
					}
				}
			}
			return false
		}

		//West and East faces
		if (vx < 0) {
			faces = verts[4]
		} else if (vx > 0) {
			faces = verts[5]
		}
		if (vx) {
			let col = false
			for (let face of faces) {
				min = face.min
				minZ = min[2]
				minY = min[1]
				max = face.max
				maxZ = max[2]
				maxY = max[1]
				if (face[0] > px && face[0] < pxx && minY < pyy && maxY > py && minZ < pzz && maxZ > pz) {
					if (maxY - py > 0.5) {
						p.canStepX = false
					}
					col = true
				}
			}
			return col
		}

		//South and North faces
		if (vz < 0) {
			faces = verts[2]
		} else if (vz > 0) {
			faces = verts[3]
		}
		if (vz) {
			let col = false
			for (let face of faces) {
				min = face.min
				minX = min[0]
				minY = min[1]
				max = face.max
				maxX = max[0]
				maxY = max[1]
				if (face[2] > pz && face[2] < pzz && minY < pyy && maxY > py && minX < pxx && maxX > px) {
					if (maxY - py > 0.5) {
						p.canStepZ = false
					}
					col = true
				}
			}
			return col
		}
	}
	let contacts = {
		array: [],
		size: 0,
		add: function(x, y, z, block) {
			if (this.size === this.array.length) {
				this.array.push([ x, y, z, block ])
			} else {
				this.array[this.size][0] = x
				this.array[this.size][1] = y
				this.array[this.size][2] = z
				this.array[this.size][3] = block
			}
			this.size++
		},
		clear: function() {
			this.size = 0
		},
	}
	let resolveContactsAndUpdatePosition = function() {
		let pminX = p2.x - 1
		let pmaxX = p2.x + 1
		let pminY = p2.y - 2
		let pmaxY = p2.y + 1
		let pminZ = p2.z - 1
		let pmaxZ = p2.z + 1
		let block = null
		let vel = p.velocity

		for (let x = pminX; x <= pmaxX; x++) {
			for (let y = pminY; y <= pmaxY; y++) {
				for (let z = pminZ; z <= pmaxZ; z++) {
					let block = world.getBlock(x, y, z)
					if (block) {
						contacts.add(x, y, z, block)
					}
				}
			}
		}

		let dt = (win.performance.now() - p.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt

		p.previousX = p.x
		p.previousY = p.y
		p.previousZ = p.z

		//Check collisions in the Y direction
		p.onGround = false
		p.canStepX = false
		p.canStepZ = false
		p.y += vel.y * dt
		for (let i = 0; i < contacts.size; i++) {
			block = contacts.array[i]
			if (collided(block[0], block[1], block[2], 0, vel.y, 0, block[3])) {
				p.y = p.previousY
				vel.y = 0
				break
			}
		}
		if (p.y === p.previousY && !p.flying) {
			p.canStepX = true
			p.canStepZ = true
		}

		var sneakLock = false, sneakSafe = false
		if (p.sneaking) {
			for (let i = 0; i < contacts.size; i++) {
				block = contacts.array[i]
				if (onBox(block[0], block[1], block[2], 1, 1, 1)) {
					sneakLock = true
					break
				}
			}
		}

		//Check collisions in the X direction
		p.x += vel.x * dt
		for (let i = 0; i < contacts.size; i++) {
			block = contacts.array[i]
			if (collided(block[0], block[1], block[2], vel.x, 0, 0, block[3])) {
				if (p.canStepX && !world.getBlock(block[0], block[1] + 1, block[2]) && !world.getBlock(block[0], block[1] + 2, block[2])) {
					continue
				}
				p.x = p.previousX
				vel.x = 0
				break
			}
			if (sneakLock && onBox(block[0], block[1], block[2], 1, 1, 1)) {
				sneakSafe = true
			}
		}

		if (sneakLock && !sneakSafe) {
			p.x = p.previousX
			vel.x = 0
		}
		sneakSafe = false

		//Check collisions in the Z direction
		p.z += vel.z * dt
		for (let i = 0; i < contacts.size; i++) {
			block = contacts.array[i]
			if (collided(block[0], block[1], block[2], 0, 0, vel.z, block[3])) {
				if (p.canStepZ && !world.getBlock(block[0], block[1] + 1, block[2]) && !world.getBlock(block[0], block[1] + 2, block[2])) {
					continue
				}
				p.z = p.previousZ
				vel.z = 0
				break
			}
			if (sneakLock && onBox(block[0], block[1], block[2], 1, 1, 1)) {
				sneakSafe = true
			}
		}

		if (sneakLock && !sneakSafe) {
			p.z = p.previousZ
			vel.z = 0
		}

		if (!p.flying) {
			let drag = p.onGround ? 0.5 : 0.85
			p.velocity.z += (p.velocity.z * drag - p.velocity.z) * dt
			p.velocity.x += (p.velocity.x * drag - p.velocity.x) * dt
		} else {
			let drag = 0.9
			p.velocity.z += (p.velocity.z * drag - p.velocity.z) * dt
			p.velocity.x += (p.velocity.x * drag - p.velocity.x) * dt
			p.velocity.y += (p.velocity.y * 0.8 - p.velocity.y) * dt
			if (p.onGround && !p.spectator) {
				p.flying = false
			}
		}

		p.lastUpdate = win.performance.now()
		contacts.clear()
		lookingAt()
	}
	let runGravity = function() {
		if (p.flying) {
			return
		}
		let dt = (win.performance.now() - p.lastUpdate) / 33
		dt = dt > 2 ? 2 : dt
		if(p.onGround) {
			if(Key[" "]) {
				p.velocity.y = p.jumpSpeed
				p.onGround = false
			} else {
				p.velocity.y = 0
			}
		} else {
			p.velocity.y += p.gravityStength * dt
			if(p.velocity.y < -p.maxYVelocity) {
				p.velocity.y = -p.maxYVelocity
			}
		}
	}

} });
