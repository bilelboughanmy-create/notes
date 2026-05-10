import api from './axios'

export const notesApi = {
  getAll: ()         => api.get('/notes'),
  create: (data)     => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  remove: (id)       => api.delete(`/notes/${id}`),
}

export const authApi = {
  register: (data) => api.post('/register', data),
  login:    (data) => api.post('/login', data),
  logout:   ()     => api.post('/logout'),
}
