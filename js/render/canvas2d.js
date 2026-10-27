/* js/render/canvas2d.js — Helpers de dibujo 2D sobre canvas | Provee: fill, stroke, line, text, textSize, strokeWeight, ARROW, HAND, CROSS, cursor | Requiere: ctx, canvas | Posee: funciones y constantes de dibujo 2D | Origen: sección #06 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/canvas2d",
	order: 6.00,
	name: "Helpers de dibujo 2D sobre canvas (fill, stroke, text...)",
	body: function () {
	let fill = function(r, g, b) {
		if (g === undefined) {
			g = r
			b = r
		}
		ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")"
	}
	let stroke = function(r, g, b) {
		if (g === undefined) {
			g = r
			b = r
		}
		ctx.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")"
	}
	let line = function(x1, y1, x2, y2) {
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
	}
	function text(txt, x, y, h) {
		h = h || 0

		let lines = txt.split("\n")
		for (let i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], x, y + h * i)
		}
	}
	function textSize(size) {
		ctx.font = size + 'px Poppins' // VT323
	}
	let strokeWeight = function(num) {
		ctx.lineWidth = num
	}
	const ARROW = "arrow"
	const HAND = "pointer"
	const CROSS = "crosshair"
	let cursor = function(type) {
		canvas.style.cursor = type
	}
	}
})