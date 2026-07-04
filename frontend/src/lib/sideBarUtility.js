import home from "../assets/images/home.png";
import doctor from "../assets/images/doctor.png";
import employee from "../assets/images/ProfileMenuImage.png";
import product from "../assets/images/productIcon.png";
import sale from "../assets/images/salesIcon.png";

const dashboard = {
  name: "Dashboard",
  path: "/dashboard",
  icon: home,
};

const doctors = {
  name: "Doctors",
  path: "/doctors",
  icon: doctor,
};

const employees = {
  name: "Employees",
  path: "/employees",
  icon: employee,
};

const products = {
  name: "Products",
  path: "/products",
  icon: product,
};

const sales = {
  name: "Sales",
  path: "/sales",
  icon: sale,
};

export const sidebarMenus = {
  OWNER: [dashboard, doctors, employees, products, sales],
  RBM: [dashboard, doctors, employees, products, sales],
  ABM: [dashboard, doctors, employees, products, sales],
  EMPLOYEE: [dashboard, doctors, products, sales],
};
