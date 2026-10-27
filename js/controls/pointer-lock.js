/* js/controls/pointer-lock.js — Bloqueo y liberación del puntero del ratón | Provee: getPointer, releasePointer | Requiere: canvas, doc | Posee: llamadas a Pointer Lock API | Origen: sección #14 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "controls/pointer-lock",
	order: 14.00,
	name: "Bloqueo de puntero (getPointer / releasePointer)",
	body: function () {
	function getPointer() {
		if (canvas.requestPointerLock) {
			canvas.requestPointerLock()
		}
	}
	function releasePointer() {
		if (doc.exitPointerLock) {
			doc.exitPointerLock()
		}
	}
	}
})