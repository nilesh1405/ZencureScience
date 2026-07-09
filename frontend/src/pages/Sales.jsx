import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Sales() {
  const Navigate = useNavigate();
  const isOpen = useSelector((state) => state.ui.sideBar);
  const user = useSelector((state) => state.auth.user);
  const role = user.role;
  const [sales, setSales] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [products, setProducts] = useState([]);
  const [cities, setCities] = useState([]);

  const [filters, setFilters] = useState({
    employee: "",
    doctor: "",
    product: "",
    from: "",
    to: "",
    cities: [],
  });

  useEffect(() => {
    loadFilters();
    fetchSales();
  }, []);

  const loadFilters = async () => {
    const [emp, doc, pro, cityRes] = await Promise.all([
      api.get("/company/getAllEmployees"),
      api.get("/doctors/getAllDoctors"),
      api.get("/products/getAllProducts"),
      api.get("/company/getAssignedCities"),
    ]);

    setEmployees(emp.data);
    setDoctors(doc.data);
    setProducts(pro.data);
    setCities(cityRes.data.cities);
  };

  const fetchSales = async () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, val]) => {
      if (key === "cities") return;

      if (val) params.append(key, val);
    });

    filters.cities.forEach((city) => {
      params.append("city", city);
    });

    const { data } = await api.get(`/sales/getSales?${params}`);

    setSales(data);
  };

  useEffect(() => {
    fetchSales();
  }, [filters]);

  const handleCityChange = (city) => {
    setFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };
  const handleClick = () => {
    Navigate("/sales/addSale");
  };

  const totalAmount = sales.reduce((a, b) => a + b.totalPrice, 0);

  const totalQuantity = sales.reduce((a, b) => a + b.quantity, 0);

  return (
    <div
      className={`bg-yellow-300 m-2 sm:m-4 p-3 sm:p-5 rounded-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-[78%] sm:w-[81%]" : "w-[95%] sm:w-[93%]"
      } h-full absolute right-0 overflow-y-auto`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold">Sales Report</h1>

        <button
          className="font-bold shadow rounded border px-4 py-2 w-full sm:w-auto"
          onClick={handleClick}
        >
          Add Sales
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
        <select
          value={filters.employee}
          onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Employees</option>

          {employees.map((e) => (
            <option key={e._id} value={e._id}>
              {` ${e.name} (${e.role}) `}
            </option>
          ))}
        </select>

        <select
          value={filters.doctor}
          onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Doctors</option>

          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={filters.product}
          onChange={(e) => setFilters({ ...filters, product: e.target.value })}
          className="border rounded p-2"
        >
          <option value="">All Products</option>

          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          max={new Date().toISOString().split("T")[0]}
          className="border rounded p-2"
        />

        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          max={new Date().toISOString().split("T")[0]}
          className="border rounded p-2"
        />
      </div>

      {role !== "EMPLOYEE" && (
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Cities</h3>

          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <label key={city} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.cities.includes(city)}
                  onChange={() => handleCityChange(city)}
                />
                {city}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-base sm:text-lg">
          Total Sales : ₹{totalAmount}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-[800px] w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Date</th>
              <th className="border p-3">Employee</th>
              <th className="border p-3">Doctor</th>
              <th className="border p-3">Product</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border p-3">
                  {new Date(s.date).toLocaleDateString()}
                </td>

                <td className="border p-3">{s.employeeId?.name}</td>

                <td className="border p-3">{s.doctorId?.name}</td>

                <td className="border p-3">{s.productId?.name}</td>

                <td className="border p-3">{s.quantity}</td>

                <td className="border p-3">₹{s.unitPrice}</td>

                <td className="border p-3 font-semibold">₹{s.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
