/* js/bootstrap/loader.js — Cargador asíncrono con resolución topológica de dependencias | Provee: loader | Requiere: window.MineKhanManifest | Posee: window globals | Origen: bootstrap */

(function () {
	function loadScript(src) {
		return new Promise(function (resolve, reject) {
			var tag = document.createElement("script")
			tag.type = "application/javascript"
			tag.src = src
			tag.onload = resolve
			tag.onerror = function () {
				reject(new Error("MineKhan Loader: fallo al cargar script: " + src))
			}
			document.body.appendChild(tag)
		})
	}

	function resolveLoadOrder(modules) {
		var map = {}
		modules.forEach(function (m) { map[m.id] = m })

		var visited = {}
		var visiting = {}
		var result = []

		function visit(id) {
			if (visited[id]) return
			if (visiting[id]) {
				throw new Error("MineKhan Loader: dependencia circular detectada en el módulo: " + id)
			}
			var mod = map[id]
			if (!mod) {
				throw new Error("MineKhan Loader: módulo requerido no encontrado en el manifest: " + id)
			}
			visiting[id] = true
			if (Array.isArray(mod.requires)) {
				mod.requires.forEach(visit)
			}
			visiting[id] = false
			visited[id] = true
			result.push(mod)
		}

		modules.forEach(function (m) {
			if (!visited[m.id]) {
				visit(m.id)
			}
		})

		return result
	}

	loadScript("js/bootstrap/module-manifest.js")
		.then(function () {
			var manifest = window.MineKhanManifest || []
			var orderedModules = resolveLoadOrder(manifest)

			return orderedModules.reduce(function (sequence, mod) {
				return sequence.then(function () {
					return loadScript(mod.file)
				})
			}, Promise.resolve())
		})
		.then(function () {
			return loadScript("js/bootstrap/assembler.js")
		})
		.catch(function (err) {
			console.error("MineKhan Loader:", err)
		})
})()