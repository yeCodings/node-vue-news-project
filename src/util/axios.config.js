import axios from 'axios';


axios.interceptors.request.use(function (config) {
  // 请求拦截器里，每次请求时把token传到后端
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // console.log(' ', response.headers)
  const { authorization } = response.headers;
  authorization && localStorage.setItem('token', authorization)
  return response;
}, function (error) {
  const { status } = error.response
  if (status === 401) {
    localStorage.removeItem("token")
    window.location.href = "#/login"
  }
  return Promise.reject(error)
})