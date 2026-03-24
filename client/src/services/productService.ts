import axios from "axios"

const API = "http://localhost:3000/api/products"
export const searchProducts = async (keyword:string) => {
  const res = await axios.get(`${API}/search?keyword=${keyword}`)
  return res.data
}
export const getProductDetail = async (id:string) => {
  const res = await axios.get(`${API}/${id}`)
  return res.data
}
