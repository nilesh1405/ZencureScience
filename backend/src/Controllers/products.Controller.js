import Product from "../Models/Product.Models.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
    });

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error in addProduct controller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProducts controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    if (!price) {
      return res.status(400).json({ message: "All Fields are required" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.price = price;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const search = async (req, res) => {
  try {
    const { search } = req.query;
    const products = await Product.find({
      name: { $regex: search || "", $options: "i" },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
