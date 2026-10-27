/* js/blocks/block-defs-building.js — Definiciones de bloques de construcción, lanas, hormigón y piedras | Provee: — | Requiere: blockData | Posee: bloques 40 a 94 en blockData | Origen: sección #03 de js/textures.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/defs-building",
	order: 3.30,
	name: "Definiciones de bloques de construcción (lanas, hormigón, piedra decorativa)",
	body: function () {
	blockData.push(
		{ name: "whiteWool" },
		{ name: "orangeWool" },
		{ name: "magentaWool" },
		{ name: "lightBlueWool" },
		{ name: "yellowWool" },
		{ name: "limeWool" },
		{ name: "pinkWool" },
		{ name: "grayWool" },
		{ name: "lightGrayWool" },
		{ name: "cyanWool" },
		{ name: "purpleWool" },
		{ name: "blueWool" },
		{ name: "brownWool" },
		{ name: "greenWool" },
		{ name: "redWool" },
		{ name: "blackWool" },
		{ name: "whiteConcrete" },
		{ name: "orangeConcrete" },
		{ name: "magentaConcrete" },
		{ name: "lightBlueConcrete" },
		{ name: "yellowConcrete" },
		{ name: "limeConcrete" },
		{ name: "pinkConcrete" },
		{ name: "grayConcrete" },
		{ name: "lightGrayConcrete" },
		{ name: "cyanConcrete" },
		{ name: "purpleConcrete" },
		{ name: "blueConcrete" },
		{ name: "brownConcrete" },
		{ name: "greenConcrete" },
		{ name: "redConcrete" },
		{ name: "blackConcrete" },
		{
			name: "bookshelf",
			textures: [ "oakPlanks", "bookshelf" ]
		},
		{ name: "netherrack" },
		{ name: "soulSand" },
		{ name: "glowstone" },
		{ name: "netherWartBlock" },
		{ name: "netherBricks" },
		{ name: "redNetherBricks" },
		{ name: "netherQuartzOre" },
		{
			name: "quartzBlock",
			textures: ["quartzBlockBottom", "quartzBlockTop", "quartzBlockSide"]
		},
		{
			name: "quartzPillar",
			textures: ["quartzPillarTop", "quartzPillar"]
		},
		{
			name: "chiseledQuartzBlock",
			textures: ["chiseledQuartzBlock", "chiseledQuartzBlockTop"]
		},
		{ name: "chiseledStoneBricks" },
		{ name: "smoothStone" },
		{ name: "andesite" },
		{ name: "polishedAndesite" },
		{ name: "diorite" },
		{ name: "polishedDiorite" },
		{ name: "granite" },
		{ name: "polishedGranite" },
		{
			name: "sandStone",
			textures: ["sandStoneTop", "sandStoneSide"],
		},
		{
			name: "smoothSandStone",
			textures: ["smoothSandStoneTop", "smoothSandStoneSide"],
		},
		{
			name: "chiseledSandStone",
			textures: ["chiseledSandStoneTop", "chiseledSandStoneSide"],
		},
		{
			name: "ironBars",
			textures: [ "ironBarsTop", "ironBarsSide" ],
			transparent: true,
			shadow: false,
		}
	)
	}
})