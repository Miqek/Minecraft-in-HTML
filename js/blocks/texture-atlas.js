/* js/blocks/texture-atlas.js — Punteros de píxeles y generación del atlas WebGL | Provee: Math, setPixel, getPixels, initTextures | Requiere: MathGlob, textures, gl, glCache, textureMap, textureCoords, tex, dirtTexture, dirtBuffer, genIcons | Posee: inicializador del atlas WebGL | Origen: secciones #01 y #28 de js/textures.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "blocks/texture-pointers",
	order: 1.00,
	name: "Alias de Math y punteros setPixel/getPixels",
	body: function () {
	let Math = MathGlob
	let setPixel, getPixels
	}
})

window.MineKhanParts.push({
	id: "blocks/texture-atlas-init",
	order: 28.00,
	name: "initTextures(): atlas de texturas en WebGL",
	body: function () {
	function initTextures() {
		let textureSize = 256
		let scale = 1 / 16
		let texturePixels = new Uint8Array(textureSize * textureSize * 4)
		textureMap = {}
		textureCoords = []

		setPixel = function(textureNum, x, y, r, g, b, a) {
			let texX = textureNum & 15
			let texY = textureNum >> 4
			let offset = (texY * 16 + y) * 1024 + texX * 64 + x * 4
			texturePixels[offset] = r
			texturePixels[offset + 1] = g
			texturePixels[offset + 2] = b
			texturePixels[offset + 3] = a !== undefined ? a : 255
		}
		getPixels = function(str) {
			// var w = parseInt(str.substr(0, 2), 36)
			// var h = parseInt(str.substr(2, 2), 36)
			var colors = []
			var pixels = []
			var dCount = 0
			for (;str[4 + dCount] === "0"; dCount++) {}
			var ccount = parseInt(str.substr(4+dCount, dCount+1), 36)
			for (var i = 0; i < ccount; i++) {
				var num = parseInt(str.substr(5 + 2*dCount + i * 7, 7), 36)
				colors.push([ num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, num & 255 ])
			}
			for (let i = 5 + 2*dCount + ccount * 7; i < str.length; i++) {
				let num = parseInt(str[i], 36)
				pixels.push(colors[num][0], colors[num][1], colors[num][2], colors[num][3])
			}
			return pixels
		};

		{
			// Specify the texture coords for each index
			const s = scale
			for (let i = 0; i < 256; i++) {
				let texX = i & 15
				let texY = i >> 4
				let offsetX = texX * s
				let offsetY = texY * s
				textureCoords.push(new Float32Array([ offsetX, offsetY, offsetX + s, offsetY, offsetX + s, offsetY + s, offsetX, offsetY + s ]))
			}

			// Set all of the textures into 1 big tiled texture
			let n = 0
			for (let i in textures) {
				if (typeof textures[i] === "function") {
					textures[i](n)
				} else if (typeof textures[i] === "string") {
					let pix = getPixels(textures[i])
					for (let j = 0; j < pix.length; j += 4) {
						setPixel(n, j >> 2 & 15, j >> 6, pix[j], pix[j+1], pix[j+2], pix[j+3])
					}
				}
				textureMap[i] = n
				n++
			}

			//Set the hitbox texture to 1 pixel
			let arr = new Float32Array(192)
			for (let i = 0; i < 192; i += 2) {
				arr[i] = textureCoords[textureMap.hitbox][0] + 0.01
				arr[i + 1] = textureCoords[textureMap.hitbox][1] + 0.01
			}
			textureCoords[textureMap.hitbox] = arr
		}

		// Big texture with everything in it
		tex = gl.createTexture()
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, tex)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, texturePixels)
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.uniform1i(glCache.uSampler, 0)

		// Dirt texture for the background
		let dirtPixels = new Uint8Array(getPixels(textures.dirt))
		dirtTexture = gl.createTexture()
		gl.activeTexture(gl.TEXTURE1)
		gl.bindTexture(gl.TEXTURE_2D, dirtTexture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, dirtPixels)
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

		genIcons()
	}
	}
})