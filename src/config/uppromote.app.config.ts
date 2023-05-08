import {IUppromoteAppConfig, UPPROMOTE_ENV} from '../types/config'

export const APP_ENV = UPPROMOTE_ENV.DEV

export function getConfig(env: UPPROMOTE_ENV): IUppromoteAppConfig {
	const configs = {
		dev: {
			'appUrl': 'https://secomapp-affiliate.test',
			'cdnHost': 'https://secomapp-affiliate.test/storage',
			'styleUrl': 'https://secomapp-affiliate.test/css/hydrogen/main.css'
		},
		test: {
			'appUrl': 'https://af-test.uppromote.com',
			'cdnHost': 'https://af-test.uppromote.com/storage',
			'styleUrl': 'https://af-test.uppromote.com/css/hydrogen/main.css'
		},
		production: {
			'appUrl': 'https://track.uppromote.com',
			'cdnHost': 'https://cdn.uppromote.com',
			'styleUrl': 'https://d1639lhkj5l89m.cloudfront.net/css/hydrogen/main.css'
		}
	}
	return configs[env]
}

export const uppromoteAppConfig = getConfig(APP_ENV)
