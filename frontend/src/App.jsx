import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Structure from "./pages/Structure.jsx";
import DashBoard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import Doctor from "./pages/Doctor.jsx";
import AddDoctor from "./pages/EmployeeTasks/AddDoctor.jsx";
import Employee from "./pages/Employee.jsx";
import AddEmployee from "./pages/EmployeeTasks/AddEmployee.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/EmployeeTasks/AddProduct.jsx";
import Sales from "./pages/Sales.jsx";
import AddSale from "./pages/EmployeeTasks/AddSales.jsx";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["OWNER", "RBM", "ABM", "EMPLOYEE"]}>
        <Structure>
          <DashBoard />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/employees",
    element: (
      <ProtectedRoute allowedRoles={["OWNER", "RBM", "ABM"]}>
        <Structure>
          <Employee />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/employees/addEmployee",
    element: (
      <ProtectedRoute allowedRoles={["OWNER", "RBM", "ABM"]}>
        <Structure>
          <AddEmployee />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctors",
    element: (
      <ProtectedRoute>
        <Structure>
          <Doctor />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/doctors/addDoctor",
    element: (
      <ProtectedRoute allowedRoles={["ABM", "EMPLOYEE"]}>
        <Structure>
          <AddDoctor />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={["OWNER", "RBM", "ABM", "EMPLOYEE"]}>
        <Structure>
          <Products />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/products/addProduct",
    element: (
      <ProtectedRoute allowedRoles={["OWNER", "RBM"]}>
        <Structure>
          <AddProduct />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sales",
    element: (
      <ProtectedRoute allowedRoles={["OWNER", "RBM", "ABM", "EMPLOYEE"]}>
        <Structure>
          <Sales />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/sales/addSale",
    element: (
      <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
        <Structure>
          <AddSale />
        </Structure>
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Login />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
