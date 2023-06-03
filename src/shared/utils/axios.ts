import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.green-api.com/',
  timeout: 120000
})

const errorHandler = (error: AxiosError) => {
  return Promise.reject(error?.response)
}

const resHandler = (response: AxiosResponse) => {
  const { data } = response

  return Promise.resolve(data)
}

axiosInstance.interceptors.response.use(resHandler, errorHandler)

export default axiosInstance
