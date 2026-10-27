/* js/render/camera.js — Planos de recorte (Plane), transformación por defecto y clase Camera | Provee: Plane, defaultTransformation, Camera | Requiere: Matrix, settings, width, height, matrix, vec1, vec2, vec3, cross, p | Posee: clase Plane y clase Camera | Origen: sección #16 de js/engine.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "render/camera",
	order: 16.50,
	name: "Cámara y planos de frustum (Plane, Camera)",
	body: function () {
	class Plane {
		constructor(nx, ny, nz) {
			this.set(nx, ny, nz)
		}
		set(nx, ny, nz) {
			// Pre-computed chunk offsets to reduce branching during culling
			this.dx = nx > 0 ? 16 : 0
			this.dy = ny > 0
			this.dz = nz > 0 ? 16 : 0

			// Normal vector for the plane
			this.nx = nx
			this.ny = ny
			this.nz = nz
		}
	}

	let defaultTransformation = new Matrix([ -10,0,0,0,0,10,0,0,0,0,-10,0,0,0,0,1 ])
	class Camera {
		constructor() {
			this.x = 0
			this.y = 0
			this.z = 0
			this.rx = 0; // Pitch
			this.ry = 0; // Yaw
			this.currentFov = 0
			this.defaultFov = settings.fov
			this.targetFov = settings.fov
			this.step = 0
			this.lastStep = 0
			this.projection = new Float32Array(5)
			this.transformation = new Matrix()
			this.direction = { x: 1, y: 0, z: 0 }; // Normalized direction vector
			this.frustum = [] // The 5 planes of the viewing frustum (there's no far plane)
			for (let i = 0; i < 5; i++) {
				this.frustum.push(new Plane(1, 0, 0))
			}
		}
		FOV(fov, time) {
			if (fov === this.currentFov) return

			if (!fov) {
				let now = Date.now()
				fov = this.currentFov + this.step * (now - this.lastStep)
				this.lastStep = now
				if (Math.sign(this.targetFov - this.currentFov) !== Math.sign(this.targetFov - fov)) {
					fov = this.targetFov
				}
			}
			else if (time) {
				this.targetFov = fov
				this.step = (fov - this.currentFov) / time
				this.lastStep = Date.now()
				return
			} else {
				this.targetFov = fov
			}

			const tang = Math.tan(fov * Math.PI / 360)
			const scale = 1 / tang
			const near = 1
			const far = 1000000
			this.currentFov = fov; // Store the state of the projection matrix
			this.nearH = near * tang; // This is needed for frustum culling

			this.projection[0] = scale / width * height
			this.projection[1] = scale
			this.projection[2] = -far / (far - near)
			this.projection[3] = -1
			this.projection[4] = -far * near / (far - near)
		}
		transform() {
			this.transformation.copyMatrix(defaultTransformation)
			this.transformation.rotX(this.rx)
			this.transformation.rotY(this.ry)
			this.transformation.translate(-this.x, -this.y, -this.z)
		}
		getMatrix() {
			let proj = this.projection
			let view = this.transformation.elements
			matrix[0]  = proj[0] * view[0]
			matrix[1]  = proj[1] * view[4]
			matrix[2]  = proj[2] * view[8] + proj[3] * view[12]
			matrix[3]  = proj[4] * view[8]
			matrix[4]  = proj[0] * view[1]
			matrix[5]  = proj[1] * view[5]
			matrix[6]  = proj[2] * view[9] + proj[3] * view[13]
			matrix[7]  = proj[4] * view[9]
			matrix[8]  = proj[0] * view[2]
			matrix[9]  = proj[1] * view[6]
			matrix[10] = proj[2] * view[10] + proj[3] * view[14]
			matrix[11] = proj[4] * view[10]
			matrix[12] = proj[0] * view[3]
			matrix[13] = proj[1] * view[7]
			matrix[14] = proj[2] * view[11] + proj[3] * view[15]
			matrix[15] = proj[4] * view[11]
			return matrix
		}
		setDirection() {
			if (this.targetFov !== this.currentFov) {
				this.FOV()
			}
			this.direction.x = -Math.sin(this.ry) * Math.cos(this.rx)
			this.direction.y = Math.sin(this.rx)
			this.direction.z = Math.cos(this.ry) * Math.cos(this.rx)
			this.computeFrustum()
		}
		computeFrustum() {
			let X = vec1
			let dir = this.direction
			X.x = dir.z
			X.y = 0
			X.z = -dir.x
			X.normalize()

			let Y = vec2
			Y.set(dir)
			Y.mult(-1)
			cross(Y, X, Y)

			//Near plane
			this.frustum[0].set(dir.x, dir.y, dir.z)

			let aux = vec3
			aux.set(Y)
			aux.mult(this.nearH)
			aux.add(dir)
			aux.normalize()
			cross(aux, X, aux)
			this.frustum[1].set(aux.x, aux.y, aux.z)

			aux.set(Y)
			aux.mult(-this.nearH)
			aux.add(dir)
			aux.normalize()
			cross(X, aux, aux)
			this.frustum[2].set(aux.x, aux.y, aux.z)

			aux.set(X)
			aux.mult(-this.nearH * width / height)
			aux.add(dir)
			aux.normalize()
			cross(aux, Y, aux)
			this.frustum[3].set(aux.x, aux.y, aux.z)

			aux.set(X)
			aux.mult(this.nearH * width / height)
			aux.add(dir)
			aux.normalize()
			cross(Y, aux, aux)
			this.frustum[4].set(aux.x, aux.y, aux.z)
		}
		canSee(x, y, z, maxY) {
			x -= 0.5
			y -= 0.5
			z -= 0.5
			maxY += 0.5
			let px = 0, py = 0, pz = 0, plane = null
			let cx = p.x, cy = p.y, cz = p.z
			for (let i = 0; i < 5; i++) {
				plane = this.frustum[i]
				px = x + plane.dx
				py = plane.dy ? maxY : y
				pz = z + plane.dz
				if ((px - cx) * plane.nx + (py - cy) * plane.ny + (pz - cz) * plane.nz < 0) {
					return false
				}
			}
			return true
		}
	}
	}
})