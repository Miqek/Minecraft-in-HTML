/* js/blocks/block-defs-natural.js — Definiciones de bloques naturales, tierras y minerales | Provee: — | Requiere: blockData | Posee: bloques 1 a 27 en blockData | Origen: sección #03 de js/textures.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/defs-natural",
	order: 3.10,
	name: "Definiciones de bloques naturales y minerales",
	body: function () {
	blockData.push(
		{
			name: "grass",
			textures: ["grassTop", "grassSide"],
		},
		{ name: "dirt" },
		{ name: "stone" },
		{ name: "bedrock" },
		{ name: "sand" },
		{ name: "gravel" },
		{
			name: "leaves",
			transparent: true,
		},
		{
			name: "glass",
			transparent: true,
			shadow: false,
		},
		{ name: "cobblestone" },
		{ name: "mossyCobble" },
		{ name: "stoneBricks" },
		{ name: "mossyStoneBricks" },
		{ name: "bricks" },
		{ name: "coalOre" },
		{ name: "ironOre" },
		{ name: "goldOre" },
		{ name: "diamondOre" },
		{ name: "redstoneOre" },
		{ name: "lapisOre" },
		{ name: "emeraldOre" },
		{ name: "coalBlock" },
		{ name: "ironBlock" },
		{ name: "goldBlock" },
		{ name: "diamondBlock" },
		{ name: "redstoneBlock" },
		{ name: "lapisBlock" },
		{ name: "emeraldBlock" }
	)
	}
})