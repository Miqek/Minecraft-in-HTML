/* js/core/constants.js — Constantes geométricas y de caras | Provee: CUBE, SLAB, STAIR, FLIP, NORTH, SOUTH, EAST, WEST, ROTATION, Block, Sides | Requiere: — | Posee: constantes de bloques y geometría | Origen: secciones #09 de js/main.js y #15 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/constants-geometry",
	order: 9.00,
	name: "Constantes geométricas (CUBE, SLAB, STAIR...)",
	body: function () {
	const CUBE     = 0
	const SLAB     = 0x100 // 9th bit
	const STAIR    = 0x200 // 10th bit
	const FLIP     = 0x400 // 11th bit
	const NORTH    = 0 // 12th and 13th bits for the 4 directions
	const SOUTH    = 0x800
	const EAST     = 0x1000
	const WEST     = 0x1800
	const ROTATION = 0x1800
	}
})

window.MineKhanParts.push({
	id: "core/constants-faces",
	order: 15.00,
	name: "Constantes de caras (Block, Sides)",
	body: function () {
	let Block = {
		top: 0x4,
		bottom: 0x8,
		north: 0x20,
		south: 0x10,
		east: 0x2,
		west: 0x1,
	}
	let Sides = {
		top: 0,
		bottom: 1,
		north: 2,
		south: 3,
		east: 4,
		west: 5,
	}
	}
})