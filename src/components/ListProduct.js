import { useEffect, useState } from "react";
import axios from "axios";
import "./ListProduct.css";

export default function ListProduct() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null); // thêm state để sửa sản phẩm

    useEffect(() => {
        loadProducts();
    }, []);

    function loadProducts() {
        axios.get("http://localhost:9999/products").then((response) => {
            const list = response.data;
            const listCategories = [...new Set(list.map((product) => product.category))];
            setProducts(list);
            setCategories(listCategories);
        });
    }

    function filterProducts() {
        if (!categorySelected) return products;
        return products.filter((product) => product.category === categorySelected);
    }

    function handleProductClick(product) {
        setSelectedProduct(product);
    }

    function handleEdit(product) {
        setEditingProduct(product); // mở form sửa ở cột bên phải
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setEditingProduct(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSaveEdit() {
        axios.put(`http://localhost:9999/products/${editingProduct.id}`, editingProduct)
            .then(() => {
                loadProducts();
                setEditingProduct(null);
            });
    }

    return (
        <div className="container">
            {/* Left: 7 phần */}
            <div className="left">
                <h1>List Product</h1>

                <div>
                    <button onClick={() => {
                        setCategorySelected(null);
                        setSelectedProduct(null);
                    }}>
                        All
                    </button>
                    {categories.map((category, index) => (
                        <button key={index} onClick={() => {
                            setCategorySelected(category);
                            setSelectedProduct(null);
                        }}>
                            {category}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: "20px" }}>
                    {filterProducts().map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                margin: "10px 0",
                                cursor: "pointer"
                            }}
                        >
                            <strong>{product.title}</strong> - {product.category} - ${product.price}
                            <button style={{ float: "right" }} onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(product);
                            }}>
                                Edit
                            </button>
                        </div>
                    ))}
                </div>

                {selectedProduct && (
                    <div style={{ marginTop: "30px" }}>
                        <h2>Reviews for: {selectedProduct.title}</h2>
                        {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                            <ul>
                                {selectedProduct.reviews.map((review, index) => (
                                    <li key={index} style={{ marginBottom: "10px" }}>
                                        <strong>{review.reviewerName}</strong> ({new Date(review.date).toLocaleDateString()}):<br />
                                        <em>"{review.comment}"</em><br />
                                        ⭐ {review.rating}/5
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Không có đánh giá nào.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Right: 3 phần */}
            <div className="right">
                {editingProduct && (
                    <>
                        <h2>Edit Product</h2>
                        <div>
                            <label>Title:</label><br />
                            <input
                                type="text"
                                name="title"
                                value={editingProduct.title}
                                onChange={handleInputChange}
                            /><br />

                            <label>Category:</label><br />
                            <input
                                type="text"
                                name="category"
                                value={editingProduct.category}
                                onChange={handleInputChange}
                            /><br />

                            <label>Price:</label><br />
                            <input
                                type="number"
                                name="price"
                                value={editingProduct.price}
                                onChange={handleInputChange}
                            /><br /><br />

                            <button onClick={handleSaveEdit}>Save</button>
                            <button onClick={() => setEditingProduct(null)} style={{ marginLeft: "10px" }}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
