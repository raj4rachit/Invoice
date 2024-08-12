import { CardData, Dashboard } from 'store/ApiConstant';
import { AxiosAuthServices } from './axios/axiosServices';

export function DashboardApi(params) {
    return AxiosAuthServices.get(Dashboard, params);
}
export function CardDataByDateApi(params) {
    return AxiosAuthServices.get(CardData, params);
}
