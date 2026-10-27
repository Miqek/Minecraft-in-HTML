/* js/world/world-storage.js — Persistencia en IndexedDB y guardado de mundos | Provee: createDatabase, loadFromDB, saveToDB, deleteFromDB, save, win.saveToDB, win.loadFromDB, win.createDatabase, win.deleteFromDB | Requiere: window.indexedDB, world, version | Posee: capa de base de datos IndexedDB | Origen: sección #08 de js/world.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "world/world-storage",
	order: 8.00,
	name: "Persistencia en IndexedDB y save()",
	body: function () {
	async function createDatabase() {
		return await new Promise(async (resolve, reject) => {
			let request = window.indexedDB.open("MineKhan", 1)

			request.onupgradeneeded = function(event) {
				let DB = event.target.result
				
				let store = DB.createObjectStore("worlds", { keyPath: "id" })
				store.createIndex("id", "id", { unique: true })
				store.createIndex("data", "data", { unique: false })
			}

			request.onsuccess = function(e) {
				resolve(request.result)
			}

			request.onerror = function(e) {
				console.error(e)
				reject(e)
			}
		})
	}
	async function loadFromDB(id) {
		return await new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = id ? store.get(id) : store.getAll()
			req.onsuccess = function(e) {
				resolve(req.result)
				db.close()
			}
			req.onerror = function(e) { 
				resolve(null)
				db.close()
			}
		})
	}
	async function saveToDB(id, data) {
		return new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = store.put({ id: id, data: data })
			req.onsuccess = function() {
				resolve(req.result)
			}
			req.onerror = function(e) {
				reject(e)
			}
		})
	}
	async function deleteFromDB(id) {
		return new Promise(async (resolve, reject) => {
			let db = await createDatabase()
			let trans = db.transaction("worlds", "readwrite")
			let store = trans.objectStore("worlds")
			let req = store.delete(id)
			req.onsuccess = function() {
				resolve(req.result)
			}
			req.onerror = function(e) {
				reject(e)
			}
		})
	}

	function save() {
		saveToDB(world.id, {
			id: world.id,
			edited: Date.now(),
			name: world.name,
			version: version,
			code: world.getSaveString()
		}).then(() => world.edited = Date.now()).catch(e => console.error(e))
	}

	
	win.saveToDB = saveToDB
	win.loadFromDB = loadFromDB
	win.createDatabase = createDatabase
	win.deleteFromDB = deleteFromDB
	}
})