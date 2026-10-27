/* js/blocks/texture-data-base.js — Inicialización de objeto textures y texturas procedurales | Provee: textures | Requiere: setPixel, getPixels | Posee: texturas procedurales (grassTop, grassSide, leaves, oakPlanks, hitbox) | Origen: sección #02 de js/textures.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/texture-data-base",
	order: 2.00,
	name: "Texturas base y procedimentales (grassTop, grassSide, leaves, oakPlanks, hitbox)",
	body: function () {
	let textures = {}
	Object.assign(textures, {
		grassTop: function(n) {
			let r = 0, g = 0, b = 0, d = 0
			for (let x = 0; x < 16; x++) {
				for (let y = 0; y < 16; y++) {
					d = Math.random() * 0.25 + 0.65
					r = 0x54 * d
					g = 0xa0 * d
					b = 0x48 * d
					setPixel(n, x, y, r, g, b)
				}
			}
		},
		grassSide: function(n) {
			let r = 0, g = 0, b = 0, d = 0
			let pix = getPixels("0g0g70ordrzz0u30g730wa4vzz0xnyl8f11lrk7315qj7jz1fh47pb6553365533033636350335403653650063306333633300635163503655353653535605335031350330553500033033366333433663663535336655335055335553353530355333033503300333336635353663650660554353355635155305303053556333333366353323553060365553063030663533555365534355335530")
			for (let i = 0; i < pix.length; i += 4) {
				setPixel(n, i >> 2 & 15, i >> 6, pix[i], pix[i+1], pix[i+2], pix[i+3])
			}
			for (let x = 0; x < 16; x++) {
				let m = Math.random() * 4 + 1
				for (let y = 0; y < m; y++) {
					d = Math.random() * 0.25 + 0.65
					r = 0x54 * d
					g = 0xa0 * d
					b = 0x48 * d
					setPixel(n, x, y, r, g, b)
				}
			}
		},
		leaves: function(n) {
			let r = 0, g = 0, b = 0, a = 0
			for (let x = 0; x < 16; x++) {
				for (let y = 0; y < 16; y++) {
					r = 0
					g = Math.floor(Math.random() * 30 + 100)
					b = Math.floor(Math.random() * 30)
					if (Math.random() < 0.35) {
						a = 0
					} else {
						a = 255
					}
					setPixel(n, x, y, r, g, b, a)
				}
			}
		},
		oakPlanks: function(n) {
			let r = 0
			for (let y = 0; y < 16; y++) {
				let a = (y & 3) === 3 ? 0.7 : 1
				for (let x = 0; x < 16; x++) {
					let mid = x === 8 && (y & 7) > 3 && a === 1 ? 0.85 : 1
					let rit = x === 15 && (y & 7) < 3 && a === 1 ? 0.85 : 1
					r = (Math.random() * 0.1 + 0.9) * a * mid * rit
					setPixel(n, x, y, 190 * r, 154 * r, 96 * r)
				}
			}
		},
		hitbox: function(n) {
			for (let x = 0; x < 16; x++) {
				for (let y = 0; y < 16; y++) {
					setPixel(n, x, y, 255, 255, 0, 255)
				}
			}
		}
	})
	}
})