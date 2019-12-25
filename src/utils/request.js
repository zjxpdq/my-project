import axios from 'axios'
import Cookie from 'js-cookie'

const service = axios.create({
  baseURL: '/api',
  timeout: 50000
})

service.interceptors.response.use(res => {
  return res.data
}, error => Promise.reject(error.response))

service.interceptors.request.use(config => {
  if (Cookie.get('token')) { // 判断当前不在login页面，如果在则不带 token
    config.headers.Authorization = 'Bearer ' + Cookie.get('token')
  }
  return config
}, error => Promise.reject(error))

export default service
