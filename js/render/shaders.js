/* js/render/shaders.js — Código fuente GLSL, compilación y programas shader | Provee: vertexShaderSrc3D, fragmentShaderSrc3D, vertexShaderSrc2D, fragmentShaderSrc2D, createProgramObject, program3D, program2D | Requiere: doc | Posee: shaders GLSL y compilador de programas | Origen: sección #16 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/shaders",
	order: 16.10,
	name: "Shaders GLSL, compilación y programas 2D/3D",
	body: function () {
	// GLSL Shader code (written in script tags at the top of the file)
	let vertexShaderSrc3D = document.getElementById("blockVertexShader").text
	let fragmentShaderSrc3D = document.getElementById("blockFragmentShader").text
	let vertexShaderSrc2D = document.getElementById("2dVertexShader").text
	let fragmentShaderSrc2D = document.getElementById("2dFragmentShader").text

	function createProgramObject(curContext, vetexShaderSource, fragmentShaderSource) {
		let vertexShaderObject = curContext.createShader(curContext.VERTEX_SHADER)
		curContext.shaderSource(vertexShaderObject, vetexShaderSource)
		curContext.compileShader(vertexShaderObject)
		if (!curContext.getShaderParameter(vertexShaderObject, curContext.COMPILE_STATUS)) {
			throw curContext.getShaderInfoLog(vertexShaderObject)
		}

		let fragmentShaderObject = curContext.createShader(curContext.FRAGMENT_SHADER)
		curContext.shaderSource(fragmentShaderObject, fragmentShaderSource)
		curContext.compileShader(fragmentShaderObject)
		if (!curContext.getShaderParameter(fragmentShaderObject, curContext.COMPILE_STATUS)) {
			throw curContext.getShaderInfoLog(fragmentShaderObject)
		}

		let programObject = curContext.createProgram()
		curContext.attachShader(programObject, vertexShaderObject)
		curContext.attachShader(programObject, fragmentShaderObject)
		curContext.linkProgram(programObject)
		if (!curContext.getProgramParameter(programObject, curContext.LINK_STATUS)) {
			throw "Error linking shaders."
		}

		return programObject
	}

	let program3D, program2D
	}
})