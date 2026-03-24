import axios from "axios"

const API = "http://localhost:3000/api/products"

export const addProduct = async (data: any) => {
  return axios.post(API, data)
}

export const getProducts = async () => {
  return axios.get(API)
}

