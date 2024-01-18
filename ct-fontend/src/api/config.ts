import axios, { AxiosResponse } from "axios";

type IStringObj = Record<string, string>

export interface apiResponse<T = IStringObj> {
    code: number;
    msg?: string;
    data?: T;
}

const instance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10 * 1000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

instance.interceptors.request.use(config => {
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
    post<D = Record<string, string | number>, T = IStringObj>(url: string) {
        return (data: T, query = "") => {
            return instance.post<T, apiResponse<D>>(url + query, JSON.stringify(data));
        }
    },
    get<D = IStringObj>(url: string) {
        return (query: string) => {
            return instance.get<D, apiResponse<D>>(url + query);
        }
    }
}
