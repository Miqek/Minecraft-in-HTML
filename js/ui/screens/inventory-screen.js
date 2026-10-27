/* js/ui/screens/inventory-screen.js — Conexión de pantalla de inventario con el renderizador creativo | Provee: drawScreens.inventory | Requiere: drawScreens, drawInv | Posee: asignación de pantalla de inventario | Origen: sección #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/inventory-screen",
	order: 38.80,
	name: "Pantalla de inventario (drawScreens.inventory)",
	body: function () {
	drawScreens.inventory = drawInv
	}
})