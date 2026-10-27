/* js/gamemodes/survival/food.js — Consumo de alimentos y restauración de hambre y saturación | Provee: survivalEat | Requiere: survival, gameMode | Posee: consumo de manzanas e ingesta | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/food",
	order: 20.70,
	name: "Consumo de alimentos y comida (survivalEat)",
	body: function () {
	function survivalEat() {
		let s = survival
		if (gameMode !== "survival" || s.food <= 0 || s.hunger >= 20) return
		s.food--
		s.hunger = Math.min(20, s.hunger + 4)
		s.saturation = Math.min(s.hunger, s.saturation + 2.4)
		s.dirty = true
	}
	}
})