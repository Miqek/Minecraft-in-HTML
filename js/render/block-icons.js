/* js/render/block-icons.js — Geometría e inicialización de iconos de bloques en inventario y hotbar | Provee: indexOrder, hexagonVerts, slabIconVerts, stairIconVerts, blockIcons, genIcons | Requiere: gl, height, inventory, BLOCK_COUNT, blockData, textureCoords, textureMap, SLAB, STAIR | Posee: buffers de iconos de bloques | Origen: sección #16 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/block-icons",
	order: 16.30,
	name: "Iconos de bloques (indexOrder, hexagonVerts, genIcons)",
	body: function () {
	let indexOrder;
	(function() {
		let arr = []
		for (let i = 0; i < 100000; i++) {
			arr.push(0 + i * 4, 1 + i * 4, 2 + i * 4, 0 + i * 4, 2 + i * 4, 3 + i * 4)
		}
		indexOrder = new Uint32Array(arr)
	})()

	let hexagonVerts
	let slabIconVerts
	let stairIconVerts
	let blockIcons
	{
		let side = Math.sqrt(3) / 2
		let s = side
		let q = s / 2
		hexagonVerts = new Float32Array([
			0, 1, 1, side, 0.5, 1, 0, 0, 1, -side, 0.5, 1,
			0, 0, 1, side, 0.5, 1, side, -0.5, 1, 0, -1, 1,
			-side, 0.5, 1, 0, 0, 1, 0, -1, 1, -side, -0.5, 1,
		])

		slabIconVerts = new Float32Array([
			0, 0.5, 1, side, 0, 1, 0, -0.5, 1, -side, 0, 1,
			0, -0.5, 1, side, 0, 1, side, -0.5, 1, 0, -1, 1,
			-side, 0, 1, 0, -0.5, 1, 0, -1, 1, -side, -0.5, 1,
		])

		stairIconVerts = [
			-s,0.5,0,0,1,         0,1,1,0,1,         q,0.75,1,0.5,1,    -q,0.25,0,0.5,1,    // top of the top step
			-q,-0.25,0,0,1,       q,0.25,1,0,1,      s,0,1,0.5,1,        0,-0.5,0,0.5,1,    // top of the bottom step
			-q,0.25,0,0,0.6,      q,0.75,1,0,0.6,    q,0.25,1,0.5,0.6,  -q,-0.25,0,0.5,0.6, // front of the top step
			0,-0.5,0,0,0.6,       s,0,1,0,0.6,       s,-0.5,1,0.5,0.6,   0,-1,0,0.5,0.6,    // front of the bottom step
			-s,0.5,0,0,0.8,      -q,0.25,0.5,0,0.8, -q,-0.75,0.5,1,0.8, -s,-0.5,0,1,0.8,    // side of the top step
			-q,-0.25,0.5,0.5,0.8, 0,-0.5,1,0.5,0.8,  0,-1,1,1,0.8,      -q,-0.75,0.5,1,0.8, // side of the bottom step
		]
	}
	function genIcons() {
		blockIcons = [null]
		blockIcons.lengths = []
		let texOrder = [ 1, 2, 3 ]
		let shadows = [ 1, 0.4, 0.7 ]
		let scale = 0.16 / height * inventory.size
		for (let i = 1; i < BLOCK_COUNT; i++) {
			let data = []
			let block = blockData[i]
			for (let j = 11; j >= 0; j--) {
				data.push(-hexagonVerts[j * 3 + 0] * scale)
				data.push(hexagonVerts[j * 3 + 1] * scale)
				data.push(0.1666666)
				data.push(textureCoords[textureMap[block.textures[texOrder[Math.floor(j / 4)]]]][(j * 2 + 0) % 8])
				data.push(textureCoords[textureMap[block.textures[texOrder[Math.floor(j / 4)]]]][(j * 2 + 1) % 8])
				data.push(shadows[Math.floor(j / 4)])
			}
			let buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i] = buffer
			blockIcons.lengths[i] = 6 * 3

			data = []
			for (let j = 11; j >= 0; j--) {
				let tex = textureCoords[textureMap[block.textures[texOrder[Math.floor(j / 4)]]]]

				data.push(-slabIconVerts[j * 3 + 0] * scale)
				data.push(slabIconVerts[j * 3 + 1] * scale)
				data.push(0.1666666)
				data.push(tex[(j * 2 + 0) % 8])
				data.push(tex[(j * 2 + 1) % 8])
				data.push(shadows[Math.floor(j / 4)])
			}
			buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i | SLAB] = buffer
			blockIcons.lengths[i | SLAB] = 6 * 3

			data = []
			let v = stairIconVerts
			for (let j = 23; j >= 0; j--) {
				let num = Math.floor(j / 8)
				let tex = textureCoords[textureMap[block.textures[texOrder[num]]]]
				let tx = tex[0]
				let ty = tex[1]
				data.push(-v[j * 5 + 0] * scale)
				data.push(v[j * 5 + 1] * scale)
				data.push(0.1666666)
				data.push(tx + v[j * 5 + 2] / 16)
				data.push(ty + v[j * 5 + 3] / 16)
				data.push(shadows[num])
			}
			buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
			blockIcons[i | STAIR] = buffer
			blockIcons.lengths[i | STAIR] = 6 * 6
		}
	}
	}
})

window.MineKhanParts.push({
	id: "render/block-icon-draw",
	order: 29.05,
	name: "Dibujo de icono individual (drawIcon)",
	body: function () {
	function drawIcon(x, y, id) {
		id = id < 0xff ? (id | blockMode) : id
		x =  x / (3 * height) - 0.1666 * width / height
		y = y / (3 * height) - 0.1666
		initModelView(null, x, y, 0, 0, 0)

		let buffer = blockIcons[id]
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.vertexAttribPointer(glCache.aVertex, 3, gl.FLOAT, false, 24, 0)
		gl.vertexAttribPointer(glCache.aTexture, 2, gl.FLOAT, false, 24, 12)
		gl.vertexAttribPointer(glCache.aShadow, 1, gl.FLOAT, false, 24, 20)
		gl.drawElements(gl.TRIANGLES, blockIcons.lengths[id], gl.UNSIGNED_INT, 0)
	}

	}
})