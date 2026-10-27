/* js/inventory/item-stacks.js — Gestión de pilas de inventario, adición, consumo y sincronización | Provee: survivalAdd, survivalConsume, survivalSyncHotbar | Requiere: survival, inventory, holding | Posee: conteo y sincronización de slots de la hotbar | Origen: sección #20 de js/player.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "inventory/item-stacks",
	order: 20.72,
	name: "Pilas de inventario y recuento de bloques (item-stacks)",
	body: function () {
	function survivalAdd(id, amount) {
		if (!id) return
		survival.counts[id] = (survival.counts[id] || 0) + (amount || 1)
		survivalSyncHotbar()
		survival.dirty = true
	}

	function survivalConsume(id) {
		if (!(survival.counts[id] > 0)) return
		survival.counts[id]--
		if (survival.counts[id] <= 0) {
			delete survival.counts[id]
		}
		survivalSyncHotbar()
		survival.dirty = true
	}

	function survivalSyncHotbar() {
		let hb = inventory.hotbar
		for (let i = 0; i < hb.length; i++) {
			if (hb[i] && !(survival.counts[hb[i]] > 0)) {
				hb[i] = 0
			}
		}
		for (let id in survival.counts) {
			if (survival.counts[id] > 0 && !hb.includes(+id)) {
				let slot = hb.indexOf(0)
				if (slot >= 0) {
					hb[slot] = +id
				}
			}
		}
		holding = hb[inventory.hotbarSlot]
	}
	}
})