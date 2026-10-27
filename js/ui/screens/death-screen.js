/* js/ui/screens/death-screen.js — Pantalla de muerte del jugador y botones de reaparición | Provee: initDeathScreenButtons, drawScreens.dead | Requiere: Button, width, height, survivalRespawn, initWorldsMenu, changeScene, ctx, fill, textSize, text | Posee: interfaz de muerte (Game Over) | Origen: secciones #27 y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/death-screen-buttons",
	order: 27.80,
	name: "Botones de pantalla de muerte",
	body: function () {
	function initDeathScreenButtons() {
		Button.add(width / 2, height / 2, 300, 40, "Respawn", "dead", r => survivalRespawn())
		Button.add(width / 2, height / 2 + 50, 300, 40, "Title Screen", "dead", r => {
			initWorldsMenu()
			changeScene("main menu")
		})
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/death-screen-draw",
	order: 38.95,
	name: "Dibujo de pantalla de muerte (drawScreens.dead)",
	body: function () {
	drawScreens.dead = () => {
		ctx.fillStyle = "rgba(180, 0, 0, 0.5)"
		ctx.fillRect(0, 0, width, height)
		fill(255)
		textSize(40)
		ctx.textAlign = "center"
		text("You Died!", width / 2, height / 2 - 40)
	}
	}
})