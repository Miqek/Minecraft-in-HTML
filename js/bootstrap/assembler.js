/* js/bootstrap/assembler.js — Ensamblador y validador de cobertura de MineKhan | Provee: assembleMineKhan | Requiere: window.MineKhanParts | Posee: window globals | Origen: sección final de js/main.js */

(function assembleMineKhan() {
	var parts = (window.MineKhanParts || []).slice().sort(function (a, b) {
		return a.order - b.order
	})

	var seenOrders = {}
	var seenIds = {}
	var duplicateOrders = []
	var duplicateIds = []

	parts.forEach(function (p) {
		if (p.order !== undefined) {
			if (seenOrders[p.order]) {
				duplicateOrders.push(p.order)
			}
			seenOrders[p.order] = (seenOrders[p.order] || 0) + 1
		}
		if (p.id) {
			if (seenIds[p.id]) {
				duplicateIds.push(p.id)
			}
			seenIds[p.id] = (seenIds[p.id] || 0) + 1
		}
	})

	if (duplicateOrders.length || duplicateIds.length) {
		throw new Error("MineKhan Assembler: duplicados detectados. Orders: [" + duplicateOrders.join(", ") + "] · IDs: [" + duplicateIds.join(", ") + "]")
	}

	var coverage = {}
	parts.forEach(function (p) {
		var base = Math.floor(p.order)
		coverage[base] = true
	})

	var missing = []
	for (var n = 1; n <= 40; n++) {
		if (!coverage[n]) {
			missing.push(n)
		}
	}

	if (missing.length) {
		throw new Error("MineKhan Assembler: cobertura incompleta. Faltan secciones base (1 a 40): [" + missing.join(", ") + "]")
	}

	console.log("MineKhan Assembler: ensambladas " + parts.length + " secciones correctamente.")

	var body = parts.map(function (p) {
		var src = Function.prototype.toString.call(p.body)
		return src.slice(src.indexOf("{") + 1, src.lastIndexOf("}")).slice(1, -1)
	}).join("\n")

	var tag = document.createElement("script")
	tag.type = "application/javascript"
	tag.text = "function MineKhan() {\n" + body + "\n}\n//# sourceURL=MineKhan.assembled.js"
	document.body.appendChild(tag)
})()

/* ── Arranque original (después de definir MineKhan) ── */
init = MineKhan()
if (window.parent.raf) {
	window.cancelAnimationFrame(window.parent.raf)
	console.log("Canceled", window.parent.raf)
}
init()