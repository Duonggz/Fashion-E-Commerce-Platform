import { useNavigate } from "react-router-dom"

interface Props{
  product:any
  close:()=>void
}
export default function SearchResultItem({product,close}:Props){
  const navigate = useNavigate()
  const openProduct = () => {
    close()
    navigate(`/product/${product._id}`)
  }
  return(
    <div className="search-item" onClick={openProduct}>
      <img src={product.image} alt={product.name} />
      <div className="search-info">
        <p className="search-name">{product.name}</p>
        <p className="search-price">
          {product.price.toLocaleString()}đ
        </p>
      </div>
    </div>
  )

}



