/* js/physics/movement.js — Resolución de contactos, fricción, escalón y actualización de posición | Provee: resolveContactsAndUpdatePosition | Requiere: p, p2, world, contacts, collided, onBox, win, lookingAt | Posee: integración de movimiento físico | Origen: sección #18 de js/physics.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "physics/movement",
	order: 18.30,
	name: "Resolución de contactos y movimiento del jugador",
	body: function () {
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
	}
})