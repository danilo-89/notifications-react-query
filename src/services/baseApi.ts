import axios from 'axios'

export const baseApi = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
})
