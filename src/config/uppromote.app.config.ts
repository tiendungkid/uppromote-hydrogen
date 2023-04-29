import {IUppromoteAppConfig, UPPROMOTE_ENV} from '../types/config'

export const APP_ENV = UPPROMOTE_ENV.DEV

export function getConfig(): IUppromoteAppConfig {
	const configs = {
		dev: {
			'appUrl': 'https://secomapp-affiliate.test'
		},
		test: {
			'appUrl': 'https://af-test.uppromote.com'
		},
		production: {
			'appUrl': 'https://track.uppromote.com'
		}
	}
	return configs[APP_ENV]
}

export const uppromoteAppConfig = getConfig()
