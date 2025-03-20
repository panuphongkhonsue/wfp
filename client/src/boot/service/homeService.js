import { api } from '../axios'

const path = 'home'

export default {
  getName() {
    return api.get(`${path}/file`)
  },
  getByName(options) {
    return api.get(`${path}/file/get-by-name`, {
      params: options,
      responseType: 'arraybuffer',
    })
  },
  upload(formData) {
    return api.post(`${path}/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  delete(payload) {
    return api.post(`${path}/file/delete`, payload)
  },
}
