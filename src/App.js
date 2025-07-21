import { Routes, Route, Link } from "react-router-dom";
import ListProduct from "./components/ListProduct";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link> |
                <Link to="/register">Register</Link> |
                <Link to="/login">Login</Link>
            </nav>

            <Routes>
                <Route path="/" element={<ListProduct />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
