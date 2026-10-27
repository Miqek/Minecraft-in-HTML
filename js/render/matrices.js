/* js/render/matrices.js — Operaciones matriciales 3D, transformaciones y proyección | Provee: Matrix, uniformMatrix, vertexAttribPointer, sideEdgeBuffers, indexBuffer, cross, matrix, projection, defaultModelView, trans, rotX, rotY, transpose, matMult, copyArr, FOV, initModelView | Requiere: gl, glCache, currentFov, width, height, modelView, program3D | Posee: clase Matrix y funciones de transformación | Origen: sección #16 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/matrices",
	order: 16.40,
	name: "Matrices, utilidades de shader y proyección (Matrix, FOV, initModelView)",
	body: function () {
	function uniformMatrix(cacheId, programObj, vrName, transpose, matrix) {
		let vrLocation = glCache[cacheId]
		if(vrLocation === undefined) {
			vrLocation = gl.getUniformLocation(programObj, vrName)
			glCache[cacheId] = vrLocation
		}
		gl.uniformMatrix4fv(vrLocation, transpose, matrix)
	}
	function vertexAttribPointer(cacheId, programObj, vrName, size, VBO) {
		let vrLocation = glCache[cacheId]
		if(vrLocation === undefined) {
			vrLocation = gl.getAttribLocation(programObj, vrName)
			glCache[cacheId] = vrLocation
		}
		if (vrLocation !== -1) {
			gl.enableVertexAttribArray(vrLocation)
			gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
			gl.vertexAttribPointer(vrLocation, size, gl.FLOAT, false, 0, 0)

		}
	}

	//Generate buffers for every block face and store them
	let sideEdgeBuffers
	let indexBuffer

	function cross(v1, v2, result) {
		let x = v1.x,
			y = v1.y,
			z = v1.z,
			x2 = v2.x,
			y2 = v2.y,
			z2 = v2.z
		result.x = y * z2 - y2 * z
		result.y = z * x2 - z2 * x
		result.z = x * y2 - x2 * y
	}

	let matrix = new Float32Array(16); // A temperary matrix that may store random data.
	let projection = new Float32Array(16)
	let defaultModelView = new Float32Array([ -10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1 ])
	class Matrix {
		constructor(arr) {
			this.elements = new Float32Array(arr || 16)
		}
		translate(x, y, z) {
			let a = this.elements
			a[3] += a[0] * x + a[1] * y + a[2] * z
			a[7] += a[4] * x + a[5] * y + a[6] * z
			a[11] += a[8] * x + a[9] * y + a[10] * z
			a[15] += a[12] * x + a[13] * y + a[14] * z
		}
		rotX(angle) {
			let elems = this.elements
			let c = Math.cos(angle)
			let s = Math.sin(angle)
			let t = elems[1]
			elems[1] = t * c + elems[2] * s
			elems[2] = t * -s + elems[2] * c
			t = elems[5]
			elems[5] = t * c + elems[6] * s
			elems[6] = t * -s + elems[6] * c
			t = elems[9]
			elems[9] = t * c + elems[10] * s
			elems[10] = t * -s + elems[10] * c
			t = elems[13]
			elems[13] = t * c + elems[14] * s
			elems[14] = t * -s + elems[14] * c
		}
		rotY(angle) {
			let c = Math.cos(angle)
			let s = Math.sin(angle)
			let elems = this.elements
			let t = elems[0]
			elems[0] = t * c + elems[2] * -s
			elems[2] = t * s + elems[2] * c
			t = elems[4]
			elems[4] = t * c + elems[6] * -s
			elems[6] = t * s + elems[6] * c
			t = elems[8]
			elems[8] = t * c + elems[10] * -s
			elems[10] = t * s + elems[10] * c
			t = elems[12]
			elems[12] = t * c + elems[14] * -s
			elems[14] = t * s + elems[14] * c
		}
		transpose() {
			let matrix = this.elements
			let temp = matrix[4]
			matrix[4] = matrix[1]
			matrix[1] = temp

			temp = matrix[8]
			matrix[8] = matrix[2]
			matrix[2] = temp

			temp = matrix[6]
			matrix[6] = matrix[9]
			matrix[9] = temp

			temp = matrix[3]
			matrix[3] = matrix[12]
			matrix[12] = temp

			temp = matrix[7]
			matrix[7] = matrix[13]
			matrix[13] = temp

			temp = matrix[11]
			matrix[11] = matrix[14]
			matrix[14] = temp
		}
		copyArray(from) {
			let to = this.elements
			for (let i = 0; i < from.length; i++) {
				to[i] = from[i]
			}
		}
		copyMatrix(from) {
			let to = this.elements
			from = from.elements
			for (let i = 0; i < from.length; i++) {
				to[i] = from[i]
			}
		}
	}

	function trans(matrix, x, y, z) {
		let a = matrix
		a[3] += a[0] * x + a[1] * y + a[2] * z
		a[7] += a[4] * x + a[5] * y + a[6] * z
		a[11] += a[8] * x + a[9] * y + a[10] * z
		a[15] += a[12] * x + a[13] * y + a[14] * z
	}
	function rotX(matrix, angle) {
		// This function is basically multiplying 2 4x4 matrices together,
		// but 1 of them has a bunch of 0's and 1's in it,
		// so I removed all terms that multiplied by 0, and just left off the 1's.
		// mat2 = [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]
		let elems = matrix
		let c = Math.cos(angle)
		let s = Math.sin(angle)
		let t = elems[1]
		elems[1] = t * c + elems[2] * s
		elems[2] = t * -s + elems[2] * c
		t = elems[5]
		elems[5] = t * c + elems[6] * s
		elems[6] = t * -s + elems[6] * c
		t = elems[9]
		elems[9] = t * c + elems[10] * s
		elems[10] = t * -s + elems[10] * c
		t = elems[13]
		elems[13] = t * c + elems[14] * s
		elems[14] = t * -s + elems[14] * c
	}
	function rotY(matrix, angle) {
	//source = c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1
		let c = Math.cos(angle)
		let s = Math.sin(angle)
		let elems = matrix
		let t = elems[0]
		elems[0] = t * c + elems[2] * -s
		elems[2] = t * s + elems[2] * c
		t = elems[4]
		elems[4] = t * c + elems[6] * -s
		elems[6] = t * s + elems[6] * c
		t = elems[8]
		elems[8] = t * c + elems[10] * -s
		elems[10] = t * s + elems[10] * c
		t = elems[12]
		elems[12] = t * c + elems[14] * -s
		elems[14] = t * s + elems[14] * c
	}
	function transpose(matrix) {
		let temp = matrix[4]
		matrix[4] = matrix[1]
		matrix[1] = temp

		temp = matrix[8]
		matrix[8] = matrix[2]
		matrix[2] = temp

		temp = matrix[6]
		matrix[6] = matrix[9]
		matrix[9] = temp

		temp = matrix[3]
		matrix[3] = matrix[12]
		matrix[12] = temp

		temp = matrix[7]
		matrix[7] = matrix[13]
		matrix[13] = temp

		temp = matrix[11]
		matrix[11] = matrix[14]
		matrix[14] = temp
	}
	function matMult() {
	//Multiply the projection matrix by the view matrix; this is optimized specifically for these matrices by removing terms that are always 0.
		let proj = projection
		let view = modelView
		matrix[0] = proj[0] * view[0]
		matrix[1] = proj[0] * view[1]
		matrix[2] = proj[0] * view[2]
		matrix[3] = proj[0] * view[3]
		matrix[4] = proj[5] * view[4]
		matrix[5] = proj[5] * view[5]
		matrix[6] = proj[5] * view[6]
		matrix[7] = proj[5] * view[7]
		matrix[8] = proj[10] * view[8] + proj[11] * view[12]
		matrix[9] = proj[10] * view[9] + proj[11] * view[13]
		matrix[10] = proj[10] * view[10] + proj[11] * view[14]
		matrix[11] = proj[10] * view[11] + proj[11] * view[15]
		matrix[12] = proj[14] * view[8]
		matrix[13] = proj[14] * view[9]
		matrix[14] = proj[14] * view[10]
		matrix[15] = proj[14] * view[11]
	}
	function copyArr(a, b) {
		for (let i = 0; i < a.length; i++) {
			b[i] = a[i]
		}
	}
	function FOV(fov) {
		let tang = Math.tan(fov * 0.5 * Math.PI / 180)
		let scale = 1 / tang
		let near = 1
		let far = 1000000
		currentFov = fov

		projection[0] = scale / width * height
		projection[5] = scale
		projection[10] = -far / (far - near)
		projection[11] = -1
		projection[14] = -far * near / (far - near)
	}
	function initModelView(camera, x, y, z, rx, ry) {
		if (camera) {
			camera.transform()
			uniformMatrix("view3d", program3D, "uView", false, camera.getMatrix())
		} else {
			copyArr(defaultModelView, modelView)
			rotX(modelView, rx)
			rotY(modelView, ry)
			trans(modelView, -x, -y, -z)
			matMult()
			transpose(matrix)
			uniformMatrix("view3d", program3D, "uView", false, matrix)
		}
	}
	}
})