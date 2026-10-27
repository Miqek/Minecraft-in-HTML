/* js/controls/wheel.js — Manejador de la rueda del ratón para desplazamiento de la hotbar | Provee: canvas.onwheel, document.onwheel | Requiere: scrollHotbar | Posee: listener de evento wheel | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "controls/wheel",
	order: 30.30,
	name: "Listeners de la rueda del ratón (canvas.onwheel)",
	body: function () {
	canvas.onwheel = e => {
		e.preventDefault()
		e.stopPropagation()
		scrollHotbar(e.deltaY)
	}
	document.onwheel = e => {} // Shouldn't do anything, but it helps with a Khan Academy bug somewhat
	}
})