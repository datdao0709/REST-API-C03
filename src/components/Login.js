import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === "ADMIN" && password === "ADMIN") {
            navigate("/");
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Đăng nhập</button>
            <p>Bạn chưa có tài khoản? <span onClick={() => navigate("/register")}>Đăng ký</span></p>
        </div>
    );
}
