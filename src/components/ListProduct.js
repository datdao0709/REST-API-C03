import {useEffect, useState} from "react";
import axios from "axios";
import "./ListProduct.css";

export default function ListProduct() {
    // State lưu danh sách sản phẩm và danh mục
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState("");

    // State cho sản phẩm mới khi thêm
    const [newProduct, setNewProduct] = useState({
        title: "",
        category: "",
        price: "",
    });

    // State cho sản phẩm đang được chọn để hiện đánh giá
    const [selectedProduct, setSelectedProduct] = useState(null);

    // State cho đánh giá mới
    const [newReview, setNewReview] = useState({
        reviewerName: "",
        comment: "",
        rating: 5,
    });

    // State cho sản phẩm đang chỉnh sửa
    const [editingProduct, setEditingProduct] = useState(null);

    // Load danh sách sản phẩm khi component được mount
    useEffect(() => {
        loadProducts();
    }, []);

    // Gọi API để lấy dữ liệu sản phẩm
    function loadProducts() {
        axios.get("http://localhost:9999/products")
            .then((res) => {
                const list = res.data;
                setProducts(list);
                // Lấy danh sách category duy nhất
                const cats = [...new Set(list.map((p) => p.category))];
                setCategories(cats);
            })
            .catch((err) => {
                console.error("Lỗi load products:", err);
                alert("Không thể tải sản phẩm.");
            });
    }

    // Lọc sản phẩm theo category đang chọn
    function filterProducts() {
        if (!categorySelected) return products;
        return products.filter((p) => p.category === categorySelected);
    }

    // Thêm sản phẩm mới
    function handleAddProduct() {
        if (!(newProduct.title && newProduct.category && newProduct.price)) {
            return alert("Nhập đủ thông tin!");
        }

        axios.post("http://localhost:9999/products", {
            ...newProduct,
            price: parseFloat(newProduct.price),
            reviews: [], // thêm mảng đánh giá rỗng
        })
            .then(() => {
                loadProducts();
                // Reset lại form
                setNewProduct({title: "", category: "", price: ""});
            })
            .catch((e) => {
                console.error("Lỗi thêm product:", e);
                alert("Thêm thất bại.");
            });
    }

    // Xoá sản phẩm theo ID
    function handleDeleteProduct(id) {
        if (!window.confirm("Xóa sản phẩm này?")) return;

        axios.delete(`http://localhost:9999/products/${id}`)
            .then(() => {
                // Nếu đang xem chi tiết sản phẩm bị xóa thì ẩn nó đi
                if (selectedProduct?.id === id) setSelectedProduct(null);
                loadProducts();
            })
            .catch((e) => {
                console.error("Lỗi xóa:", e);
                alert("Xóa thất bại.");
            });
    }

    // Khi click vào sản phẩm => toggle đánh giá (hiện hoặc ẩn)
    function handleSelectProduct(product) {
        if (selectedProduct && selectedProduct.id === product.id) {
            // Nếu đang mở sản phẩm đó => đóng lại
            setSelectedProduct(null);
        } else {
            // Mở sản phẩm đó và reset form đánh giá
            setSelectedProduct(product);
            setNewReview({reviewerName: "", comment: "", rating: 5});
        }
    }

    // Xử lý thay đổi trong form đánh giá
    function handleReviewChange(e) {
        const {name, value} = e.target;
        setNewReview((prev) => ({...prev, [name]: value}));
    }

    // Gửi đánh giá mới lên API
    async function handleSubmitReview() {
        if (!(newReview.reviewerName && newReview.comment)) {
            return alert("Nhập tên và nội dung đánh giá!");
        }

        const updated = {
            ...selectedProduct,
            reviews: [
                ...(selectedProduct.reviews || []),
                {
                    ...newReview,
                    date: new Date().toISOString(),
                },
            ],
        };

        try {
            await axios.put(`http://localhost:9999/products/${selectedProduct.id}`, updated);
            loadProducts();
            setSelectedProduct(null);
        } catch (e) {
            console.error("Review error:", e);
            alert("Gửi không thành công.");
        }
    }

    // Mở form chỉnh sửa sản phẩm
    function handleEdit(product) {
        setEditingProduct(product);
    }

    // Xử lý khi thay đổi nội dung trong form edit
    function handleEditChange(e) {
        const {name, value} = e.target;
        setEditingProduct((prev) => ({...prev, [name]: value}));
    }

    // Lưu lại sản phẩm sau khi chỉnh sửa
    async function handleSaveEdit() {
        try {
            await axios.put(`http://localhost:9999/products/${editingProduct.id}`, editingProduct);
            loadProducts();
            setEditingProduct(null);
        } catch (e) {
            console.error("Save error:", e);
            alert("Lưu không thành công.");
        }
    }

    return (
        <div className="container">
            {/* KHỐI TRÁI */}
            <div className="left">
                <h1>Danh sách sản phẩm</h1>

                {/* Nút lọc theo danh mục */}
                <div className="category-buttons">
                    <button onClick={() => setCategorySelected("")}>All</button>
                    {categories.map((c, idx) => (
                        <button key={idx} onClick={() => setCategorySelected(c)}>{c}</button>
                    ))}
                </div>

                {/* Form thêm sản phẩm mới */}
                <div className="add-product-form">
                    <h2>Add Product</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                    <button className="add-product-btn" onClick={handleAddProduct}>
                        Add Product
                    </button>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="product-list">
                    {filterProducts().map((p) => (
                        <div
                            key={p.id}
                            className="product-item"
                            onClick={() => handleSelectProduct(p)}
                        >
                            <strong>{p.title}</strong> - {p.category} - ${p.price}
                            <button onClick={(e) => {
                                e.stopPropagation(); // tránh trigger chọn sản phẩm
                                handleEdit(p);
                            }}>Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProduct(p.id);
                                }}
                                className="delete"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Hiển thị đánh giá nếu chọn sản phẩm */}
                {selectedProduct && (
                    <div className="review-form">
                        <h2>Đánh giá: {selectedProduct.title}</h2>

                        {/* Danh sách đánh giá cũ */}
                        {selectedProduct.reviews?.length > 0 && (
                            <ul>
                                {selectedProduct.reviews.map((r, i) => (
                                    <li key={i}>
                                        <strong>{r.reviewerName}</strong> ({new Date(r.date).toLocaleDateString()}):
                                        <em> "{r.comment}"</em> ⭐️ {r.rating}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Form thêm đánh giá */}
                        <h3>Thêm đánh giá mới</h3>
                        <input
                            name="reviewerName"
                            placeholder="Tên người đánh giá"
                            value={newReview.reviewerName}
                            onChange={handleReviewChange}
                        />
                        <textarea
                            name="comment"
                            placeholder="Nội dung đánh giá"
                            value={newReview.comment}
                            onChange={handleReviewChange}
                        />
                        <select
                            name="rating"
                            value={newReview.rating}
                            onChange={handleReviewChange}
                        >
                            {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <button onClick={handleSubmitReview}>Gửi đánh giá</button>
                    </div>
                )}
            </div>

            {/* KHỐI PHẢI: Form chỉnh sửa sản phẩm */}
            <div className="right">
                {editingProduct && (
                    <>
                        <h2>Edit Product</h2>
                        <label>Title</label>
                        <input
                            name="title"
                            value={editingProduct.title}
                            onChange={handleEditChange}
                        />
                        <label>Category</label>
                        <input
                            name="category"
                            value={editingProduct.category}
                            onChange={handleEditChange}
                        />
                        <label>Price</label>
                        <input
                            name="price"
                            type="number"
                            value={editingProduct.price}
                            onChange={handleEditChange}
                        />
                        <div className="button-group">
                            <button onClick={handleSaveEdit}>Save</button>
                            <button className="cancel" onClick={() => setEditingProduct(null)}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
