import {IUppromoteAppConfig, UPPROMOTE_ENV} from '../types/config'

export const APP_ENV = UPPROMOTE_ENV.DEV

export function getConfig(env: UPPROMOTE_ENV): IUppromoteAppConfig {
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
	return configs[env]
}

export const uppromoteAppConfig = getConfig(APP_ENV)
