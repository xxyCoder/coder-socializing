import axios, { AxiosRequestConfig } from "axios";
import { readCookie } from "@/common/ts/encrypt";
import { getUserInfo } from "@/common/ts/user-info";
import { IBasicObj } from './types'
import { SEC } from "@/common/constant";
import { _maxTryCnt, ip, port, successCode, timeoutCode } from "./constant";
import { useToast } from "@/components/Toast";

interface apiRequestConfig extends AxiosRequestConfig {
  notTryAgain?: boolean;
  curTryCnt?: number;
  maxTryCnt?: number;
}

const instance = axios.create({
  baseURL: `${ip}:${port}`,
  timeout: 4 * SEC,
  withCredentials: true
});

const reqSet = new Set()
instance.interceptors.request.use(config => {
  if (reqSet.has(config)) {
    const controller = new AbortController()
    config.signal = controller.signal
    controller.abort()
    throw new Error('请耐心等待~')
  }

  let userinfo = getUserInfo();
  if (!userinfo) {
    userinfo = JSON.parse(localStorage.getItem('user-info') || '{}') // 避免第一次进入没有登录过
  }
  let query = "";
  userinfo?.id && (query = `id=${userinfo.id}&account=${userinfo.account}`)
  if (query && config.url) {
    config.url.indexOf('?') === -1 ? (config.url += '?') : (config.url += '&');
    config.url += query;
  }
  if (config.method?.toLocaleLowerCase() === 'post' && config.data instanceof FormData) {
    config.headers["Content-Type"] = 'multipart/form-data'
  }

  config.headers['X-CSRF-TOKEN'] = readCookie('XSRF-TOKEN')
  return config;
});

instance.interceptors.response.use(resp => {
  if (resp.data.code !== successCode) {
    useToast(resp.data.msg)
    return Promise.reject({ message: resp.data.msg })
  }

  return resp.data.data
}, error => {
  if (error.code === timeoutCode && !error.config.notTryAgain) {
    if (error.config.curTryCnt <= (error.config.maxTryCnt ?? _maxTryCnt)) {
      ++error.config.curTryCnt
      return axios(error.config)
    }
    useToast('请重试~')
    return
  }
  useToast(error.message)
  return Promise.reject(error);
})

export default {
  post<D = IBasicObj>(url: string, config: apiRequestConfig = {}) {
    return (params: IBasicObj | FormData) => {
      return instance.post<D, D>(url, params, config);
    }
  },
  get<D = IBasicObj>(url: string, config: apiRequestConfig = {}) {
    return (query = {}) => {
      config.params = query
      return instance.get<D, D>(url, config);
    }
  }
}
