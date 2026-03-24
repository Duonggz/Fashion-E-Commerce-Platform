import type { FC } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import "../assets/styles/category.css"
import "../assets/styles/search.css"
import SearchOverlay from "../components/SearchOverlay"

interface CategoryProps {
  title: string
}

interface Product {
  _id: string
  name: string
  price: number
  image: string
}

const Category: FC<CategoryProps> = ({ title }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [openSearch, setOpenSearch] = useState(false)

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    document.body.style.overflow = "auto"

    axios
      .get(`http://localhost:3000/api/products/tag/${title}`)
      .then(res => {
        setProducts(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [title])

  return (
    <div>
      <header className="category-header">
        <nav className="web-menu">
          <Link to="/nu" className="menu-item">NỮ</Link>
          <Link to="/nam" className="menu-item">NAM</Link>
           {/* <Link to="/unisex" className="menu-item">UNISEX</Link> */} 
        </nav>

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

      <div className="category-content">
        <div className="product-grid">
          {products.map(product => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  {product.price.toLocaleString()}đ
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={`bottom-nav ${openSearch ? "hide" : ""}`}>
        <Link to="/">
          <div className="nav-btn nav-left">
            <img src="/assets/icons/191.png" alt="nav1" />
          </div>
        </Link>

        <div
          className="nav-btn nav-center"
          onClick={() => setOpenSearch(true)}
        >
          <img src="/assets/icons/192.png" alt="nav2" />
        </div>

        <div
          className="nav-btn nav-right"
          onClick={() => navigate(user ? "/profile" : "/auth")}
        >
          <img src="/assets/icons/193.png" alt="nav3" />
        </div>
      </div>

      <SearchOverlay
        open={openSearch}
        close={() => setOpenSearch(false)}
      />
    </div>
  )
}

export default Category