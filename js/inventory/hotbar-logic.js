/* js/inventory/hotbar-logic.js — Selección de ranuras de la barra de acceso rápido, pick-block y desplazamiento | Provee: selectHotbarSlot, pickBlock, scrollHotbar | Requiere: inventory, holding, updateHUD, hitBox, currentGamemode, world | Posee: lógica de activación y selección de hotbar | Origen: sección #30 de js/controls.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "inventory/hotbar-logic",
	order: 30.06,
	name: "Lógica de selección y desplazamiento de hotbar (pickBlock, scrollHotbar)",
	body: function () {
	function selectHotbarSlot(slot) {
		inventory.hotbarSlot = slot
		holding = inventory.hotbar[inventory.hotbarSlot]
		updateHUD = true
	}

	function pickBlock() {
		if (!hitBox.pos || !currentGamemode.allowPickBlock) return
		updateHUD = true
		let block = world.getBlock(hitBox.pos[0], hitBox.pos[1], hitBox.pos[2]) & 0x3ff
		let index = inventory.hotbar.indexOf(block)
		if (index >= 0) {
			inventory.hotbarSlot = index
		} else {
			inventory.hotbar[inventory.hotbarSlot] = block
		}
		holding = inventory.hotbar[inventory.hotbarSlot]
	}

	function scrollHotbar(delta) {
		if (delta > 0) {
			inventory.hotbarSlot++
		} else if (delta < 0) {
			inventory.hotbarSlot--
		}
		if (inventory.hotbarSlot > 8) {
			inventory.hotbarSlot = 0
		} else if (inventory.hotbarSlot < 0) {
			inventory.hotbarSlot = 8
		}

		updateHUD = true
		holding = inventory.hotbar[inventory.hotbarSlot]
	}
	}
})