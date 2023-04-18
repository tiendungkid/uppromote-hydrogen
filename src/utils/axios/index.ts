import axios from 'axios'
import {uppromoteAppConfig} from '../../config/uppromote.app.config'

export const getAxiosInstance = async () => {
	return axios.create({
		baseURL: uppromoteAppConfig().vars.appUrl
	})
}
