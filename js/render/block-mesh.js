/* js/render/block-mesh.js — Dibujo inmediato de cubos y bloques para la interfaz y menús | Provee: box2, block2 | Requiere: gl, Block, Sides, vertexAttribPointer, program3D, sideEdgeBuffers, texCoordsBuffers, textureMap, blockFill, blockOutlines, hitBox, uniformMatrix, trans, modelView, matMult, transpose, matrix, blockData | Posee: funciones box2 y block2 | Origen: sección #19 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/block-mesh",
	order: 19.00,
	name: "Dibujo de bloques (box2 / block2)",
	body: function () {
	function box2(sides, tex) {
		if (blockFill) {
			let i = 0
			for (let side in Block) {
				if (sides & Block[side]) {
					vertexAttribPointer("aVertex", program3D, "aVertex", 3, sideEdgeBuffers[Sides[side]])
					vertexAttribPointer("aTexture", program3D, "aTexture", 2, texCoordsBuffers[textureMap[tex[i]]])
					gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0)
				}
				i++
			}
		}
		if (blockOutlines) {
			vertexAttribPointer("aVertex", program3D, "aVertex", 3, hitBox.shape.buffer)
			vertexAttribPointer("aTexture", program3D, "aTexture", 2, texCoordsBuffers[textureMap.hitbox])
			for (let i = 0; i < hitBox.shape.size; i++) {
				gl.drawArrays(gl.LINE_LOOP, i * 4, 4)
			}
		}
	}
	function block2(x, y, z, t, camera) {
		if (camera) {
			camera.transformation.translate(x, y, z)
			uniformMatrix("view3d", program3D, "uView", false, camera.getMatrix())
		} else {
			//copyArr(modelView, matrix)
			trans(modelView, x, y, z)
			matMult()
			trans(modelView, -x, -y, -z)
			transpose(matrix)
			uniformMatrix("view3d", program3D, "uView", false, matrix)
		}
		box2(0xff, blockData[t].textures)
	}
	}
})