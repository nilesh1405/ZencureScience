import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/axios.js";
import { showSuccess, showError } from "../../lib/toast";

export default function AddSale() {
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.sideBar);

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: "",
    productId: "",
    quantity: "",
    unitPrice: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchDoctors();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/getAllProducts");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctors/getAllDoctors");
      setDoctors(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDoctorChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      doctorId: e.target.value,
    }));
  };

  const handleProductChange = (e) => {
    const id = e.target.value;

    const product = products.find((p) => p._id === id);

    setFormData((prev) => ({
      ...prev,
      productId: id,
      unitPrice: product ? product.price : 0,
    }));
  };

  const handleQuantity = (e) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Number(e.target.value),
    }));
  };

  const totalPrice = useMemo(() => {
    return formData.quantity * formData.unitPrice;
  }, [formData.quantity, formData.unitPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/sales/addSale", {
        doctorId: formData.doctorId,
        productId: formData.productId,
        quantity: formData.quantity,
        totalPrice,
      });

      showSuccess("Sale added successfully");

      navigate("/sales");
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-5 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0 overflow-y-auto`}
    >
      <div className="w-full max-w-xl mx-auto p-2 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Add Sale
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor */}
          <div>
            <label className="block mb-2 font-medium">Select Doctor</label>

            <select
              required
              value={formData.doctorId}
              onChange={handleDoctorChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block mb-2 font-medium">Select Product</label>

            <select
              required
              value={formData.productId}
              onChange={handleProductChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-2 font-medium">Quantity</label>

            <input
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={handleQuantity}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="block mb-2 font-medium">Unit Price</label>

            <input
              type="number"
              readOnly
              value={formData.unitPrice}
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>

          {/* Total */}
          <div>
            <label className="block mb-2 font-medium">Total Price</label>

            <input
              type="number"
              readOnly
              value={totalPrice}
              className="w-full border rounded-lg p-3 bg-gray-100 font-bold"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Sale"}
          </button>
        </form>
      </div>
    </div>
  );
}
