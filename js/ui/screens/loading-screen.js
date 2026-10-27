/* js/ui/screens/loading-screen.js — Pantalla y lógica de precarga de chunks al iniciar partida | Provee: maxLoad, startLoad, drawScreens.loading | Requiere: p, p2, world, play, dirt, fill, textSize, ctx, text, width, height | Posee: precarga de chunks y pantalla de progreso | Origen: secciones #32 de js/main.js y #38 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "ui/screens/loading-state",
	order: 32.00,
	name: "Pantalla de carga (maxLoad, startLoad)",
	body: function () {
	let maxLoad = 1
	function startLoad() {
		// Runs when the loading screen is opened; cache the player's position
		p2.x = p.x
		p2.y = p.y
		p2.z = p.z
		maxLoad = world.loadFrom.length + 9
	}
	}
})

window.MineKhanParts.push({
	id: "ui/screens/loading-draw",
	order: 38.70,
	name: "Dibujo de pantalla de carga (drawScreens.loading)",
	body: function () {
	drawScreens.loading = () => {
		// This is really stupid, but it basically works by teleporting the player around to each chunk I'd like to load.
		// If chunks loaded from a save aren't generated, they're deleted from the save, so this loads them all.

		let sub = maxLoad - world.loadFrom.length - 9
		let standing = true
		if (world.loadFrom.length) {
			let load = world.loadFrom[0]
			p.x = load.x * 16
			p.y = load.y * 16
			p.z = load.z * 16
			standing = false
		} else {
			p.x = p2.x
			p.y = p2.y
			p.z = p2.z

			let cx = p.x >> 4
			let cz = p.z >> 4

			for (let x = cx - 1; x <= cx + 1; x++) {
				for (let z = cz - 1; z <= cz + 1; z++) {
					if (!world.chunks[x] || !world.chunks[x][z] || !world.chunks[x][z].buffer) {
						standing = false
					} else {
						sub++
					}
				}
			}
		}

		if (standing) {
			play()
			return
		}

		world.tick()

		let progress = Math.round(100 * sub / maxLoad)
		dirt()
		fill(255)
		textSize(30)
		ctx.textAlign = "center"
		text(`Loading... ${progress}% complete (${sub} / ${maxLoad})`, width / 2, height / 2)
	}
	}
})