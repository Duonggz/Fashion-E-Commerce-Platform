import API_BASE_URL from "../config/api"
import { useEffect, useState } from "react"
import axios from "axios"
import EditProduct from "./EditProduct"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  active: boolean
  tags: string[]
}

const ManageProducts = () => {

  const [products,setProducts] = useState<Product[]>([])
  const [editing,setEditing] = useState<any>(null)

  const loadProducts = async () => {

    const res = await axios.get(
      `${API_BASE_URL}/api/products`
    )

    setProducts(res.data)

  }

  useEffect(()=>{

    loadProducts()

  },[])


  const deleteProduct = async (id:string) => {

    await axios.delete(
      `${API_BASE_URL}/api/products/${id}`
    )

    loadProducts()

  }


  const toggleProduct = async (id:string) => {

    await axios.put(
      `${API_BASE_URL}/api/products/toggle/${id}`
    )

    loadProducts()

  }


  return (

    <div style={{padding:"40px"}}>

      <h1>Manage Products</h1>

      {products.map(product => (

        <div
          key={product._id}
          style={{
            display:"flex",
            gap:"20px",
            marginBottom:"20px",
            alignItems:"center",
            borderBottom:"1px solid #ddd",
            paddingBottom:"10px"
          }}
        >

          <img
            src={product.image}
            width="80"
          />

          <div style={{flex:1}}>

            <h3>{product.name}</h3>

            <p>{product.price}đ</p>

            <p>
              Tags: {product.tags.join(", ")}
            </p>

            <p>
              Status:
              {product.active ? " Active" : " Hidden"}
            </p>

          </div>


          <button
            onClick={()=>toggleProduct(product._id)}
          >
            Hide / Show
          </button>

          <button
            onClick={() => setEditing(product)}
          >
            Edit
          </button>

          <button
            onClick={()=>deleteProduct(product._id)}
            style={{color:"red"}}
          >
            Delete
          </button>

        </div>

      ))}

      {editing && (

        <EditProduct
          product={editing}
          reload={loadProducts}
        />

      )}

    </div>

  )

}

export default ManageProducts


