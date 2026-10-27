/* js/inventory/inventory-state.js — Estructura del inventario del jugador y hotbar | Provee: inventory | Requiere: width, height | Posee: hotbar, main y slots de inventario | Origen: sección #11 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "inventory/inventory-state",
	order: 11.10,
	name: "Estado del inventario y barra de acceso rápido",
	body: function () {
	let inventory = {
		hotbar: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
		main: [],
		hotbarSlot: 0,
		size: 40 * Math.min(width, height) / 600,
		holding: 0,
	}
	}
})