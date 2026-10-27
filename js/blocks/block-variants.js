/* js/blocks/block-variants.js — Definiciones de variantes y bloques especiales | Provee: — | Requiere: blockData | Posee: bloques 95 a 108 en blockData | Origen: sección #03 de js/textures.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/variants",
	order: 3.95,
	name: "Definiciones de variantes y bloques especiales",
	body: function () {
	blockData.push(
		{
			name: "waterBlock",
			transparent: true,
			shadow: false,
		},
		{
			name: "altLeaves",
			textures: [ "altLeavesTop", "altLeavesSide" ],
		},
		{ name: "oakDoorTip" },
		{ name: "oakDoorBittim" },
		{ name: "justLeaves" },
		{ name: "oakDoorBittimboi" },
		{ name: "dispenserBlick" },
		{
			name: "iceBlick",
			transparent: true,
			shadows: false,
		},
		{
			name: "cobwebBlick",
			transparent: true,
			shadows: false,
		},
		{ name: "crackedStoneBrick" },
		{
			name: "grassLeaves",
			textures: [ "grassLeavesTop", "grassLeavesSide" ],
			transparent: true,
			shadows: false,
		},
		{
			name: "blackStainedGlass",
			transparent: true,
			shadows: false,
		},
		{ name: "whiteTerracotta" },
		{ name: "sidewaysPillar" }
	)
	}
})