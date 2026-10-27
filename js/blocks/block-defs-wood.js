/* js/blocks/block-defs-wood.js — Definiciones de bloques de madera, tablones y troncos | Provee: — | Requiere: blockData | Posee: bloques 28 a 39 en blockData | Origen: sección #03 de js/textures.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/defs-wood",
	order: 3.20,
	name: "Definiciones de maderas y troncos",
	body: function () {
	blockData.push(
		{ name: "oakPlanks" },
		{
			name: "oakLog",
			textures: [ "logTop", "logSide" ],
		},
		{ name: "acaciaPlanks" },
		{
			name: "acaciaLog",
			textures: [ "acaciaLogTop", "acaciaLogSide" ],
		},
		{ name: "birchPlanks" },
		{
			name: "birchLog",
			textures: [ "birchLogTop", "birchLogSide" ],
		},
		{ name: "darkOakPlanks" },
		{
			name: "darkOakLog",
			textures: [ "darkOakLogTop", "darkOakLogSide" ],
		},
		{ name: "junglePlanks" },
		{
			name: "jungleLog",
			textures: [ "jungleLogTop", "jungleLogSide" ],
		},
		{ name: "sprucePlanks" },
		{
			name: "spruceLog",
			textures: [ "spruceLogTop", "spruceLogSide" ],
		}
	)
	}
})