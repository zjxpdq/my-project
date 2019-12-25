import i from './../../utils/request'

export const login = {
  log: params => i.post('/auth/shopback/oauth/token', params)
}

export const regions = {
  getProvince: () => i.get('/shopback/shop/getFirstLevelLocation'),
  getCityList: params => i.get('/shopback/shop/getFirstLevelLocation/' + params),
  getDistrictList: params => i.get('/shopback/shop/getFirstLevelLocation/' + params)
}
