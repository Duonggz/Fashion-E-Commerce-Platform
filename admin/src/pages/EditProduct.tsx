import API_BASE_URL from "../config/api"
import { useState } from "react"
import axios from "axios"

const EditProduct = ({ product, reload }: any) => {

  const [name,setName] = useState(product.name)
  const [price,setPrice] = useState(product.price)
  const [description,setDescription] = useState(product.description)
  const [tags,setTags] = useState<string[]>(product.tags || [])
  const [image,setImage] = useState<File | null>(null)

  const [sizes,setSizes] = useState(product.sizes || [])

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

    await axios.put(
      `${API_BASE_URL}/api/products/${product._id}`,
      formData
    )

    alert("Updated!")

    reload()
  }

  return (

    <div style={{border:"1px solid #ccc",padding:"20px",marginTop:"20px"}}>

      <h3>Edit Product</h3>

      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <br/>

      <input
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />

      <br/>

      <textarea
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <h4>Image</h4>

      <input
        type="file"
        onChange={(e)=>setImage(e.target.files?.[0] || null)}
      />

      <h4>Tags</h4>

      <label>
        <input
          type="checkbox"
          checked={tags.includes("Nam")}
          onChange={()=>handleTag("Nam")}
        />
        Nam
      </label>

      <label>
        <input
          type="checkbox"
          checked={tags.includes("Nu")}
          onChange={()=>handleTag("Nu")}
        />
        Nu
      </label>

      <label>
        <input
          type="checkbox"
          checked={tags.includes("Unisex")}
          onChange={()=>handleTag("Unisex")}
        />
        Unisex
      </label>

      <h4>Sizes</h4>

      {sizes.map((s:any,i:number)=>(
        <div key={i}>
          {s.size}

          <input
            type="number"
            value={s.quantity}
            onChange={(e)=>handleSizeChange(i,Number(e.target.value))}
          />

        </div>
      ))}

      <br/>

      <button onClick={handleSubmit}>
        Save
      </button>

    </div>
  )

}

export default EditProduct


