import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { searchProducts } from "../services/productService"
import SearchOverlay from "../components/SearchOverlay"

export default function SearchPage() {

  const user = JSON.parse(localStorage.getItem("user") || "null")
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [openSearch, setOpenSearch] = useState(false)

  const keyword = params.get("q") || ""

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const load = async () => {
      const data = await searchProducts(keyword)
      setProducts(data)
    }

    if (keyword) load()

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [keyword])

  return (
    <div>

      {/* HEADER */}
      <header className="category-header">
        <div className="category-logo">
          <Link to="/">
            <img src="/assets/icons/logotmdt3.png" alt="logo" />
          </Link>
        </div>

        <div className="category-icons">
          <Link to={user ? "/profile" : "/auth"}>
            <img src="/assets/icons/193.png" alt="user" />
          </Link>
          <Link to="/cart">
            <img src="/assets/icons/194.png" alt="cart" />
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <div style={{
        position: "fixed",
        top: "72px",
        bottom: "90px",
        left: 0,
        right: 0,
        overflowY: "auto",
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      } as React.CSSProperties}>

        <h2 style={{ padding: "20px 40px 0" }}>
          Search results: "{keyword}"
        </h2>

        <div className="product-grid">
          {products.map((p) => (
            <div
              key={p._id}
              className="product-card"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <img
                className="product-image"
                src={p.image}
                alt={p.name}
              />
              <p className="product-name">{p.name}</p>
              <p className="product-price">{p.price.toLocaleString()}đ</p>
            </div>
          ))}
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div className={`bottom-nav ${openSearch ? "hide" : ""}`}>

        <Link to="/">
          <div className="nav-btn nav-left">
            <img src="/assets/icons/191.png" alt="home" />
          </div>
        </Link>

        <div
          className="nav-btn nav-center"
          onClick={() => setOpenSearch(true)}
        >
          <img src="/assets/icons/192.png" alt="search" />
        </div>

        <div
          className="nav-btn nav-right"
          onClick={() => navigate(user ? "/profile" : "/auth")}
        >
          <img src="/assets/icons/193.png" alt="auth" />
        </div>

      </div>

      <SearchOverlay
        open={openSearch}
        close={() => setOpenSearch(false)}
      />

    </div>
  )
}