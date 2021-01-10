const getBaseUrl = (url) => {
  let BASE_URL = 'https://kh-dev.0teams.com/jeecg-boot';
  if (process.env.NODE_ENV === 'development') {
    if (url.includes('/api/')) {
      BASE_URL = 'https://kh-dev.0teams.com/jeecg-boot'
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = 'https://kh-dev.0teams.com/jeecg-boot'
    }
  } else {
    // 生产环境
    if (url.includes('/api/')) {
      BASE_URL = 'https://kh-dev.0teams.com/jeecg-boot'
    } else if (url.includes('/iatadatabase/')) {
      BASE_URL = 'https://kh-dev.0teams.com/jeecg-boot'
    }
  }
  return BASE_URL
}
export default getBaseUrl;
