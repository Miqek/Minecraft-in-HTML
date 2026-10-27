/* js/utils/format.js — Utilidades de formateo temporal y redondeo numérico | Provee: timeString, roundBits | Requiere: — | Posee: funciones puras de tiempo y redondeo | Origen: sección #17 de js/main.js */

window.MineKhanParts = window.MineKhanParts || []

window.MineKhanParts.push({
	id: "utils/format",
	order: 17.00,
	name: "Utilidades: timeString y roundBits",
	body: function () {
	function timeString(millis) {
		if (millis > 300000000000 || !millis) {
			return "never"
		}
		const SECOND = 1000
		const MINUTE = SECOND * 60
		const HOUR = MINUTE * 60
		const DAY = HOUR * 24
		const YEAR = DAY * 365

		if (millis < MINUTE) {
			return "just now"
		}

		let years = Math.floor(millis / YEAR)
		millis -= years * YEAR

		let days = Math.floor(millis / DAY)
		millis -= days * DAY

		let hours = Math.floor(millis / HOUR)
		millis -= hours * HOUR

		let minutes = Math.floor(millis / MINUTE)

		if (years) {
			return `${years} year${years > 1 ? "s" : ""} and ${days} day${day !== 1 ? "s" : ""} ago`
		}
		if (days) {
			return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`
		}
		if (hours) {
			return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""} ago`
		}
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
	}
	function roundBits(number) {
		return Math.round(number * 1000000) / 1000000
	}
	}
})