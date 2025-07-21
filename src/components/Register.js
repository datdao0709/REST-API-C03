import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css'

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        alert("Đăng ký thành công!");
        navigate("/login");
    };

    return (
        <div className="register-container">
            <h2>Đăng ký</h2>
            <input
                type="text"
                placeholder="Tên đăng ký"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Đăng ký</button>
            <p>Đã có tài khoản? <span onClick={() => navigate("/login")}>Đăng nhập</span></p>
        </div>
    );
}
