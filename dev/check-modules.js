/**
 * dev/check-modules.js — Herramienta de verificación estática de módulos y calidad.
 * Ejecución: node dev/check-modules.js
 */

const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.resolve(__dirname, '..')
const MAX_LINES_WARN = 300
const MAX_LINES_ERROR = 1000

let hasErrors = false
let warningCount = 0
let errorCount = 0

console.log('\n=== Verificando módulos de MineKhan ===\n')

function getFilesRecursively(dir, fileList = []) {
	if (!fs.existsSync(dir)) return fileList
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			if (entry.name !== 'node_modules' && entry.name !== '.git') {
				getFilesRecursively(fullPath, fileList)
			}
		} else if (entry.isFile() && entry.name.endsWith('.js')) {
			fileList.push(fullPath)
		}
	}
	return fileList
}

const targetDirs = [
	'js', 'bootstrap', 'core', 'utils', 'blocks', 'render',
	'world', 'physics', 'player', 'inventory', 'interaction',
	'gamemodes', 'entities', 'audio', 'controls', 'ui'
]

let allJsFiles = []
for (const dirName of targetDirs) {
	const dirPath = path.join(ROOT_DIR, dirName)
	getFilesRecursively(dirPath, allJsFiles)
}

allJsFiles = Array.from(new Set(allJsFiles))

const seenOrders = new Map()
const seenIds = new Map()

for (const filePath of allJsFiles) {
	const relPath = path.relative(ROOT_DIR, filePath)
	const content = fs.readFileSync(filePath, 'utf8')
	const lines = content.split(/\r?\n/).length

	if (lines > MAX_LINES_ERROR) {
		console.error(`[ERROR] ${relPath}: ${lines} líneas (límite máximo permitido: ${MAX_LINES_ERROR})`)
		hasErrors = true
		errorCount++
	} else if (lines > MAX_LINES_WARN) {
		console.warn(`[AVISO] ${relPath}: ${lines} líneas (recomendado: 50–${MAX_LINES_WARN} líneas)`)
		warningCount++
	}

	const pushRegex = /MineKhanParts\.push\s*\(\s*\{([\s\S]*?)\bbody\s*:/g
	let match
	while ((match = pushRegex.exec(content)) !== null) {
		const block = match[1]

		const orderMatch = block.match(/\border\s*:\s*([0-9]+(?:\.[0-9]+)?)/)
		const idMatch = block.match(/\bid\s*:\s*["']([^"']+)["']/)

		if (orderMatch) {
			const orderVal = parseFloat(orderMatch[1])
			if (seenOrders.has(orderVal)) {
				console.error(`[ERROR] 'order' duplicado (${orderVal}) en ${relPath} (ya definido en ${seenOrders.get(orderVal)})`)
				hasErrors = true
				errorCount++
			} else {
				seenOrders.set(orderVal, relPath)
			}
		}

		if (idMatch) {
			const idVal = idMatch[1]
			if (seenIds.has(idVal)) {
				console.error(`[ERROR] 'id' duplicado ("${idVal}") en ${relPath} (ya definido en ${seenIds.get(idVal)})`)
				hasErrors = true
				errorCount++
			} else {
				seenIds.set(idVal, relPath)
			}
		}
	}
}

const manifestPath = path.join(ROOT_DIR, 'js', 'bootstrap', 'module-manifest.js')
if (fs.existsSync(manifestPath)) {
	const manifestContent = fs.readFileSync(manifestPath, 'utf8')
	const fileRegex = /\bfile\s*:\s*["']([^"']+)["']/g
	let fileMatch
	while ((fileMatch = fileRegex.exec(manifestContent)) !== null) {
		const targetFile = fileMatch[1]
		const absoluteTarget = path.join(ROOT_DIR, targetFile)
		if (!fs.existsSync(absoluteTarget)) {
			console.error(`[ERROR] Archivo del manifest no encontrado: "${targetFile}"`)
			hasErrors = true
			errorCount++
		}
	}
}

console.log('\n=== Resumen de Verificación ===')
console.log(`Archivos analizados: ${allJsFiles.length}`)
console.log(`Secciones detectadas: ${seenOrders.size}`)
console.log(`Avisos (>300 líneas): ${warningCount}`)
console.log(`Errores: ${errorCount}`)

if (hasErrors) {
	console.log('\n❌ Verificación FALLIDA: Se detectaron errores.\n')
	process.exit(1)
} else {
	console.log('\n✅ Verificación EXITOSA: Cumple con las restricciones.\n')
	process.exit(0)
}