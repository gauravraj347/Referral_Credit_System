import axios from 'axios'

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export function apiAuth(token: string) {
  return axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
}


