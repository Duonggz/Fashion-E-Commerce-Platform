import API_BASE_URL from "../config/api"
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Login()  {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem("token")
  }, [])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username,
        password
      })

      localStorage.setItem("token", res.data.token)

      localStorage.setItem(
        "admin",
        JSON.stringify({
          username: username
        })
      )

      navigate("/dashboard/products")
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu")
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.box}>
        <h2>Admin Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    padding: "30px",
    border: "1px solid #ddd"
  } 
}

export default Login



