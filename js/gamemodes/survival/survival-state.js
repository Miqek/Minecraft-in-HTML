/* js/gamemodes/survival/survival-state.js — Variables de estado, parámetros y constantes del modo Supervivencia | Provee: gameMode, newGameMode, savedCreativeHotbar, SURVIVAL_REACH, survival | Requiere: — | Posee: estado persistente de salud, hambre, inventario y posición | Origen: secciones #11 y #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "gamemodes/survival/survival-state",
	order: 11.60,
	name: "Estado y constantes del modo Supervivencia",
	body: function () {
	// ── Modo Supervivencia: estado ──
	let gameMode = "creative"      // Modo del mundo actual: "creative" | "survival"
	let newGameMode = "creative"   // Modo elegido en el menú de creación de mundo
	let savedCreativeHotbar = null // Copia de la hotbar creativa mientras se juega en Supervivencia
	const SURVIVAL_REACH = 5       // Alcance (en bloques) para picar/colocar en Supervivencia
	let survival = {
		health: 20,
		maxHealth: 20,
		hunger: 20,
		saturation: 5,
		exhaustion: 0,
		food: 0,          // Manzanas
		counts: {},       // id de bloque -> cantidad
		spawn: null,
		fallPeak: 0,
		lastX: 0,
		lastZ: 0,
		wasOnGround: true,
		lastTick: 0,
		lastSave: 0,
		regenTimer: 0,
		starveTimer: 0,
		hurtUntil: 0,
		mining: null,
		mineStart: 0,
		mineProgress: 0,
		allowBreak: false,
		dirty: true,
		dead: false,
	}
	}
})