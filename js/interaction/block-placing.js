/* js/interaction/block-placing.js — Lógica de colocación de bloques y detección de caras adyacentes | Provee: newWorldBlock | Requiere: hitBox, holding, currentGamemode, inBox, world, changeWorldBlock, blockMode | Posee: cálculo de posición para colocar bloques | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "interaction/block-placing",
	order: 20.10,
	name: "Colocación de nuevos bloques (newWorldBlock)",
	body: function () {
	function newWorldBlock() {
		if(!hitBox.pos || !holding) {
			return
		}
		if (hitBox.closest > currentGamemode.reach) {
			return
		}
		let pos = hitBox.pos, x= pos[0], y = pos[1], z = pos[2]
		switch(hitBox.face) {
			case "top":
				y += 1
				break
			case "bottom":
				y -= 1
				break
			case "south":
				z -= 1
				break
			case "north":
				z += 1
				break
			case "west":
				x -= 1
				break
			case "east":
				x += 1
				break
		}
		if (!inBox(x, y, z, 1, 1, 1) && !world.getBlock(x, y, z)) {
			pos[0] = x
			pos[1] = y
			pos[2] = z
			changeWorldBlock(holding < 0xff ? (holding | blockMode) : holding)
		}
	}
	}
})