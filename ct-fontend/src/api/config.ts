import { readCookie } from "@/common/ts/encrypt";
import { getUserInfo } from "@/common/ts/user-info";
import axios, { AxiosRequestConfig } from "axios";

type IStringObj = Record<string, string>;
export type PostFirstArg = Record<string, string | number>

export interface apiResponse<T = IStringObj> {
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
    userinfo?.id && (query += `id=${userinfo.id}`);
    if (userinfo?.account) {
        if (query) query += '&';
        query += `account=${userinfo.account}`
    }
    if (query && config.url) {
        config.url.indexOf('?') === -1 ? (config.url += '?') : (config.url += '&');
        config.url += query;
    }
    config.headers['X-CSRF-TOKEN'] = readCookie('XSRF-TOKEN')

    console.log(config)
    return config;
}, error => {
    console.error("请求错误: ", error);
    return Promise.resolve(error);
});

instance.interceptors.response.use(resp => {
    return resp.data;
}, error => {
    console.error("响应出错: ", error);
    return Promise.resolve(error);
})

export default {
    post<D = PostFirstArg, T = IStringObj>(url: string) {
        return (data: T, query = "", config: AxiosRequestConfig<T> = {}) => {
            let _data: string | FormData = JSON.stringify(data)
            if (config.headers?.["Content-Type"] === 'multipart/form-data' && data instanceof FormData) {
                _data = data
            }
            return instance.post<D, apiResponse<D>>(url + query, _data, config);
        }
    },
    get<D = IStringObj>(url: string) {
        return (query: string) => {
            return instance.get<D, apiResponse<D>>(url + query);
        }
    }
}
