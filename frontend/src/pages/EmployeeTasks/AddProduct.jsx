import { useState } from "react";
import { api } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.sideBar);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/products/addProduct",
        {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
        },
        {
          withCredentials: true,
        },
      );

      toast.success(res.data.message || "Product added successfully");

      setFormData({
        name: "",
        description: "",
        price: "",
      });
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
      <div className="w-full max-w-lg mx-auto rounded-xl p-2 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Add Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
