import API_BASE_URL from "../config/api"
import axios from "axios"

const API = `${API_BASE_URL}/api/products`

export const addProduct = async (data: any) => {
  return axios.post(API, data)
}

export const getProducts = async () => {
  return axios.get(API)
}




