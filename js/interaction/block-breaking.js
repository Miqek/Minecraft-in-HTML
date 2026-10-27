/* js/interaction/block-breaking.js — Modificación y rotura de bloques con rotación y caras invertidas | Provee: changeWorldBlock, breakBlock | Requiere: hitBox, maxHeight, currentGamemode, breakTime, world, blockData, p, WEST, SOUTH, EAST, FLIP, hooks | Posee: función central changeWorldBlock y helper breakBlock | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "interaction/block-breaking",
	order: 20.20,
	name: "Modificación y rotura de bloques (changeWorldBlock, breakBlock)",
	body: function () {
	function breakBlock() {
		changeWorldBlock(0)
	}

	function changeWorldBlock(t) {
		let pos = hitBox.pos
		if(pos && pos[1] > 0 && pos[1] < maxHeight) {
			let broken = 0
			if (t) {
				if (!currentGamemode.canPlace(t & 0xff)) {
					return
				}
			} else {
				broken = world.getBlock(pos[0], pos[1], pos[2]) & 0xff
				if (!currentGamemode.canBreak(broken)) {
					return
				}
			}

			let shape = t && blockData[t].shape
			if (t && shape.rotate) {
				let pi = Math.PI / 4
				if (p.ry <= pi) {} // North; default
				else if (p.ry < 3 * pi) {
					t |= WEST
				} else if (p.ry < 5 * pi) {
					t |= SOUTH
				} else if (p.ry < 7 * pi) {
					t |= EAST
				}
			}

			if (t && shape.flip && hitBox.face !== "top" && (hitBox.face === "bottom" || (p.direction.y * hitBox.closest + p.y) % 1 < 0.5)) {
				t |= FLIP
			}

			world.setBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2], t)
			if (t) {
				p.lastPlace = Date.now()
				currentGamemode.onPlaced(t & 0xff)
				hooks.emit("block:placed", { id: t, pos: hitBox.pos })
			} else {
				p.lastBreak = Date.now()
				currentGamemode.onBroken(broken)
				hooks.emit("block:broken", { id: broken, pos: hitBox.pos })
			}
		}
	}
	}
})