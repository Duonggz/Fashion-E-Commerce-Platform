import API_BASE_URL from "../config/api"
import { useState } from "react"
import axios from "axios"

const Products = () => {

  const [name,setName] = useState("")
  const [price,setPrice] = useState("")
  const [description,setDescription] = useState("")
  const [tags,setTags] = useState<string[]>([])
  const [image,setImage] = useState<File | null>(null)

  const [sizes,setSizes] = useState([
    { size:"S", quantity:0 },
    { size:"M", quantity:0 },
    { size:"L", quantity:0 }
  ])

  const handleSizeChange = (index:number,value:number) => {

    const newSizes = [...sizes]
    newSizes[index].quantity = value

    setSizes(newSizes)
  }

  const handleTag = (tag:string) => {

    if(tags.includes(tag)){
      setTags(tags.filter(t => t !== tag))
    }else{
      setTags([...tags,tag])
    }

  }

  const handleSubmit = async () => {

    const formData = new FormData()

    formData.append("name",name)
    formData.append("price",price)
    formData.append("description",description)
    formData.append("tags",JSON.stringify(tags))
    formData.append("sizes",JSON.stringify(sizes))

    if(image){
      formData.append("image",image)
    }

    await axios.post(
      `${API_BASE_URL}/api/products`,
      formData
    )

    alert("Product added!")

  }

  return (

    <div style={{padding:"40px"}}>

      <h2>Add Product</h2>

      <input
        placeholder="Product name"
        onChange={(e)=>setName(e.target.value)}
      />

      <br/>

      <input
        placeholder="Price"
        onChange={(e)=>setPrice(e.target.value)}
      />

      <br/>

      <textarea
        placeholder="Description"
        onChange={(e)=>setDescription(e.target.value)}
      />

      <br/>

      <h3>Upload Image</h3>

      <input
        type="file"
        onChange={(e)=>setImage(e.target.files?.[0] || null)}
      />

      <h3>Tags</h3>

      <label>
        <input
          type="checkbox"
          onChange={()=>handleTag("Nam")}
        />
        Nam
      </label>

      <label>
        <input
          type="checkbox"
          onChange={()=>handleTag("Nu")}
        />
        Nu
      </label>
     
     {/* <label>
        <input
          type="checkbox"
          onChange={()=>handleTag("Unisex")}
        />
        Unisex
      </label> */}

      <h3>Sizes</h3>

      {sizes.map((s,i)=>(
        <div key={i}>
          {s.size}

          <input
            type="number"
            onChange={(e)=>
              handleSizeChange(i,Number(e.target.value))
            }
          />

        </div>
      ))}

      <br/>

      <button onClick={handleSubmit}>
        Add product
      </button>

    </div>

  )
}

export default Products


