/* js/render/backgrounds.js — Generación procedural de fondos para la pantalla de inicio y tierra 2D | Provee: initBackgrounds | Requiere: use3d, use2d, gl, glCache, sky, FOV, initModelView, block2, ctx, width, height, mainbg, dirtBuffer, dirtbg | Posee: función initBackgrounds | Origen: sección #34 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/backgrounds",
	order: 34.00,
	name: "initBackgrounds()",
	body: function () {
	function initBackgrounds() {
		// Home screen background
		use3d()
		gl.clearColor(sky[0], sky[1], sky[2], 1.0)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		FOV(100)
		const HALF_PI = Math.PI / 2
		initModelView(null, 0, 0.5, 0, -HALF_PI / 25, -HALF_PI / 3)
		gl.disableVertexAttribArray(glCache.aShadow)
		gl.vertexAttrib1f(glCache.aShadow, 1.0)
		
		let blocks = [
[7,4,1,7], [7,4,2,7], [7,4,3,7], [7,4,4,7], [7,5,1,7], [7,5,2,7], 
[7,5,3,7], [6,4,0,7], [6,4,1,7], [6,4,2,7], [6,4,3,7], [6,4,4,7], 
[6,5,0,7], [6,5,1,7], [6,5,2,7], [6,5,3,7], [6,5,4,7], [6,6,3,7], 
[6,6,4,7], [6,7,3,7], [5,0,-1,1], [5,0,0,1], [5,0,1,1], [5,0,2,1], 
[5,1,2,29], [5,2,2,29], [5,3,2,29], [5,4,2,29], [5,5,2,29], [5,6,2,29], 
[5,4,0,7], [5,4,1,7], [5,4,3,7], [5,4,4,7], [5,5,0,7], [5,5,1,7], 
[5,5,3,7], [5,5,4,7], [5,6,1,7], [5,6,3,7], [5,7,1,7], [5,7,2,7], 
[5,7,3,7], [4,-1,-1,1], [4,-1,0,1], [4,-1,1,1], [4,-1,2,1], [4,0,3,1], 
[4,0,4,1], [4,0,5,1], [4,0,6,1], [4,0,7,1], [4,0,8,1], [4,0,9,1], 
[4,0,10,1], [4,4,0,7], [4,4,1,7], [4,4,2,7], [4,4,3,7], [4,4,4,7], 
[4,5,0,7], [4,5,1,7], [4,5,2,7], [4,5,3,7], [4,5,4,7], [4,6,1,7], 
[4,6,2,7], [4,6,3,7], [4,7,4,7], [3,-1,-1,1], [3,-1,0,1], [3,-1,1,1], 
[3,-1,2,1], [3,-1,3,1], [3,-1,4,1], [3,0,5,1], [3,0,6,1], [3,0,7,1], 
[3,0,8,1], [3,0,9,1], [3,0,10,1], [3,4,1,7], [3,4,2,7], [3,4,3,7], 
[3,4,4,7], [3,5,1,7], [3,5,2,7], [3,5,3,7], [2,-1,-1,1], [2,-1,0,1], 
[2,-1,1,1], [2,-1,2,1], [2,-1,3,1], [2,-1,4,1], [2,-1,5,1], [2,-1,6,1], 
[2,-1,7,1], [2,0,8,1], [2,0,9,1], [2,0,10,1], [1,-2,-1,1], [1,-2,0,1], 
[1,-2,1,1], [1,-2,2,1], [1,-2,3,1], [1,-1,4,1], [1,-1,5,1], [1,-1,6,1], 
[1,-1,7,1], [1,-1,8,1], [1,-1,9,1], [1,-1,10,1], [0,-2,-1,1], [0,-2,0,1], 
[0,-2,1,1], [0,-2,2,1], [0,-2,3,1], [0,-2,4,1], [0,-2,5,1], [0,-1,6,1], 
[0,-1,7,1], [0,-1,8,1], [0,-1,9,1], [0,-1,10,1], [-1,-2,-1,1], 
[-1,-2,0,1], [-1,-2,1,1], [-1,-2,2,1], [-1,-2,3,1], [-1,-2,4,1], 
[-1,-2,5,1], [-1,-2,6,1], [-1,-2,7,1], [-1,-1,8,1], [-1,-1,9,1], 
[-1,-1,10,1], [-2,-2,-1,1], [-2,-2,0,1], [-2,-2,1,1], [-2,-2,2,1], 
[-2,-2,3,1], [-2,-2,4,1], [-2,-2,5,1], [-2,-2,6,1], [-2,-2,7,1], 
[-2,-2,8,1], [-2,-2,9,1], [-2,-1,10,1], [-3,-2,-1,1], [-3,-2,0,1], 
[-3,-2,1,1], [-3,-2,2,1], [-3,-2,3,1], [-3,-2,4,1], [-3,-2,5,1], 
[-3,-2,6,1], [-3,-2,7,1], [-3,-2,8,1], [-3,-2,9,1], [-3,-2,10,1], 
[-3,-2,11,1], [-3,-2,12,1], [-4,-2,-1,1], [-4,-2,0,1], [-4,-2,1,1], 
[-4,-2,2,1], [-4,-2,3,1], [-4,-2,4,1], [-4,-2,5,1], [-4,-2,6,1], 
[-4,-2,7,1], [-4,-2,8,1], [-4,-2,9,1], [-4,-2,10,1], [-4,-2,11,1], 
[-4,-2,12,1], [-5,-2,-1,1], [-5,-2,0,1], [-5,-2,1,1], [-5,-2,2,1], 
[-5,-2,3,1], [-5,-2,4,1], [-5,-2,5,1], [-5,-2,6,1], [-5,-2,7,1], 
[-5,-2,8,1], [-5,-2,9,1], [-5,-2,10,1], [-5,-2,11,1], [-5,-2,12,1], 
[-6,-2,-1,1], [-6,-2,0,1], [-6,-2,1,1], [-6,-2,2,1], [-6,-2,3,1], 
[-6,-2,4,1], [-6,-2,5,1], [-6,-2,6,1], [-6,-2,7,1], [-6,-2,8,1], 
[-6,-2,9,1], [-6,-2,10,1], [-6,-2,11,1], [-7,-2,3,1], [-7,-2,4,1], 
[-7,-2,5,1], [-7,-2,6,1], [-7,-2,7,1], [-7,-2,8,1], [-7,-2,9,1], 
[-8,-2,2,1], [-8,-2,3,1], [-8,-2,4,1], [-8,-2,5,1], [-8,-2,6,1], 
[-8,-2,7,1], [-8,-2,8,1]
		]
		
		for (let i = 0; i < blocks.length; i += 1) {
			block2(blocks[i][0], blocks[i][1], blocks[i][2], blocks[i][3])
		}
		
		gl.enableVertexAttribArray(glCache.aShadow)
		let pixels = new Uint8Array(width * height * 4)
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
		mainbg = ctx.createImageData(width, height)
		let w = width * 4
		for (let i = 0; i < pixels.length; i += 4) {
			let x = i % w
			let y = height - Math.floor(i / w) - 1
			let j = y * w + x
			mainbg.data[j] = pixels[i]
			mainbg.data[j + 1] = pixels[i + 1]
			mainbg.data[j + 2] = pixels[i + 2]
			mainbg.data[j + 3] = pixels[i + 3]
		}

		// Dirt background
		use2d()
		let aspect = width / height
		let stack = height / 96
		let bright = 0.4
		if (dirtBuffer) {
			gl.deleteBuffer(dirtBuffer)
		}
		dirtBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, dirtBuffer)
		let bgCoords = new Float32Array([
			-1, -1, 0, stack, bright,
			1, -1, stack * aspect, stack, bright,
			1, 1, stack * aspect, 0, bright,
			-1, 1, 0, 0, bright
		])
		gl.bufferData(gl.ARRAY_BUFFER, bgCoords, gl.STATIC_DRAW)
		gl.uniform1i(glCache.uSampler2, 1)
		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
		gl.vertexAttribPointer(glCache.aVertex2, 2, gl.FLOAT, false, 20, 0)
		gl.vertexAttribPointer(glCache.aTexture2, 2, gl.FLOAT, false, 20, 8)
		gl.vertexAttribPointer(glCache.aShadow2, 1, gl.FLOAT, false, 20, 16)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
		pixels = new Uint8Array(width * height * 4)
		gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
		dirtbg = ctx.createImageData(width, height)
		dirtbg.data.set(pixels)
	}
	}
})