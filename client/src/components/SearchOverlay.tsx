import { useState} from "react"
import { searchProducts } from "../services/productService"
import SearchResultItem from "./SearchResultItem"
import { useNavigate } from "react-router-dom"
import "../assets/styles/search.css"

interface Props{
  open:boolean
  close:()=>void
}

export default function SearchOverlay({open,close}:Props){

  const navigate = useNavigate()
  const [keyword,setKeyword] = useState("")
  const [results,setResults] = useState<any[]>([])

  const handleSearch = async(value:string)=>{

    setKeyword(value)

    if(value.trim()===""){
      setResults([])
      return
    }

    const data = await searchProducts(value)

    setResults(data)

  }

  const suggestions = [
  "Áo dài Kuchimahic",
  "Áo dài Lalin",
  "Áo dài Magenta vintage",
  "Áo dài Remmus"
]

const handleSuggestion = (value:string) => {

  setKeyword(value)

  navigate(`/search?q=${value}`)

  close()

}

const handleSubmit = () => {

  if(keyword.trim()==="") return

  navigate(`/search?q=${keyword}`)

  close()

}

  if(!open) return null

  return(

    <div className="search-overlay">

      <div className="search-box">

        <input
          autoFocus
          type="text"
          placeholder="Search product..."
          value={keyword}
          onChange={(e)=>handleSearch(e.target.value)}
            onKeyDown={(e)=>{
            if(e.key==="Enter"){
              handleSubmit()
            }
          }}
        />

        <div className="search-close-btn" onClick={close}>
            ✕
        </div>

      </div>

          {keyword === "" && (

            <div className="search-suggestions">

              {suggestions.map((item)=>(
                <p
                  key={item}
                  className="suggestion-item"
                  onClick={()=>handleSuggestion(item)}
                >
                  {item}
                </p>
              ))}

            </div>
          )}

      <div className="search-results">

        {results.map((p)=>(
          <SearchResultItem
            key={p._id}
            product={p}
            close={close}
          />
        ))}

      </div>

    </div>

  )

}
