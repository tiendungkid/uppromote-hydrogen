import {LocalTrackingVariables} from '../types/cookies'
import {getAxiosInstance} from '../utils/axios'
import TrackingAffiliateResponse from '../types/tracking-affiliate-response'
import {AxiosResponse} from 'axios'

export default class UppromoteApi {
	public postClickTracking(
		trackingVars: LocalTrackingVariables,
		onSuccess: (response: TrackingAffiliateResponse) => void,
		onError: (error: any) => void
	) {
		getAxiosInstance().then((axiosInstance) => {
			axiosInstance.post('api/click_tracking', trackingVars)
				.then((res: AxiosResponse<TrackingAffiliateResponse>) => onSuccess(res.data))
				.catch(onError)
		})
	}
}
