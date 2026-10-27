/* js/ui/hud/damage-flash.js — Destello rojo en pantalla completa al recibir daño el jugador | Provee: — | Requiere: HUD, survival, ctx, width, height | Posee: efecto visual de impacto y daño | Origen: sección #29 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/hud/damage-flash",
	order: 29.35,
	name: "Efecto de destello de daño en pantalla",
	body: function () {
	HUD.register({
		name: "damage-flash",
		modes: ["survival"],
		draw: function () {
			if (Date.now() < survival.hurtUntil) {
				ctx.fillStyle = "rgba(200, 0, 0, 0.3)"
				ctx.fillRect(0, 0, width, height)
			}
		}
	})
	}
})