import React from "react";
import { useState, useEffect } from "react";
import { getProducts } from "../apis/productApi";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h1>상품 목록</h1>
      <ul>
        {products.map((data) => (
          <li key={data.product_id}>
            <h2>{data.product_name}</h2>
            <p>{data.product_description}</p>
            <p>{data.product_image_url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductListPage;
