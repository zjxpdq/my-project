import axios from 'axios'

const service = axios.create({
  baseURL: '',
  timeout: 50000
})

service.interceptors.response.use(res => {
  return res.data
}, error => Promise.reject(error.response))

service.interceptors.request.use(config => {
  return config
}, error => Promise.reject(error))

export default service
