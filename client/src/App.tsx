import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Nam from "./pages/Nam"
import Nu from "./pages/Nu"
import Unisex from "./pages/Unisex"
import Auth from "./pages/Auth"
import ProductDetail from "./pages/ProductDetail"
import Profile from "./pages/Profile"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import SearchPage from "./pages/SearchPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nam" element={<Nam />} />
        <Route path="/nu" element={<Nu />} />
        <Route path="/unisex" element={<Unisex />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
