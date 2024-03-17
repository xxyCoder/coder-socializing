import { readCookie } from "@/common/ts/encrypt";
import { getUserInfo } from "@/common/ts/user-info";
import axios, { AxiosRequestConfig } from "axios";
import { IAnyObj, PostFirstArg } from './types'

export interface apiResponse<T = IAnyObj> {
    code: number;
    msg?: string;
    data?: T;
}

export const ip = 'http://localhost';
export const port = 3000;
export const backendStatic = '/uploads'

const instance = axios.create({
    baseURL: `${ip}:${port}`,
    timeout: 10 * 1000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

instance.interceptors.request.use(config => {
    let userinfo = getUserInfo();
    if (!userinfo) {
        userinfo = JSON.parse(localStorage.getItem('user-info') || '{}') // 避免第一次进入没有登录过
    }
    let query = "";
    userinfo && (query = `id=${userinfo.id}&account=${userinfo.account}`)
    if (query && config.url) {
        config.url.indexOf('?') === -1 ? (config.url += '?') : (config.url += '&');
        config.url += query;
    }
    config.headers['X-CSRF-TOKEN'] = readCookie('XSRF-TOKEN')

    return config;
}, error => {
    console.error("请求错误: ", error);
    return Promise.resolve(error);
});

instance.interceptors.response.use(resp => {
    if (resp.data.code !== 200) {
        return Promise.reject({ message: resp.data.msg })
    }
    return resp.data.data
}, error => {
    console.error("响应出错: ", error);
    return Promise.resolve(error);
})

export default {
    post<D = PostFirstArg, T = IAnyObj>(url: string) {
        return (data: T, query = "", config: AxiosRequestConfig<T> = {}) => {
            let _data: string | FormData = JSON.stringify(data)
            if (config.headers?.["Content-Type"] === 'multipart/form-data' && data instanceof FormData) {
                _data = data
            }
            return instance.post<D, D>(url + query, _data, config);
        }
    },
    get<D = IAnyObj>(url: string) {
        return (query = "") => {
            return instance.get<D, D>(url + query);
        }
    }
}
