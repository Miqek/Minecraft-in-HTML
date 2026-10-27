/* js/controls/key-bindings.js — Definición del mapa de teclas y constantes de control | Provee: KEY_MAP | Requiere: — | Posee: mapeo de teclas a acciones | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "controls/key-bindings",
	order: 30.00,
	name: "Constantes y mapa de teclas de control",
	body: function () {
	let KEY_MAP = {
		FORWARD: "w",
		BACKWARD: "s",
		LEFT: "a",
		RIGHT: "d",
		JUMP: " ",
		SNEAK: "shift",
		SPRINT: "q",
		INVENTORY: "e",
		EAT: "f",
		PAUSE: "p",
		ZOOM: "z",
		TEXTURES: "t",
		SPECTATOR: "l",
		AUTOBREAK: "b",
		BLOCK_MODE: "enter",
		FREEZE: ";",
		ESCAPE: "escape"
	}
	}
})