import axios, { AxiosRequestConfig } from "axios";
import { symmetricEncryption } from "@/common/ts/encrypt";
import { getUserInfo } from "@/common/ts/user-info";
import { IBasicObj } from './types'
import { SEC } from "@/common/constant";
import { _maxTryCnt, ip, port, successCode, timeoutCode } from "./constant";
import { useToast } from "@/components/Toast";
import { toStr } from "@/common/ts/utils";

interface apiRequestConfig extends AxiosRequestConfig {
  notTryAgain?: boolean;
  curTryCnt?: number;
  maxTryCnt?: number;
  hideToast?: boolean
}

const instance = axios.create({
  baseURL: `${ip}:${port}`,
  timeout: 4 * SEC,
  withCredentials: true
});

const reqSet = new Set()
instance.interceptors.request.use(config => {
  const key = `${config.url}$.&${toStr(config.data)}$.&${toStr(config.params)}`
  if (reqSet.has(key)) {
    const controller = new AbortController()
    config.signal = controller.signal
    controller.abort()
    throw new Error('请耐心等待~')
  }
  config.headers.key = key
  reqSet.add(key)

  let userinfo = getUserInfo();
  if (!userinfo) {
    userinfo = JSON.parse(localStorage.getItem('user-info') || '{}') // 避免第一次进入没有登录过
  }
  let query = "";

  if (userinfo?.id) {
    config.headers['X-CSRF-TOKEN'] = symmetricEncryption(userinfo.id)
    query = `id=${userinfo.id}&account=${userinfo.account}`
  }
  if (query && config.url) {
    config.url.indexOf('?') === -1 ? (config.url += '?') : (config.url += '&');
    config.url += query;
  }
  if (config.method?.toLocaleLowerCase() === 'post' && config.data instanceof FormData) {
    config.headers["Content-Type"] = 'multipart/form-data'
  }

  return config;
});

instance.interceptors.response.use(resp => {
  reqSet.delete(resp.config.headers.key)
  if (resp.data.code !== successCode) {
    // @ts-ignore
    !resp.config.hideToast && useToast(resp.data.msg)
    return Promise.reject({ message: resp.data.msg })
  }

  return resp.data.data
}, error => {
  reqSet.delete(error.config.headers.key)
  if (error.code === timeoutCode && !error.config.notTryAgain) {
    if (error.config.curTryCnt <= (error.config.maxTryCnt ?? _maxTryCnt)) {
      ++error.config.curTryCnt
      return axios(error.config)
    }
    useToast('请重试~')
    return
  }
  !error.config.hideToast && useToast(error.message)
  return Promise.reject(error);
})

function request<D = IBasicObj>({ method, url, config, params }: { method: 'get' | 'post' | 'delete', url: string, config: apiRequestConfig, params: IBasicObj | FormData }) {
  if (['get', 'delete'].includes(method)) {
    config.params = params || {}
    return instance[method]<D, D>(url, config)
  } else {
    return instance[method]<D, D>(url, params, config)
  }
}

export default {
  post<D = IBasicObj>(url: string, config: apiRequestConfig = {}) {
    return (params: IBasicObj | FormData) => {
      return request<D>({ method: 'post', url, config, params })
    }
  },
  get<D = IBasicObj>(url: string, config: apiRequestConfig = {}) {
    return (query = {}) => {
      return request<D>({ method: 'get', url, config, params: query })
    }
  },
  delete<D = IBasicObj>(url: string, config: apiRequestConfig = {}) {
    return (query = {}) => {
      return request<D>({ method: 'delete', url, config, params: query })
    }
  }
}
