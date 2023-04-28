import {IUppromoteAppConfig, UPPROMOTE_ENV} from '../types/config'
import * as appConfig from './../uppromote.app.config.json'

export const getConfig = (): IUppromoteAppConfig => {
	const configs: { [key in UPPROMOTE_ENV]: IUppromoteAppConfig } = {
		dev: {
			env: UPPROMOTE_ENV.DEV,
			vars: {
				appUrl: appConfig.vars.dev.appUrl
			}
		},
		test: {
			env: UPPROMOTE_ENV.TEST,
			vars: {
				appUrl: appConfig.vars.test.appUrl
			}
		},
		production: {
			env: UPPROMOTE_ENV.PRODUCTION,
			vars: {
				appUrl: appConfig.vars.production.appUrl
			}
		}
	}
	return configs[appConfig.env as UPPROMOTE_ENV]
}

export const uppromoteAppConfig = getConfig()
