const getBaseUrl = (url) => {
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    if (url.includes('/api/')) {
      BASE_URL = ''
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = ''
    }
  } else {
    // 生产环境
    if (url.includes('/api/')) {
      BASE_URL = ''
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = ''
    }
  }
  return BASE_URL
}
export default getBaseUrl;
