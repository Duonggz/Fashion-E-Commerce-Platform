import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { searchProducts } from "../services/productService"
import SearchOverlay from "../components/SearchOverlay"

export default function SearchPage(){

  const user = JSON.parse(localStorage.getItem("user") || "null")
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [openSearch,setOpenSearch] = useState(false)

  const keyword = params.get("q") || ""

  const [products,setProducts] = useState<any[]>([])

  useEffect(()=>{
    document.body.style.overflow = "auto"
    const load = async()=>{

      const data = await searchProducts(keyword)

      setProducts(data)

    }

    if(keyword){
      load()
    }

  },[keyword])

  return(

    <div className="search-page">
      <header className="category-header">

        <div className="category-logo">
          <Link to="/">
            <img src="/assets/icons/logotmdt3.png" alt="logo" />
          </Link>
        </div>

        <div className="category-icons">
          <Link to="/profile">
            <img src="/assets/icons/193.png" alt="user" />
          </Link>

          <Link to="/cart">
            <img src="/assets/icons/194.png" alt="cart" />
          </Link>
        </div>

      </header>

      <h2 style={{ padding: "70px 0px" }}>Kết quả cho: "{keyword}"</h2>

      <div className="product-grid" >

        {products.map((p)=>(
          <div
            key={p._id}
            className="product-card"
            onClick={()=>navigate(`/product/${p._id}`)}
            style={{ padding: "0px 10px", paddingBottom: "100px" }}
          >
            <img style={{ borderRadius: "10px" }} src={p.image}/>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{p.name}</p>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{p.price.toLocaleString()}đ</p>
          </div>
        ))}

      </div>

      <div className={`bottom-nav ${openSearch ? "hide" : ""}`}>

        {/* SEARCH BUTTON */}

        <div
          className="nav-btn nav-center"
          onClick={()=>setOpenSearch(true)}
        >
          <img src="/assets/icons/192.png" alt="search"/>
        </div>
        
        {/* HOME */}

        <Link to="/">
          <div className="nav-btn nav-left">
            <img src="/assets/icons/191.png" alt="home"/>
          </div>
        </Link>

        {/* PROFILE */}

        <div
          className="nav-btn nav-right"
          onClick={()=>navigate(user ? "/profile" : "/auth")}
        >
          <img src="/assets/icons/193.png" alt="auth"/>
        </div>

      </div>

            <SearchOverlay
              open={openSearch}
              close={()=>setOpenSearch(false)}
            />

    </div>
  )

}



