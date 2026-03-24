import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchProducts } from "../services/productService"

interface Product {
  _id: string
  name: string
}

const SearchBar = () => {

  const [keyword,setKeyword] = useState("")
  const [results,setResults] = useState<Product[]>([])

  const navigate = useNavigate()

  const handleSearch = async (value:string) => {

    setKeyword(value)

    if(value.trim() === ""){
      setResults([])
      return
    }

    const data = await searchProducts(value)

    setResults(data)

  }

  const goToProduct = (id:string) => {

    setKeyword("")
    setResults([])

    navigate(`/product/${id}`)

  }

  return (

    <div style={{position:"relative",width:"300px"}}>

      <input
        autoFocus
        type="text"
        placeholder="Search product..."
        value={keyword}
        onChange={(e)=>handleSearch(e.target.value)}
      />

      {results.length > 0 && (

        <div style={{
          position:"absolute",
          top:"40px",
          background:"white",
          width:"100%",
          border:"1px solid #ddd",
          zIndex:1000
        }}>

          {results.map((p)=>(
            <div
              key={p._id}
              onClick={()=>goToProduct(p._id)}
              style={{
                padding:"8px",
                cursor:"pointer"
              }}
            >
              {p.name}
            </div>
          ))}

        </div>

      )}

    </div>

  )

}

export default SearchBar



