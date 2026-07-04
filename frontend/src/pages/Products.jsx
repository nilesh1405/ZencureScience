import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../lib/axios.js";
import ProductCard from "../components/common/ProductCard.jsx";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const isOpen = useSelector((state) => state.ui.sideBar);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/search?search=${search}`);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [search]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/products/getAllProducts?limit=2");

        setProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleClick = () => {
    navigate("/products/addProduct");
  };

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-5 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0 overflow-y-auto`}
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Products
          </h1>

          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Manage all your products here
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            className="font-bold shadow rounded border px-4 py-2 w-full sm:w-auto"
            onClick={handleClick}
          >
            Add Product
          </button>

          <input
            type="text"
            placeholder="Find Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-3 w-full sm:w-64"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center text-lg font-semibold">
          Loading products...
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-xl font-semibold">No products found</h2>

          <p className="mt-2 text-gray-500">
            Add some products to get started.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
