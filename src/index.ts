import rp from 'request-promise'

interface IConfig {
	bufferSize?: number
	pollIntervalMs?: number
	debug?: boolean
}

const DEFAULT_CONFIG = {
	bufferSize: 20,
	pollIntervalMs: 1000 * 60,
	debug: false,
}

export default (apiKey: string, config: IConfig = DEFAULT_CONFIG) => {
	const {
		bufferSize = DEFAULT_CONFIG.bufferSize,
		pollIntervalMs = DEFAULT_CONFIG.pollIntervalMs,
		debug = DEFAULT_CONFIG.debug,
	} = config

	let buffer: { data: any, type: string }[] = []

	const send = async () => {
		if (buffer.length === 0) return
		const bufferToSend = [...buffer]
		buffer = []

		const options = {
			method: 'POST',
			uri: 'https://suite.chimp.click/logs/create',
			body: {
				apiKey,
				data: bufferToSend
			},
			json: true
		}

		await rp(options)
	}

	// @ts-ignore
	global.log = (data: any, type: string = 'info') => {
		if (debug) {
			console.log({ data, type })
			return
		}
		buffer.push({ data, type })

		if (buffer.length > bufferSize) send()
	}

	setInterval(() => {
		send()
	}, pollIntervalMs)
}