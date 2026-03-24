import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import "../styles/admin.css"
import Products from "./Products"
import ManageProducts from "./ManageProducts"
import Orders from "./orders"



const Dashboard = () => {

  const navigate = useNavigate()

  useEffect(() => {

    const admin = JSON.parse(
      localStorage.getItem("admin") || "null"
    )

    if (!admin) {
      navigate("/", { replace: true })
    }

    const token = localStorage.getItem("token")
    if (!token){
      navigate("/")
    }
      window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload()
    }
  }

  }, [])

  const handleLogout = () => {
  localStorage.removeItem("token")

  navigate("/")
}

  return (

    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        <h3>Admin</h3>

        <button onClick={handleLogout}>Logout</button>

        <Link to="/dashboard/products">Add Product</Link>

        <Link to="/dashboard/manage-products">Manage Products</Link>

        
        <Link to="/dashboard/orders">Orders</Link>


      </div>

      {/* CONTENT */}
      <div style={styles.content}>

        <Routes>

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="manage-products"
            element={<ManageProducts />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

        </Routes>

      </div>

    </div>

  )
}

const styles = {

  sidebar: {
    width: "200px",
    background: "#111",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px"
  },

  content: {
    flex: 1,
    padding: "20px"
  }

}

export default Dashboard


