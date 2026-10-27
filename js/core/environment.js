/* js/core/environment.js — Entorno global del DOM y referencias iniciales de MineKhan | Provee: canvas, ctx, savebox, boxCenterTop, saveDirections, message, worlds, quota, hoverbox, MathGlob, MineKhanParts, win, doc, console, world | Requiere: DOM elements | Posee: window globals y entorno interno inicial | Origen: preludio global de js/main.js y sección #04 de js/world.js */

window.canvas = document.getElementById("overlay")
window.ctx = canvas.getContext("2d")
window.savebox = document.getElementById("savebox")
window.boxCenterTop = document.getElementById("boxcentertop")
window.saveDirections = document.getElementById("savedirections")
window.message = document.getElementById("message")
window.worlds = document.getElementById("worlds")
window.quota = document.getElementById("quota")
var hoverbox = document.getElementById("onhover")
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

var MathGlob = Math

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "core/environment",
	order: 4.00,
	name: "Entorno interno de MineKhan (win, doc, console, world)",
	body: function () {
	let win = window.parent
	let doc = document
	let console = win.console
	let world
	}
})